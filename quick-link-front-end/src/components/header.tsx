import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Rabbit } from "lucide-react";

export const Header = () => {
	return (
		<div className="flex justify-between">
			<div className="flex flex-col gap-2 text-slate-50">
				<div className="flex gap-2 items-center">
					<Rabbit />
					<span className="text-lg font-semibold">Quick Link</span>
				</div>
				<span className="text-slate-100 text-sm">
					Quickly and securely share files
				</span>
			</div>
			<a href="https://github.com/Molizanee/quick-link">
				<GitHubLogoIcon className="text-slate-100 hover:text-slate-200 transition-colors cursor-pointer w-6 h-6" />
			</a>
		</div>
	);
};
