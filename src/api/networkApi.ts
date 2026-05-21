import client from "./client";
import type {
  NetworkConfiguration,
  NetworkConfigurationUpdateRequest,
} from "../types/system";

export async function getNetworkConfiguration(): Promise<NetworkConfiguration> {
  const { data } = await client.get<NetworkConfiguration | null>(
    "/system/network-config",
  );
  if (!data || !Array.isArray(data.adapters)) {
    throw new Error("Empty network configuration response");
  }
  return data;
}

export async function updateNetworkConfiguration(
  request: NetworkConfigurationUpdateRequest,
): Promise<NetworkConfiguration> {
  const { data } = await client.post<NetworkConfiguration | null>(
    "/system/network-config",
    request,
  );
  if (!data || !Array.isArray(data.adapters)) {
    throw new Error("Empty network configuration response");
  }
  return data;
}
