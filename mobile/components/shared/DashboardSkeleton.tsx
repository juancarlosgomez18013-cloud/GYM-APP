import { View } from "react-native";
import { Skeleton } from "./Skeleton";
import { PageContainer } from "@/components/layout/PageContainer";

export function DashboardSkeleton() {
  return (
    <PageContainer>
      {/* Greeting */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Skeleton width={200} height={28} />
          <Skeleton width={80} height={28} borderRadius={14} />
        </View>
        <Skeleton width={160} height={14} className="mt-2" />
        <Skeleton width={100} height={24} borderRadius={12} className="mt-2" />
      </View>

      {/* Fasting card */}
      <Skeleton height={64} borderRadius={16} className="mb-4" />

      {/* Calorie Ring */}
      <View className="mb-4 rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(20,34,24,0.4)" }}>
        <View className="p-4">
          <Skeleton width={120} height={18} className="mb-4" />
          <View className="flex-row items-center justify-center gap-4">
            <Skeleton width={180} height={180} borderRadius={90} />
            <Skeleton width={140} height={140} borderRadius={70} />
          </View>
        </View>
      </View>

      {/* Macros */}
      <View className="mb-4 rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(20,34,24,0.4)" }}>
        <View className="p-4 gap-4">
          <Skeleton width={130} height={18} />
          {[1, 2, 3].map((i) => (
            <View key={i}>
              <View className="flex-row justify-between mb-2">
                <Skeleton width={60} height={14} />
                <Skeleton width={70} height={14} />
              </View>
              <Skeleton height={10} borderRadius={5} />
            </View>
          ))}
        </View>
      </View>

      {/* Water */}
      <Skeleton height={100} borderRadius={16} className="mb-4" />

      {/* Meals */}
      <Skeleton width={120} height={20} className="mb-3" />
      <Skeleton height={60} borderRadius={16} className="mb-2" />
      <Skeleton height={60} borderRadius={16} className="mb-2" />
    </PageContainer>
  );
}
