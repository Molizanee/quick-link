type FormHeaderProps = {
	id: string | null;
};

export const FormHeader = ({ id }: FormHeaderProps) => {
	return (
		!id && (
			<span className="text-slate-100 self-center text-sm">
				Quick Link currently supports files up to a{" "}
				<span className="font-semibold">maximum size of 10MB</span>
			</span>
		)
	);
};
