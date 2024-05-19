import Timer from "@/components/Timer";
import App from "@/components/App";
import Map from "@/components/Map";

export default function Home() {
    return (
        <main className="bg-zinc-900 p-2 h-screen gap-4 px-2 overflow-x-scroll w-screen flex-none flex flex-row flex-nowrap snap-x snap-mandatory scroll-smooth">
            <Timer />
            <App />
            <Map />
        </main>
    );
}