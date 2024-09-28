"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import axiosInstance from "@/lib/adminAxios";

export const description = "A bar chart";

// Initial data structure with default zero values
const initialYearlyData = [
  { year: "2021", desktop: 0 },
  { year: "2022", desktop: 0 },
  { year: "2023", desktop: 0 },
  { year: "2024", desktop: 0 },
  { year: "2025", desktop: 0 },
];

const initialMonthlyData = [
  { month: "January", desktop: 0 },
  { month: "February", desktop: 0 },
  { month: "March", desktop: 0 },
  { month: "April", desktop: 0 },
  { month: "May", desktop: 0 },
  { month: "June", desktop: 0 },
  { month: "July", desktop: 0 },
  { month: "August", desktop: 0 },
  { month: "September", desktop: 0 },
  { month: "October", desktop: 0 },
  { month: "November", desktop: 0 },
  { month: "December", desktop: 0 },
];

const initialDailyData = [
  { day: "Monday", desktop: 0 },
  { day: "Tuesday", desktop: 0 },
  { day: "Wednesday", desktop: 0 },
  { day: "Thursday", desktop: 0 },
  { day: "Friday", desktop: 0 },
  { day: "Saturday", desktop: 0 },
  { day: "Sunday", desktop: 0 },
];

// Chart configuration
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig;

// Define the types for the output data
interface YearlyData {
  year: string;
  desktop: number;
}

interface MonthlyData {
  month: string;
  desktop: number;
}

interface DailyData {
  day: string;
  desktop: number;
}

// Define the raw data type
interface DataRecord {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Function to process data
const processData = (
  data: DataRecord[]
): {
  yearlyArray: YearlyData[];
  monthlyArray: MonthlyData[];
  dailyArray: DailyData[];
} => {
  const yearlyData: { [key: string]: YearlyData } = {};
  const monthlyData: { [key: string]: MonthlyData } = {};
  const dailyData: { [key: string]: DailyData } = {};

  data.forEach((record) => {
    const createdAt = new Date(record.createdAt);

    // Extract year, month, and day
    const year = createdAt.getFullYear().toString();
    const month = createdAt.toLocaleString("default", { month: "long" }); // Full month name
    const day = createdAt.toLocaleDateString("default", {
      weekday: "long",
    }); // Full day name (e.g., Monday)

    // Yearly data accumulation
    if (!yearlyData[year]) {
      yearlyData[year] = { year, desktop: 0 };
    }
    yearlyData[year].desktop++;

    // Monthly data accumulation
    if (!monthlyData[month]) {
      monthlyData[month] = { month, desktop: 0 };
    }
    monthlyData[month].desktop++;

    // Daily data accumulation
    if (!dailyData[day]) {
      dailyData[day] = { day, desktop: 0 };
    }
    dailyData[day].desktop++;
  });

  // Convert objects to arrays for easier consumption in charts
  const yearlyArray = Object.values(yearlyData);
  const monthlyArray = Object.values(monthlyData);
  const dailyArray = Object.values(dailyData);

  return { yearlyArray, monthlyArray, dailyArray };
};

// Function to update the data
const updateData = <T extends { [key: string]: any }>(
  initialData: T[],
  newData: T[],
  key: keyof T
): T[] => {
  // Create a map of the new data for quick lookup
  const newDataMap = new Map(
    newData.map((item) => [item[key], item])
  );
  // Update existing data based on the new data, providing a default value if undefined
  return initialData.map((item) => ({
    ...item,
    desktop:
      newDataMap.get(item[key])?.desktop ?? item.desktop,
  }));
};

export default function Component() {
  // State to control the selected time period (year, month, week)
  const [timePeriod, setTimePeriod] = useState<"year" | "month" | "day">(
    "year"
  );

  // State to hold chart data
  const [yearlyData, setYearlyData] = useState(initialYearlyData);
  const [monthlyData, setMonthlyData] = useState(initialMonthlyData);
  const [dailyData, setDailyData] = useState(initialDailyData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/admin/getPayment");
        const { yearlyArray, monthlyArray, dailyArray } = processData(
          response.data.data
        );

        // Update state with new data
        setYearlyData((prev) => updateData(prev, yearlyArray, "year"));
        setMonthlyData((prev) => updateData(prev, monthlyArray, "month"));
        setDailyData((prev) => updateData(prev, dailyArray, "day"));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Determine chart data based on selected time period
  const chartData =
    timePeriod === "year"
      ? yearlyData
      : timePeriod === "month"
      ? monthlyData
      : dailyData;

  return (
    <Card> 
      <CardHeader>
        <CardTitle>TOTAL PAYED USERS</CardTitle>
        <CardDescription>
          {timePeriod === "year"
            ? "Yearly"
            : timePeriod === "month"
            ? "Monthly"
            : "Weekly"}{" "}
          Data View
        </CardDescription>
      </CardHeader>

      {/* Time period selector */}
      <div className="flex justify-around p-4">
        <button
          className={`p-2 ${
            timePeriod === "year" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setTimePeriod("year")}
        >
          Year
        </button>
        <button
          className={`p-2 ${
            timePeriod === "month" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setTimePeriod("month")}
        >
          Month
        </button>
        <button
          className={`p-2 ${
            timePeriod === "day" ? "bg-blue-500 text-white" : ""
          }`}
          onClick={() => setTimePeriod("day")}
        >
          Week
        </button>
      </div>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={timePeriod === "day" ? 300 : 500} // Adjust width for week view to make the bars smaller
            height={300}
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                timePeriod === "year"
                  ? "year"
                  : timePeriod === "month"
                  ? "month"
                  : "day"
              }
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Shorten month/week labels if needed
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill={chartConfig.desktop.color}
              radius={timePeriod === "day" ? [5, 5, 5, 5] : 8} // Adjust radius for week
              barSize={timePeriod === "day" ? 10 : 20} // Smaller bars for week
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
 
    </Card>
  );
}
