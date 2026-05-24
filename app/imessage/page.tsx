"use client";

import { useRouter } from "next/navigation";
import { TextingGame } from "@/components/TextingGame/TextingGame";

export default function IMessagePage() {
  const router = useRouter();

  return <TextingGame onComplete={() => router.push("/")} />;
}
