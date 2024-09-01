import { Rabbit } from "lucide-react";
import { Input } from "./components/input";
import { Label } from "@/components/label";
import { Button } from "./components/button";

const InputFile = () => {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="picture" className="text-slate-100">
				Select File
			</Label>
			<Input id="picture" type="file" />
		</div>
	);
};

export default function App() {
	return (
		<main className="bg-zinc-950 w-screen h-screen flex flex-col p-5 justify-between antialiased">
			<div className="flex flex-col gap-2 text-slate-50">
				<div className="flex gap-2 items-center">
					<Rabbit />
					<span className="text-lg font-semibold">Quick Link</span>
				</div>
				<span className="text-slate-100">Share files fast in a secure way</span>
			</div>
			<div className="border border-zinc-800 p-5 flex flex-col self-center gap-5 w-[400px] rounded-lg">
				<InputFile />
				<Button>Upload</Button>
			</div>
			<span className="text-slate-100">
				Made by{" "}
				<a
					href="https://github.com/Molizanee"
					className="font-bold hover:text-slate-300 transition-colors"
				>
					David Molizane
				</a>
			</span>
		</main>
	);
}
