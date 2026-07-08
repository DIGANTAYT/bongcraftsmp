"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCatchAll() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center font-mono text-xs text-rose-500">
      <span>Redirecting to secure portal...</span>
    </div>
  );
}
