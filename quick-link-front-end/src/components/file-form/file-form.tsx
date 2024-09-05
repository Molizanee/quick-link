import { getFile } from "@/api/get-file";
import { useEffect, useState } from "react";

import { DownloadFileForm } from "@/components/file-form/download-file-form";
import { FormHeader } from "@/components/file-form/form-header";
import { FormFooter } from "@/components/file-form/form-footer";
import { useFileUpload } from "@/hooks/use-file-upload";
import { UploadFileForm } from "@/components/file-form/upload-file-form";

export const FileForm = () => {
	const [id, setId] = useState<string | null>(
		new URLSearchParams(window.location.search).get("id") ?? null,
	);

	const { clearIdFromUrl } = useFileUpload({});

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

	return (
		<div className="flex flex-col gap-3 self-center">
			<FormHeader id={id} />
			<div className="p-5 flex flex-col gap-5 border w-[31.25rem] border-zinc-800 rounded-lg">
				{!id ? <UploadFileForm /> : <DownloadFileForm id={id} />}
			</div>
			<FormFooter id={id} clearIdFromUrl={clearIdFromUrl} setId={setId} />
		</div>
	);
};
