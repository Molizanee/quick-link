import { axiosInstance } from "./axios";

type DownloadFileResponse = {
	file: Blob;
	fileName: string;
	fileType: string;
};

export const DownloadFile = async (
	id: string,
): Promise<DownloadFileResponse> => {
	try {
		const response = await axiosInstance.get<Blob>(
			`/files/download-file/${id}`,
			{
				responseType: "blob", // Expecting binary data (file)
			},
		);

		// Extract file name from the Content-Disposition header
		const contentDisposition = response.headers["content-disposition"];
		let fileName = "downloaded_file";
		if (contentDisposition && contentDisposition.includes("filename=")) {
			fileName = contentDisposition.split("filename=")[1].replace(/['"]/g, ""); // Remove quotes
		}

		const fileType =
			response.headers["content-type"] || "application/octet-stream";

		// Return the file blob and metadata
		return {
			file: response.data,
			fileName,
			fileType,
		};
	} catch (error) {
		console.error("Error downloading file:", error);
		throw new Error("Error downloading file");
	}
};
