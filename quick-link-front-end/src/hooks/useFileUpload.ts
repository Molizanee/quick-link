import { useState } from "react";
import { uploadFile } from "@/api/upload-file";
import { toast } from "sonner";
import { Button } from "@/components/button";

type ResetFunction = () => void;

interface UploadResponse {
	id: string;
}

export function useFileUpload(reset: ResetFunction, ipAddress: string) {
	const [fileId, setFileId] = useState<string | null>(null);

	const handleCopyLink = () => {
		if (fileId) {
			const currentUrl = window.location.href;
			const fullUrl = `${currentUrl}?id=${fileId}`;
			navigator.clipboard.writeText(fullUrl);
			console.log("Link copied to clipboard:", fullUrl);
		}
	};

	const onSubmit = async (data: { file: FileList }) => {
		try {
			const file = data.file[0];
			const response: UploadResponse = await uploadFile(file, ipAddress);
			setFileId(response.id);
			reset();
			toast("File uploaded successfully", {
				richColors: true,
				action: () => handleCopyLink(),
			});
		} catch (error) {
			console.error("Error uploading file:", error);
			toast("Failed to upload file", { type: "error" });
		}
	};

	return { onSubmit, handleCopyLink };
}
