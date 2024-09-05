import { DownloadFile } from "@/api/download-file";

export function useFileDownload(id: string) {
	const handleDownloadFile = async () => {
		try {
			// Fetch file and metadata using the API call
			const fileDetails = await DownloadFile(id);
			let { file, fileName, fileType } = fileDetails;

			// Modify file name if necessary
			const underscoreIndex = fileName.indexOf("_");
			if (underscoreIndex !== -1) {
				fileName = fileName.substring(underscoreIndex + 1); // Adjust file name logic if needed
			}

			// Ensure the file name has a valid extension
			if (!fileName.includes(".")) {
				// If no extension, add one based on the file type (infer from MIME type)
				const extension = fileType.split("/")[1]; // Get the extension from the MIME type
				fileName = `${fileName}.${extension}`;
			}

			// Create a Blob URL and trigger download
			const url = window.URL.createObjectURL(
				new Blob([file], { type: fileType }),
			);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = fileName; // Set the file name with the correct extension
			anchor.style.display = "none"; // Hide anchor
			document.body.appendChild(anchor);
			anchor.click(); // Trigger the download
			document.body.removeChild(anchor); // Clean up
			window.URL.revokeObjectURL(url); // Revoke the Blob URL

			console.log("File downloaded successfully.");
		} catch (error) {
			console.error("Error downloading the file:", error);
		}
	};

	return handleDownloadFile;
}
