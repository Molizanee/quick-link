import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, Rabbit } from "lucide-react";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { z } from "zod";
import { useIpAddress } from "@/hooks/useIpAddress";
import { useFileDetails } from "@/hooks/useFileDetails";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useFileDownload } from "@/hooks/useFileDownload";

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
	const id = new URLSearchParams(window.location.search).get("id");
	const ipAddress = useIpAddress();
	const fileDetails = useFileDetails(id || "");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UploadSchema>({
		resolver: zodResolver(uploadSchema),
	});

	const { onSubmit, handleCopyLink } = useFileUpload(reset, ipAddress);
	const handleDownloadFile = useFileDownload(id);

	return (
		<main className="bg-zinc-950 w-screen h-screen flex flex-col p-5 justify-between antialiased">
			<div className="flex flex-col gap-2 text-slate-50">
				<div className="flex gap-2 items-center">
					<Rabbit />
					<span className="text-lg font-semibold">Quick Link</span>
				</div>
				<span className="text-slate-100">Share files fast in a secure way</span>
			</div>
			<div className="border border-zinc-800 p-5 flex flex-col self-center gap-5 w-[400px] rounded-lg">
				{!id ? (
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<Label
							htmlFor="file"
							className="h-32 flex flex-col items-center justify-center border border-zinc-800 rounded-lg cursor-pointer transition-colors hover:border-gray-400"
						>
							<File size={24} color="white" />
							<span className="text-white mt-2">Select or Drop file</span>
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
						<Button type="submit">Upload</Button>
					</form>
				) : (
					<div className="flex flex-col gap-5">
						<Label className="text-slate-100">
							File name: {fileDetails.file_name}
						</Label>
						<Button onClick={() => handleDownloadFile()}>Download File</Button>
					</div>
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
