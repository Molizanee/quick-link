import { getFile } from "@/api/get-file";

export function useFileDownload(id) {
	const handleDownloadFile = async () => {
		try {
			const fileDetails = await getFile(id);
			let fileName = fileDetails.file_name;

			const underscoreIndex = fileName.indexOf("_");
			if (underscoreIndex !== -1) {
				fileName = fileName.substring(underscoreIndex + 1);
			}

			const fileUrl = fileDetails.file_url;

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

	return handleDownloadFile;
}
