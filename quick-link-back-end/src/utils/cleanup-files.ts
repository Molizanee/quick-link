import { db, storage } from "../config/firebase";
import type { FileDocument } from "../types/file-document";
import { Timestamp } from "firebase-admin/firestore";

const deleteFiles = async () => {
	try {
		const now = new Date();
		const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

		// Query for documents older than 1 hour
		const querySnapshot = await db
			.collection("files")
			.where("created_at", "<", Timestamp.fromDate(oneHourAgo))
			.get();

		if (querySnapshot.empty) {
			console.log("No files to delete.");
			return;
		}

		const batch = db.batch();

		// Iterate over each document and delete the file from storage and the document from Firestore
		querySnapshot.forEach(async (doc) => {
			const fileData = doc.data() as FileDocument;

			// Delete file from Firebase Storage
			const file = storage.bucket().file(fileData.file_url);
			await file.delete();
			console.log(`Deleted file: ${fileData.file_url}`);

			// Delete the document from Firestore
			batch.delete(doc.ref);
			console.log(`Deleted document with ID: ${doc.id}`);
		});

		// Commit the batch delete operation
		await batch.commit();
		console.log("Batch delete committed.");
	} catch (error) {
		console.error("Error deleting old files:", error);
	}
};

export default deleteFiles;
