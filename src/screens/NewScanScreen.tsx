import { useRef, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CategoryPicker } from "@/components/CategoryPicker";
import { ImageUploader } from "@/components/ImageUploader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import type { Category } from "@/constants/categories";
import { scanInputSchema } from "@/schemas/scanInputSchema";
import { useSubscriptionStore } from "@/services/subscription/subscriptionService";
import type { ImageAsset } from "@/types/scan";
import type { RootStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "NewScan">;
type ScanFormValues = {
  category: Category;
  itemTitle: string;
  askingPrice: number | null;
  location: string;
  listingDescription: string;
  sellerMessages: string;
  notes: string;
  images: ImageAsset[];
};

const inputClass =
  "rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-base text-white";

export const NewScanScreen = ({ navigation }: Props) => {
  const lastSubmitAt = useRef(0);
  const { canRunScan, showUpgrade } = useSubscriptionStore();
  const [images, setImages] = useState<ImageAsset[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ScanFormValues>({
    resolver: zodResolver(scanInputSchema) as Resolver<ScanFormValues>,
    defaultValues: {
      category: "General Marketplace Item",
      itemTitle: "",
      askingPrice: null,
      location: "",
      listingDescription: "",
      sellerMessages: "",
      notes: "",
      images: []
    }
  });

  const category = watch("category");

  const onSubmit = (values: ScanFormValues) => {
    const now = Date.now();
    if (now - lastSubmitAt.current < 2500) {
      Alert.alert("Hold on", "RiskRadar is rate-limiting rapid scan attempts. Try again in a moment.");
      return;
    }
    lastSubmitAt.current = now;

    if (!canRunScan()) {
      showUpgrade();
      return;
    }

    navigation.navigate("Analysis", { input: { ...values, images } });
  };

  const updateImages = (nextImages: ImageAsset[]) => {
    setImages(nextImages);
    setValue("images", nextImages, { shouldValidate: true });
  };

  return (
    <ScreenContainer>
      <View className="pt-4">
        <Text className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">New Scan</Text>
        <Text className="mt-2 text-4xl font-black text-white">Analyze a purchase</Text>
        <Text className="mt-3 leading-6 text-slate-400">
          Add the details you have. RiskRadar requires at least listing text, seller messages, or an uploaded image.
        </Text>

        <View className="mt-8 gap-6">
          <CategoryPicker
            value={category}
            onChange={(value) => setValue("category", value, { shouldValidate: true })}
            error={errors.category?.message}
          />

          <Controller
            control={control}
            name="itemTitle"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Item title</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. 2018 Toyota Camry SE"
                  placeholderTextColor="#64748B"
                  className={inputClass}
                />
                {errors.itemTitle ? <Text className="mt-2 text-sm text-red-300">{errors.itemTitle.message}</Text> : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="askingPrice"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Asking price</Text>
                <TextInput
                  value={value ? String(value) : ""}
                  onChangeText={(text) => onChange(text ? Number(text.replace(/[^0-9.]/g, "")) : null)}
                  keyboardType="decimal-pad"
                  placeholder="Optional but recommended"
                  placeholderTextColor="#64748B"
                  className={inputClass}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Location</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="City, marketplace, or area"
                  placeholderTextColor="#64748B"
                  className={inputClass}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="listingDescription"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Listing description</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  textAlignVertical="top"
                  placeholder="Paste marketplace listing text"
                  placeholderTextColor="#64748B"
                  className={`${inputClass} min-h-32`}
                />
                {errors.listingDescription ? (
                  <Text className="mt-2 text-sm text-red-300">{errors.listingDescription.message}</Text>
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="sellerMessages"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Seller messages</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  textAlignVertical="top"
                  placeholder="Paste messages from the seller"
                  placeholderTextColor="#64748B"
                  className={`${inputClass} min-h-28`}
                />
              </View>
            )}
          />

          <ImageUploader images={images} onChange={updateImages} />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <View>
                <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Optional notes</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  textAlignVertical="top"
                  placeholder="Anything else RiskRadar should know?"
                  placeholderTextColor="#64748B"
                  className={`${inputClass} min-h-24`}
                />
              </View>
            )}
          />

          <PrimaryButton title="Analyze Risk" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
        </View>
      </View>
    </ScreenContainer>
  );
};
