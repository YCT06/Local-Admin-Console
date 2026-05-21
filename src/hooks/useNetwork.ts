import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNetworkConfiguration,
  updateNetworkConfiguration,
} from "../api/networkApi";
import type { NetworkConfigurationUpdateRequest } from "../types/system";

export function useNetworkConfig() {
  return useQuery({
    queryKey: ["network", "config"],
    queryFn: getNetworkConfiguration,
  });
}

export function useUpdateNetworkConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (request: NetworkConfigurationUpdateRequest) =>
      updateNetworkConfiguration(request),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["network", "config"] }),
  });
}
