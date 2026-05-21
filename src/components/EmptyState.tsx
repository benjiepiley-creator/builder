import { Text, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const EmptyState = ({ title, message, actionLabel, onAction }: Props) => (
  <View className="items-center rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
    <Text className="text-center text-2xl font-black text-white">{title}</Text>
    <Text className="mt-3 text-center leading-6 text-slate-400">{message}</Text>
    {actionLabel && onAction ? (
      <View className="mt-5 w-full">
        <PrimaryButton title={actionLabel} onPress={onAction} />
      </View>
    ) : null}
  </View>
);
