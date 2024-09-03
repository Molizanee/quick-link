import { useState } from "react";
import { uploadFile } from "@/api/upload-file";
import { toast } from "sonner";

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
			toast.success("File uploaded successfully!", {
				classNames: {
					actionButton: "bg-emerald-500 text-slate-100",
					icon: "text-emerald-500",
					toast: "bg-zinc-950 border border-zinc-800",
					title: "text-emerald-500",
				},
				duration: 10000,
				action: {
					label: "Copy Link",
					onClick: handleCopyLink,
				},
			});
		} catch (error) {
			console.error("Error uploading file:", error);
			toast("Failed to upload file", { type: "error" });
		}
	};

	return { onSubmit, handleCopyLink, clearIdFromUrl };
}
