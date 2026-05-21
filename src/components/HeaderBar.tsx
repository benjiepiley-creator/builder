import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  eyebrow?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
};

export const HeaderBar = ({ title, eyebrow, showBack, onBack, rightLabel, onRightPress }: Props) => (
  <View className="mb-5 flex-row items-center justify-between pt-3">
    <View className="flex-1">
      {showBack ? (
        <Pressable onPress={onBack} className="mb-4 h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10">
          <Text className="text-lg font-black text-white">{"<"}</Text>
        </Pressable>
      ) : null}
      {eyebrow ? <Text className="text-xs font-bold uppercase tracking-[4px] text-cyan-300">{eyebrow}</Text> : null}
      <Text className="mt-1 text-3xl font-black text-white">{title}</Text>
    </View>
    {rightLabel && onRightPress ? (
      <Pressable onPress={onRightPress} className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
        <Text className="text-sm font-bold text-slate-100">{rightLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);
