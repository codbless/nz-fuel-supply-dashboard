"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { dashboardRefreshMs } from "../lib/dashboard-config";

type AutoRefreshProps = {
  intervalMs?: number;
};

export default function AutoRefresh({
  intervalMs = dashboardRefreshMs,
}: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [intervalMs, router]);

  return null;
}
