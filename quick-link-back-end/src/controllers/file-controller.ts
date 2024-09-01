import type { Request, Response } from "express";
import { storage, db } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import type { FileDocument } from "../types/file-document";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }).single("file");

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
			const id = uuidv4();
			const bucket = storage.bucket();
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

				// Get the public URL of the uploaded file
				const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

				const newDocument: FileDocument = {
					id: id,
					created_at: new Date(),
					file_url: publicUrl,
					file_name: blob.name,
					ip_address: req.body.ip_address,
				};

				await db.collection("files").doc(id).set(newDocument);

				// Respond with the document ID and the public URL
				res.status(201).json({
					id: newDocument.id,
					file_url: publicUrl,
				});
			});

			blobStream.end(req.file.buffer);
		} catch (error) {
			console.error("Error creating file and document:", error);
			res.status(500).send({ message: "Internal server error." });
		}
	});
};

export const getFile = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const doc = await db.collection("files").doc(id).get();

		if (!doc.exists) {
			res.status(404).send({ message: "File not found." });
			return;
		}

		const fileData = doc.data() as FileDocument;

		res.status(200).json(fileData);
	} catch (error) {
		console.error("Error getting file:", error);
		res.status(500).send({ message: "Internal server error." });
	}
};

export const deleteFile = async (
	req: Request,
	res: Response,
): Promise<void> => {
	const { id } = req.params;

	try {
		const doc = await db.collection("files").doc(id).get();

		if (!doc.exists) {
			res.status(404).send({ message: "File not found." });
			return;
		}

		const fileData = doc.data() as FileDocument;

		// Delete file from Firebase Storage using the correct path (without bucket name)
		const file = storage.bucket().file(fileData.file_name);
		await file.delete();

		// Delete the document from Firestore
		await db.collection("files").doc(id).delete();

		res.status(200).send({ message: "File deleted." });
	} catch (error) {
		console.error("Error deleting file:", error);
		res.status(500).send({ message: "Internal server error." });
	}
};
