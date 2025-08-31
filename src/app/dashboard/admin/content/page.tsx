// src/app/dashboard/admin/content/page.tsx
'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContentManagementPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/admin/content/music");
  }, [router]);
  return null;
}
