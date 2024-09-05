import { uploadFile } from "@/api/upload-file";
import { useState } from "react";
import { toast } from "sonner";

type UseFileUploadProps = {
	reset?: () => void;
	ipAddress?: string;
};

type UploadResponse = {
	id: string;
};

export const useFileUpload = ({ reset, ipAddress }: UseFileUploadProps) => {
	const [fileId, setFileId] = useState<string | null>(null);

	const handleCopyLink = () => {
		if (fileId) {
			const currentUrl = window.location.href;
			const fullUrl = `${currentUrl}?id=${fileId}`;
			alert(fullUrl);
			navigator.clipboard
				.writeText(fullUrl)
				.then(() => {
					alert(fullUrl);
				})
				.catch((error) => {
					console.error("Failed to copy link to clipboard:", error);
				});
		}
	};

	const clearIdFromUrl = (setId: (id: string | null) => void) => {
		const currentUrl = window.location.href;
		const url = new URL(currentUrl);
		url.searchParams.delete("id");
		window.history.replaceState({}, "", url.toString());
		setId(null);
	};

	const onSubmit = async (file: FileList) => {
		if (ipAddress && reset) {
			try {
				const fileData = file[0];
				const response: UploadResponse = await uploadFile(fileData, ipAddress);
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
		}
	};

	return { onSubmit, handleCopyLink, clearIdFromUrl };
};
