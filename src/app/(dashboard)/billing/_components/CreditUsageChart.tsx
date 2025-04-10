"use client";

import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInPeriod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartColumnStackedIcon, Layers2 } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ChartData = Awaited<ReturnType<typeof GetCreditUsageInPeriod>>;
const chartConfig = {
  success: {
    label: "Successfull Phases Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-1))",
  },
};
export const CreditConsumptionChart = ({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2">
          <ChartColumnStackedIcon className="size-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              radius={[0,0,4,4]}
              type={"bump"}
              fill="var(--color-success)"
              fillOpacity={0.6}
              stroke="var(--color-success)"
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              radius={[4,4,0,0]}
              type={"bump"}
              fill="var(--color-failed)"
              fillOpacity={0.6}
              stroke="var(--color-failed)"
              dataKey={"failed"}
              stackId={"a"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
