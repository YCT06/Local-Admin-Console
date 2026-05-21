import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadServicePack } from "../api/servicePackApi";
import type { ServicePackUploadResult } from "../api/servicePackApi";

export function useUploadServicePack() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation<ServicePackUploadResult, Error, File>({
    mutationFn: (file: File) => uploadServicePack(file, setProgress),
    onMutate: () => setProgress(0),
  });

  return { ...mutation, progress };
}
