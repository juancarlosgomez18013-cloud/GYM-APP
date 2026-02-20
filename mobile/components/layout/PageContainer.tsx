import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PropsWithChildren } from "react";

interface PageContainerProps extends PropsWithChildren {
  scrollable?: boolean;
  className?: string;
}

export function PageContainer({ children, scrollable = true, className = "" }: PageContainerProps) {
  const content = (
    <View className={`flex-1 px-4 pt-4 pb-4 ${className}`}>
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {content}
    </SafeAreaView>
  );
}
