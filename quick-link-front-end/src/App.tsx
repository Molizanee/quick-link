import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rabbit } from "lucide-react";
import { Input } from "./components/input";
import { Label } from "@/components/label";
import { Button } from "./components/button";
import { uploadFile } from "./api/upload-file"; // Assume this function is already created as per previous steps
import { z } from "zod";
import { toast } from "sonner";
import { getFile } from "./api/get-file";

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

const InputFile = ({ register }: { register: any }) => {
	return (
		<div className="flex flex-col items-start gap-3 w-full max-w-sm">
			<Label htmlFor="file" className="text-slate-100">
				Select File
			</Label>
			<Input id="file" type="file" {...register("file")} />
		</div>
	);
};

type UploadSchema = z.infer<typeof uploadSchema>;

export default function App() {
	const id = new URLSearchParams(window.location.search).get("id");

	const [ipAddress, setIpAddress] = useState("");
	const [fileDetails, setFileDetails] = useState<any>({});

	useEffect(() => {
		const fetchIpAddress = async () => {
			try {
				const response = await fetch("https://api.ipify.org?format=json");
				const data = await response.json();
				setIpAddress(data.ip);
			} catch (error) {
				console.error("Error fetching the IP address:", error);
			}
		};

		fetchIpAddress();
	}, []);

	useEffect(() => {
		const fetchFileDetails = async () => {
			try {
				const fileDetailsResponse = await getFile(id);
				setFileDetails(fileDetailsResponse);
			} catch (error) {
				console.error("Error getting file details:", error);
			}
		};
		if (id) {
			fetchFileDetails();
		}
	}, [id]);

	const [fileId, setFileId] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UploadSchema>({
		resolver: zodResolver(uploadSchema),
	});

	const onSubmit = async (data: UploadSchema) => {
		try {
			const file = data.file[0];
			const response = await uploadFile(file, ipAddress);
			setFileId(response.id);
			reset();
			toast("File uploaded", {
				action: <Button onClick={handleCopyLink}>Copy Link!</Button>,
			});
		} catch (error) {
			console.error("Error uploading file:", error);
			toast("Failed to upload file", { type: "error" });
		}
	};

	const handleCopyLink = () => {
		if (fileId) {
			const currentUrl = window.location.href;
			const fullUrl = `${currentUrl}?id=${fileId}`;
			navigator.clipboard.writeText(fullUrl);
			console.log("Link copied to clipboard:", fullUrl);
		}
	};

	const handleDownloadFile = async () => {
		try {
			const fileDetails = await getFile(id); // Assuming getFile fetches the file details from your server
			let fileName = fileDetails.file_name;

			// Optional: If you want to rename the file by removing a part before an underscore
			const underscoreIndex = fileName.indexOf("_");
			if (underscoreIndex !== -1) {
				fileName = fileName.substring(underscoreIndex + 1);
			}

			const fileUrl = fileDetails.file_url;

			// Fetch the file as a Blob
			const response = await fetch(fileUrl, {
				mode: "cors", // Ensure CORS is handled if needed
			});

			if (!response.ok) {
				throw new Error("Failed to download file");
			}

			const blob = await response.blob();

			// Create a hidden anchor element to trigger the download
			const url = window.URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = fileName;
			anchor.style.display = "none"; // Hide the anchor element
			document.body.appendChild(anchor);
			anchor.click(); // Trigger the download
			document.body.removeChild(anchor); // Clean up by removing the element
			window.URL.revokeObjectURL(url); // Clean up the blob URL

			console.log("File downloaded successfully.");
		} catch (error) {
			console.error("Error downloading the file:", error);
		}
	};

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
						<InputFile register={register} />
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
