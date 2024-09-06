import { bucket, db } from "@/config/firebase";
import { encryptFile } from "@/utils/encrypt-files";
import type { Request } from "express";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (file: Express.Multer.File, req: Request) => {
	const secretKey = process.env.ENCRYPTION_KEY || "my_secret_key";
	const { encryptedFile, iv } = encryptFile(file.buffer, secretKey);

	// Generate a unique ID for the file
	const fileId = uuidv4();
	const fileName = `${fileId}-${file.originalname}`;
	const fileRef = bucket.file(fileName);

	// Upload the encrypted file to Firebase Storage
	await fileRef.save(encryptedFile, { contentType: file.mimetype });

	// Get file URL
	const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

	// Get the client's IP address
	const ipAddress =
		req.headers["x-forwarded-for"] || req.connection.remoteAddress;

	// Save metadata to Firestore
	const docRef = await db.collection("files").add({
		id: fileId,
		file_name: fileName,
		file_url: fileUrl,
		created_at: new Date(),
		ip_address: ipAddress,
		iv: iv.toString("hex"),
	});

	return { id: docRef.id };
};

export const getFileById = async (id: string) => {
	const docRef = db.collection("files").doc(id);
	const doc = await docRef.get();

	if (!doc.exists) {
		return null;
	}

	const data = doc.data();

	const fileRef = bucket.file(data?.file_name);
	const [encryptedFile] = await fileRef.download();

	return {
		...data,
		encryptedFile,
	};
};
