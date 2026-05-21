import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "../api/systemApi";
import type { SystemMetrics } from "../types/system";

interface SystemMetricsEnriched extends SystemMetrics {
  cpuTrend: number[];
  memoryTrend: number[];
  gpuTrend: number[];
}

export function useSystemMetrics(autoRefresh: boolean) {
  return useQuery<SystemMetrics, Error, SystemMetricsEnriched>({
    queryKey: ["system", "metrics"],
    queryFn: getMetrics,
    refetchInterval: autoRefresh ? 5000 : false,
    select: (m): SystemMetricsEnriched => ({
      ...m,
      cpuTrend: m.history?.points.map((p) => p.cpuUsagePercent) ?? [],
      memoryTrend: m.history?.points.map((p) => p.memoryUsagePercent) ?? [],
      // GPU \u8da8\u52e2\u5f8c\u7aef\u5c1a\u672a\u63d0\u4f9b\uff0c\u4fdd\u7559\u7a7a\u9663\u5217
      gpuTrend: [],
    }),
  });
}
