import type { Request, Response } from "express";
import { uploadFile, getFileById } from "@/service/file-service";

export const uploadFileController = async (req: Request, res: Response) => {
	try {
		if (!req.file) return res.status(400).json({ message: "No file uploaded" });

		const response = await uploadFile(req.file);
		res.status(200).json(response);
	} catch (error) {
		console.error("Error in uploadFileController:", error);
		res.status(500).json({ message: "Error uploading file" });
	}
};

export const downloadFileController = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const fileData = await getFileById(id);

		if (!fileData) return res.status(404).json({ message: "File not found" });

		res.setHeader("Content-Type", fileData.mimeType);
		res.send(fileData.decryptedFile);
	} catch (error) {
		console.error("Error in downloadFileController:", error);
		res.status(500).json({ message: "Error downloading file" });
	}
};

export const getFileByIdController = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const fileData = await getFileById(id);
		res.status(200).json(fileData);
	} catch (error) {
		console.error("Error in getFileByIdController:", error);
		res.status(500).json({ message: "Error getting file" });
	}
};
