import client from "./client";

export interface ServicePackUploadResult {
  fileName: string;
  destinationPath: string;
  sizeBytes: number;
  uploadedAtUtc: string;
  replacedExistingFile: boolean;
}

export async function uploadServicePack(
  file: File,
  onProgress?: (value: number) => void,
): Promise<ServicePackUploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await client.post<ServicePackUploadResult | null>(
    "/system/service-pack",
    formData,
    {
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    },
  );

  if (!data || !data.fileName) {
    throw new Error("Empty service pack upload response");
  }

  return data;
}
