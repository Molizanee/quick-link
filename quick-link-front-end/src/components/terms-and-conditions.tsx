import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

export const TermsAndConditions = () => {
	return (
		<Dialog>
			<DialogTrigger>
				<span className="font-semibold">Terms and Conditions</span>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Terms and Conditions</DialogTitle>
				<DialogDescription>Understand how Quick Link works</DialogDescription>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
			</DialogContent>
		</Dialog>
	);
};
