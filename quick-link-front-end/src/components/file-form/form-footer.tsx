import { Button } from "@/components/button";

type FormFooterProps = {
	id: string | null;
	clearIdFromUrl: (setId: (id: string | null) => void) => void;
	setId: (id: string | null) => void;
};

export const FormFooter = ({ id, clearIdFromUrl, setId }: FormFooterProps) => {
	return (
		id && (
			<Button
				variant="link"
				className="text-slate-100/50 hover:text-slate-100 transition-colors h-5"
				onClick={() => clearIdFromUrl(setId)}
			>
				Upload a file
			</Button>
		)
	);
};
