import { Label } from "@/components/label";
import { Button } from "@/components/button";
import { useFileDownload } from "@/hooks/use-file-download";
import { useFileDetails } from "@/hooks/use-file-details";

type DownloadFileFormProps = {
	id: string;
};

export const DownloadFileForm = ({ id }: DownloadFileFormProps) => {
	const handleDownloadFile = useFileDownload(id);
	const fileDetails = useFileDetails(id);

	return (
		<div className="flex flex-col gap-5">
			<Label className="text-slate-100 font-semibold">
				{fileDetails.file_name}
			</Label>
			<Button onClick={() => handleDownloadFile()}>Download File</Button>
		</div>
	);
};
