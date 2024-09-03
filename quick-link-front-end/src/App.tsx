import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { UploadFileForm } from "@/components/upload-file-form";

export default function App() {
	return (
		<main className="bg-zinc-950 w-screen h-screen flex flex-col p-5 justify-between antialiased">
			<Header />
			<UploadFileForm />
			<Footer />
		</main>
	);
}
