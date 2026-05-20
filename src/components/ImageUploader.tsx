import { Alert, Image, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { prepareImageForAnalysis } from "@/services/ai/imageProcessing";
import type { ImageAsset } from "@/types/scan";

type Props = {
  images: ImageAsset[];
  onChange: (images: ImageAsset[]) => void;
};

export const ImageUploader = ({ images, onChange }: Props) => {
  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow photo access to upload listing screenshots or item photos.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.85,
        base64: false,
        selectionLimit: 6
      });

      if (result.canceled) return;

      const prepared = await Promise.all(
        result.assets.slice(0, 6 - images.length).map((asset) => prepareImageForAnalysis(asset.uri, asset.width, asset.height))
      );
      onChange([...images, ...prepared].slice(0, 6));
    } catch {
      Alert.alert("Image upload failed", "RiskRadar could not prepare those images. Try smaller photos or screenshots.");
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter((image) => image.id !== id));
  };

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-semibold uppercase tracking-wide text-slate-400">Images</Text>
        <Text className="text-xs text-slate-500">{images.length}/6</Text>
      </View>
      <Pressable
        onPress={pickImages}
        className="items-center justify-center rounded-3xl border border-dashed border-cyan-400/40 bg-cyan-400/10 px-5 py-6"
      >
        <Text className="text-base font-bold text-cyan-100">Upload listing screenshots or item photos</Text>
        <Text className="mt-2 text-center text-sm leading-5 text-slate-400">Images are compressed locally and prepared for AI vision analysis.</Text>
      </Pressable>

      {images.length > 0 ? (
        <View className="mt-4 flex-row flex-wrap gap-3">
          {images.map((image) => (
            <View key={image.id} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
              <Image source={{ uri: image.uri }} className="h-24 w-24" />
              <Pressable onPress={() => removeImage(image.id)} className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-1">
                <Text className="text-xs font-bold text-white">X</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};
