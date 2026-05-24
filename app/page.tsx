import { Caveat, Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { CosmicArchive } from "@/components/CosmicArchive/CosmicArchive";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["500", "700"] });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["400", "500", "700", "900"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export default function MemoryArchive() {
  return <CosmicArchive className={`${caveat.variable} ${fraunces.variable} ${inter.variable} ${mono.variable}`} />;
}
