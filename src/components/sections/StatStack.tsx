import { AnimatedCounter } from "@/components/sections/AnimatedCounter";
import type { Stat } from "@/lib/data/home";

export function StatStack({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`flex flex-1 flex-col justify-between rounded-panel p-6 ${
            stat.variant === "brand" ? "bg-brand text-white" : "bg-white"
          }`}
        >
          <div className="font-display text-stat font-bold">
            {stat.count ? <AnimatedCounter target={stat.count} suffix={stat.suffix} /> : stat.value}
          </div>
          <div className={`text-[13px] font-semibold ${stat.variant === "brand" ? "opacity-90" : "text-muted-2"}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
