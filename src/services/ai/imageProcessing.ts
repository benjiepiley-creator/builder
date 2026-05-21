import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

import type { ImageAsset } from "@/types/scan";
import { createId } from "@/utils/id";

const MAX_UPLOAD_BYTES = 1_800_000;

export const prepareImageForAnalysis = async (
  uri: string,
  width?: number,
  height?: number
): Promise<ImageAsset> => {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1400 } }],
    {
      compress: 0.72,
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true
    }
  );

  const info = await FileSystem.getInfoAsync(manipulated.uri);
  const size = info.exists && "size" in info ? info.size : undefined;

  if (size && size > MAX_UPLOAD_BYTES) {
    const smaller = await ImageManipulator.manipulateAsync(
      manipulated.uri,
      [{ resize: { width: 1000 } }],
      {
        compress: 0.58,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true
      }
    );
    const smallerInfo = await FileSystem.getInfoAsync(smaller.uri);
    return {
      id: createId("img"),
      uri: smaller.uri,
      base64: smaller.base64,
      width: smaller.width ?? width,
      height: smaller.height ?? height,
      fileSize: smallerInfo.exists && "size" in smallerInfo ? smallerInfo.size : undefined
    };
  }

  return {
    id: createId("img"),
    uri: manipulated.uri,
    base64: manipulated.base64,
    width: manipulated.width ?? width,
    height: manipulated.height ?? height,
    fileSize: size
  };
};
