import { getFile } from "@/api/get-file";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useFileDetails } from "@/hooks/useFileDetails";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useIpAddress } from "@/hooks/useIpAddress";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadSchema = z.object({
	file: z
		.any()
		.refine((value) => value instanceof FileList && value.length > 0, {
			message: "File is required.",
		})
		.refine(
			(value) => value instanceof FileList && value[0].size <= 10 * 1024 * 1024,
			{
				message: "File size must be less than 10MB",
			},
		),
});

type UploadSchema = z.infer<typeof uploadSchema>;

export const UploadFileForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<UploadSchema>({
		resolver: zodResolver(uploadSchema),
	});

	const [id, setId] = useState<string | null>(
		new URLSearchParams(window.location.search).get("id") ?? null,
	);
	const handleDownloadFile = useFileDownload(id);
	const ipAddress = useIpAddress();
	const { onSubmit, clearIdFromUrl, handleCopyLink } = useFileUpload(
		reset,
		ipAddress,
	);
	const fileDetails = useFileDetails(id || "");

	const file = watch("file");

	useEffect(() => {
		const verifyIfFileExists = async () => {
			if (id) {
				const response = await getFile(id);
				if (response === "File not found") {
					clearIdFromUrl(setId);
				}
			}
		};
		verifyIfFileExists();
	}, [id, clearIdFromUrl]);

	const handleFormSubmit = async (data: UploadSchema) => {
		try {
			await onSubmit(data);
			toast.success("File uploaded successfully!", {
				classNames: {
					actionButton: "bg-emerald-500 text-slate-100",
					icon: "text-emerald-500",
					toast: "bg-zinc-950 border border-zinc-800",
					title: "text-emerald-500",
				},
				duration: 10000,
				position: "top-center",
				action: {
					label: "Copy Link",
					onClick: handleCopyLink,
				},
			});
		} catch (error) {
			toast.error("Failed to upload file. Please try again.", {
				classNames: {
					toast: "bg-zinc-950 border border-zinc-800",
					title: "text-red-400",
					actionButton: "bg-red-400 text-slate-100",
					icon: "text-red-400",
				},
				duration: 5000,
				position: "top-center",
			});
		}
	};

	useEffect(() => {
		if (errors.file) {
			toast.error(errors.file.message || "Validation failed", {
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
	}, [errors]);

	return (
		<div className="flex flex-col w-[500px] gap-3 self-center">
			{!id && (
				<span className="text-slate-100 self-center text-sm">
					Quick Link currently supports files up to a{" "}
					<span className="font-semibold">maximum size of 10MB</span>
				</span>
			)}

			<div className="border border-zinc-800 p-5 flex flex-col gap-5 rounded-lg">
				{!id ? (
					<form
						onSubmit={handleSubmit(handleFormSubmit)}
						className="flex flex-col gap-5"
					>
						<Label
							htmlFor="file"
							className="h-32 p-4 flex flex-col items-center justify-center border border-zinc-800 rounded-lg cursor-pointer transition-colors hover:border-gray-400"
						>
							{file && file.length > 0 ? (
								<span className="text-slate-50">{file[0].name ?? ""}</span>
							) : (
								<>
									<File size={24} color="#f8fafc" />
									<span className="text-slate-50 mt-2">
										Select or Drop file
									</span>
								</>
							)}
							<Input
								id="file"
								type="file"
								{...register("file")}
								className="hidden"
							/>
						</Label>
						<Button
							type="submit"
							disabled={isSubmitting || !file || file.length === 0}
						>
							{isSubmitting ? (
								<LoaderIcon className="text-slate-100 animate-spin" />
							) : (
								"Upload File"
							)}
						</Button>
					</form>
				) : (
					<div className="flex flex-col gap-5">
						<Label className="text-slate-100 font-semibold">
							{fileDetails.file_name}
						</Label>
						<Button onClick={() => handleDownloadFile()}>Download File</Button>
					</div>
				)}
				{id && (
					<Button
						variant="link"
						className="text-slate-100/50 hover:text-slate-100 transition-colors h-5"
						onClick={() => clearIdFromUrl(setId)}
					>
						Upload a file
					</Button>
				)}
			</div>
		</div>
	);
};
