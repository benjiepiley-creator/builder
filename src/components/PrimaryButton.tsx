import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
};

export const PrimaryButton = ({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading
}: Props) => {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const bg = isDanger ? "bg-red-500/15 border-red-500/30" : "bg-slate-800 border-slate-700";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      className={`overflow-hidden rounded-2xl ${disabled ? "opacity-50" : "opacity-100"}`}
    >
      {isPrimary ? (
        <LinearGradient
          colors={["#38BDF8", "#2563EB", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center justify-center rounded-2xl px-5 py-4"
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-base font-bold text-white">{title}</Text>}
        </LinearGradient>
      ) : (
        <View className={`items-center justify-center rounded-2xl border px-5 py-4 ${variant === "ghost" ? "border-transparent bg-transparent" : bg}`}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className={`text-base font-bold ${isDanger ? "text-red-200" : "text-white"}`}>{title}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
};
