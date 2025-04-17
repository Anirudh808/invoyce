"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Component({
  chartData,
  onChangeRange,
}: {
  chartData: Array<{ month: string; amount: number }>;
  onChangeRange: (months: number) => void;
}) {
  const [currentMonthChange, setCurrentMonthChange] = useState<number>();

  useEffect(() => {
    if (chartData && chartData.length > 1) {
      const length = chartData.length;
      setCurrentMonthChange(
        (chartData[length - 1].amount - chartData[length - 2].amount) *
          (100 / chartData[length - 2].amount)
      );
    }
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Monthly Review</CardTitle>
            <CardDescription>
              Showing total payments for the last 6 months
            </CardDescription>
          </div>
          <select
            name="range-selector"
            id="range"
            onChange={(e) => onChangeRange(Number(e.target.value))}
          >
            <option value={6} className="p-1">
              Past 6 months{" "}
            </option>
            <option value={12} className="p-1">
              Past 1 year{" "}
            </option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="oklch(93% 0.034 272.788)"
              fillOpacity={0.5}
              stroke="oklch(58.5% 0.233 277.117)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {currentMonthChange ? (
                currentMonthChange > 0 ? (
                  <div className="flex gap-1">
                    <p>
                      Trending up by {Math.abs(currentMonthChange).toFixed(2)}%
                      this month{" "}
                    </p>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="flex gap-1">
                    Trending down by {Math.abs(currentMonthChange).toFixed(2)}%
                    this month {<TrendingDown className="h-4 w-4" />}
                  </div>
                )
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
