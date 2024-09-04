import { uploadFile } from "@/api/upload-file";
import { useState } from "react";
import { toast } from "sonner";

type ResetFunction = () => void;

interface UploadResponse {
	id: string;
}

export function useFileUpload(reset: ResetFunction, ipAddress: string) {
	const [fileId, setFileId] = useState<string | null>(null);

	const handleCopyLink = () => {
		console.log("Copying link to clipboard...");
		if (fileId) {
			const currentUrl = window.location.href;
			const fullUrl = `${currentUrl}?id=${fileId}`;
			navigator.clipboard
				.writeText(fullUrl)
				.then(() => {
					alert(fullUrl);
					console.log("Link copied to clipboard:", fullUrl);
				})
				.catch((error) => {
					console.error("Failed to copy link to clipboard:", error);
				});
		}
	};

	const clearIdFromUrl = (setId: () => null) => {
		const currentUrl = window.location.href;
		const url = new URL(currentUrl);
		url.searchParams.delete("id");
		window.history.replaceState({}, "", url.toString());
		setId(null);
	};

	const onSubmit = async (data: { file: FileList }) => {
		try {
			const file = data.file[0];
			const response: UploadResponse = await uploadFile(file, ipAddress);
			setFileId(response.id);
			reset();
		} catch (error) {
			console.error("Error uploading file:", error);
			toast.error("Error uploading file, see the logs to more details!", {
				duration: 5000,
				position: "top-center",
				classNames: {
					toast: "bg-zinc-950 border border-zinc-800",
					title: "text-red-400",
					actionButton: "bg-red-400 text-slate-100",
					icon: "text-red-400",
				},
			});
		}
	};

	return { onSubmit, handleCopyLink, clearIdFromUrl };
}
