import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useFileUpload } from "@/hooks/use-file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, LoaderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useIpAddress } from "@/hooks/use-ip-address";
import { Button } from "@/components/button";
import { useEffect } from "react";

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

	const file = watch("file");

	const ipAddress = useIpAddress();

	const { onSubmit, handleCopyLink } = useFileUpload({ reset, ipAddress });

	useEffect(() => {
		if (errors.file?.message) {
			toast.error(errors.file.message.toString() || "Validation failed", {
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
	}, [errors.file]);

	const handleFormSubmit = async (data: UploadSchema) => {
		try {
			await onSubmit(data.file);
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

	return (
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
						<span className="text-slate-50 mt-2">Select or Drop file</span>
					</>
				)}
				<Input id="file" type="file" {...register("file")} className="hidden" />
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
	);
};
