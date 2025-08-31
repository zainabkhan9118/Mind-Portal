'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatisticsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/admin/statistics/plays-session");
  }, [router]);
  return null;
}
