import type { Request, Response } from "express";
import { storage, db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import type { FileDocument } from "../types/file-document";
import multer from "multer";
import crypto from "node:crypto";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Convert base64-encoded key and IV to Buffers
const ENCRYPTION_KEY = await Buffer.from(
	process.env.ENCRYPTION_KEY || "",
	"base64",
); // 32 bytes for AES-256
const ENCRYPTION_IV = await Buffer.from(
	process.env.ENCRYPTION_IV || "",
	"base64",
);

if (ENCRYPTION_KEY.length !== 32 || ENCRYPTION_IV.length !== 16) {
	// 16 bytes for AES

	// Validate key and IV length
	throw new Error(
		"Invalid key or IV length. Key must be 32 bytes, IV must be 16 bytes.",
	);
}

// Encryption logic
function encrypt(buffer: Buffer) {
	const cipher = crypto.createCipheriv(
		"aes-256-cbc",
		ENCRYPTION_KEY,
		ENCRYPTION_IV,
	);
	let encrypted = cipher.update(buffer);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return { iv: ENCRYPTION_IV.toString("hex"), data: encrypted.toString("hex") };
}

// Multer setup to handle file uploads
const upload = multer({ storage: multer.memoryStorage() }).single("file");

// Controller to handle file uploads
export const createFile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	upload(req, res, async (err: any) => {
		if (err) {
			return res.status(400).send({ message: "Failed to upload file." });
		}

		if (!req.file) {
			return res.status(400).send({ message: "No file uploaded." });
		}

		try {
			const id = uuidv4(); // Generate unique ID for the file
			const bucket = storage.bucket(); // Get Firebase Storage bucket

			// Encrypt the file buffer before uploading
			const { iv, data } = encrypt(req.file.buffer);

			// Define the file in Firebase Storage
			const blob = bucket.file(`${id}-${req.file.originalname}`);
			const blobStream = blob.createWriteStream({
				resumable: false,
				metadata: {
					contentType: req.file.mimetype,
				},
			});

			blobStream.on("error", (err) => {
				console.error("Upload failed:", err);
				res.status(500).send({ message: "Upload failed." });
			});

			blobStream.on("finish", async () => {
				// Optionally, make the file public
				await blob.makePublic();

				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

				// Save metadata to Firestore
				const newDocument: FileDocument = {
					id: id,
					created_at: new Date(),
					file_url: publicUrl,
					file_name: blob.name,
					ip_address: req.body.ip_address,
					iv: iv, // Store the IV for later decryption
				};

				await db.collection("files").doc(id).set(newDocument);

				// Respond with the document ID and the public URL
				res.status(201).json({
					id: newDocument.id,
					file_url: publicUrl,
				});
			});

			// Write the encrypted file data to Firebase Storage
			blobStream.end(Buffer.from(data, "hex"));
		} catch (error) {
			console.error("Error creating file and document:", error);
			res.status(500).send({ message: "Internal server error." });
		}
	});
};

// Controller to handle file retrieval
export const getFileDetails = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { id } = req.params;

	try {
		// Retrieve the file metadata from Firestore
		const doc = await db.collection("files").doc(id).get();

		if (!doc.exists) {
			res.status(404).send({ message: "File not found." });
			return;
		}

		// Get the file data from Firestore
		const fileData = doc.data() as FileDocument;

		// Return the file metadata as JSON, without exposing sensitive information (like the IV)
		res.status(200).json({
			file_name: fileData.file_name,
			ip_address: fileData.ip_address,
		});
	} catch (error) {
		console.error("Error getting file details:", error);
		res.status(500).send({ message: "Internal server error." });
	}
};

import mime from "mime-types"; // Ensure you have this installed for MIME type handling

export const downloadFile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { id } = req.params;

	try {
		// Retrieve the file metadata from Firestore
		const doc = await db.collection("files").doc(id).get();

		if (!doc.exists) {
			res.status(404).send({ message: "File not found." });
			return;
		}

		// Get the file data from Firestore
		const fileData = doc.data() as FileDocument;

		const bucket = storage.bucket();
		const file = bucket.file(fileData.file_name);

		// Download the encrypted file as a buffer from Firebase Storage
		const [encryptedBuffer] = await file.download();

		// Decrypt the file using the stored IV and encryption key
		const ivBuffer = Buffer.from(fileData.iv, "hex");
		const decipher = crypto.createDecipheriv(
			"aes-256-cbc",
			ENCRYPTION_KEY,
			ivBuffer,
		);
		let decrypted = decipher.update(encryptedBuffer);
		decrypted = Buffer.concat([decrypted, decipher.final()]);

		// Extract the original file name and extension
		let originalFileName =
			fileData.file_name.split("-")[1] || "downloaded_file";
		let fileExtension = originalFileName.split(".").pop();

		// If file extension is missing, infer it from the content type
		if (!fileExtension || !mime.lookup(fileExtension)) {
			fileExtension = mime.extension(file.metadata.contentType) || "bin";
			originalFileName = `${originalFileName}.${fileExtension}`;
		}

		// Set the correct MIME type based on the file extension or use a default
		const mimeType = mime.lookup(fileExtension) || "application/octet-stream";

		// Set the headers for file download
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${originalFileName}"`,
		);
		res.setHeader("Content-Type", mimeType);

		// Send the decrypted buffer as binary data
		res.status(200).send(decrypted);
	} catch (error) {
		console.error("Error downloading file:", error);
		res.status(500).send({ message: "Internal server error." });
	}
};
