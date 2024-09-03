import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, LoaderIcon, Rabbit } from "lucide-react";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { z } from "zod";
import { useIpAddress } from "@/hooks/useIpAddress";
import { useFileDetails } from "@/hooks/useFileDetails";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useFileDownload } from "@/hooks/useFileDownload";
import { useState } from "react";

const uploadSchema = z.object({
	file: z
		.any()
		.refine((value) => value instanceof FileList && value.length > 0, {
			message: "File is required.",
		})
		.refine(
			(value) => value instanceof FileList && value[0].size <= 10 * 1024 * 1024,
			{
				message: "File size must not exceed 10MB.",
			},
		),
});

type UploadSchema = z.infer<typeof uploadSchema>;

export default function App() {
	const [id, setId] = useState<string | null>(
		new URLSearchParams(window.location.search).get("id"),
	);
	const ipAddress = useIpAddress();
	const fileDetails = useFileDetails(id || "");

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting, isValid },
	} = useForm<UploadSchema>({
		resolver: zodResolver(uploadSchema),
	});

	const { onSubmit, clearIdFromUrl } = useFileUpload(reset, ipAddress);
	const handleDownloadFile = useFileDownload(id);

	const file = watch("file");

	return (
		<main className="bg-zinc-950 w-screen h-screen flex flex-col p-5 justify-between antialiased">
			<div className="flex flex-col gap-2 text-slate-50">
				<div className="flex gap-2 items-center">
					<Rabbit />
					<span className="text-lg font-semibold">Quick Link</span>
				</div>
				<span className="text-slate-100">Share files fast in a secure way</span>
			</div>
			<div className="flex flex-col w-[500px] gap-2 self-center">
				<span className="text-slate-100 self-center">
					Quick Link currently supports files up to a{" "}
					<span className="font-semibold">maximum size of 10MB.</span>
				</span>
				<div className="border border-zinc-800 p-5 flex flex-col gap-5 rounded-lg">
					{!id ? (
						<form
							onSubmit={handleSubmit(onSubmit)}
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
							{errors.file && (
								<span className="text-red-500">{errors.file.message}</span>
							)}
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
							<Label className="text-slate-100">
								File name: {fileDetails.file_name}
							</Label>
							<Button onClick={() => handleDownloadFile()}>
								Download File
							</Button>
						</div>
					)}
				</div>
				{id && (
					<Button
						variant="link"
						className="text-slate-100 hover:text-slate-200 transition-colors"
						onClick={() => clearIdFromUrl(setId)}
					>
						Upload a file
					</Button>
				)}
			</div>
			<span className="text-slate-100">
				Made by{" "}
				<a
					href="https://github.com/Molizanee"
					className="font-bold hover:text-slate-300 transition-colors"
				>
					David Molizane
				</a>
			</span>
		</main>
	);
}
