import { useEffect, useState } from "react";
import { getFile } from "@/api/get-file";

type FileDetails = {
	id: string;
	createdAt: string;
	file_name: string;
	file_url: string;
	ip_address: string;
};

export function useFileDetails(id: string) {
	const [fileDetails, setFileDetails] = useState({});

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

	return fileDetails as FileDetails;
}
