import { useRef, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BottomNav } from "@/components/BottomNav";
import { CategoryPicker } from "@/components/CategoryPicker";
import { GlassCard } from "@/components/GlassCard";
import { HeaderBar } from "@/components/HeaderBar";
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
  "rounded-2xl border border-white/10 bg-black/35 px-4 py-4 text-base text-white";

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
      <View>
        <HeaderBar
          showBack
          onBack={() => navigation.goBack()}
          eyebrow="New Scan"
          title="Analyze purchase"
          rightLabel="History"
          onRightPress={() => navigation.navigate("PastScans")}
        />

        <GlassCard glow="cyan">
          <Text className="text-lg font-black text-white">Build a smarter risk profile</Text>
          <Text className="mt-2 leading-6 text-slate-300">
            Add text, messages, and photos. RiskRadar needs at least one content source before analysis.
          </Text>
          <View className="mt-5 flex-row gap-3">
            {["Details", "Photos", "AI scan"].map((step) => (
              <View key={step} className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3">
                <Text className="text-center text-xs font-bold uppercase text-cyan-100">{step}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <GlassCard className="mt-5" glow="violet">
          <View className="gap-6">
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
        </GlassCard>

        <BottomNav active="scan" />
      </View>
    </ScreenContainer>
  );
};
