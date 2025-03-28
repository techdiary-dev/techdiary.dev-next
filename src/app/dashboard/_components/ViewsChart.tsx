"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { type ChartConfig } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";

const chartConfig = {
  views: {
    label: "Article Views:",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const ViewsChart = () => {
  const { _t } = useTranslation();
  const data = [
    { month: "January", views: 186 },
    { month: "February", views: 305 },
    { month: "March", views: 237 },
    { month: "April", views: 73 },
    { month: "May", views: 209 },
    { month: "June", views: 214 },
    { month: "July", views: 214 },
    { month: "August", views: 214 },
    { month: "September", views: 214 },
    { month: "October", views: 214 },
    { month: "November", views: 214 },
    { month: "December", views: 214 },
  ];

  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle>{_t("Article views report")}</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[200px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="views"
              type="natural"
              stroke="var(--color-views)"
              strokeWidth={3}
              dot={{ fill: "var(--color-views)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ViewsChart;
