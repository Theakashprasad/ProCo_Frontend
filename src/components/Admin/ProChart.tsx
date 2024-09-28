import { useEffect, useState } from "react";
import axiosInstance from "@/lib/adminAxios";
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

export const description = "A multiple bar chart";

const chartConfig = {
  admin: {
    label: "admin",
    color: "hsl(var(--chart-1))",
  },
  professional: {
    label: "professional",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Define the raw data type
interface DataRecord {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MonthlyData {
  month: string;
  admin: number;
  professional: number;
}

const defaultMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Function to process data
const processData = (
  data: DataRecord[]
): {
  monthlyArray: MonthlyData[];
} => {
  const monthlyData: { [key: string]: MonthlyData } = {};

  // Initialize default months
  defaultMonths.forEach(month => {
    monthlyData[month] = { month, admin: 0, professional: 0 };
  });

  data.forEach((record) => {
    const createdAt = new Date(record.createdAt);
    // Extract month
    const month = createdAt.toLocaleString("default", { month: "long" }); // Full month name
    // Monthly data accumulation
    if (monthlyData[month]) {
      monthlyData[month].admin += 1;
    }
  });

  // Convert objects to arrays for easier consumption in charts
  const monthlyArray = Object.values(monthlyData).map(data => {
    const total = data.admin * 500; // Total value for desktop users
    const admin = total * 0.1; // 10% for admin (desktop)
    const pro = total * 0.9; // 90% for pro (mobile)
    return {
      ...data,
      admin: admin, // Assign admin value to desktop
      professional: pro // Assign pro value to mobile
    };
  });

  return { monthlyArray };
};

export default function Component() {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get("/api/admin/getPayment");
      const { monthlyArray } = processData(response.data.data);
      setData(monthlyArray);
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>PROFITS</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <div className="flex justify-around p-6">
        .
      </div>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="admin" fill="var(--color-admin)" radius={4} />
            <Bar dataKey="professional" fill="var(--color-professional)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>

    </Card>
  );
}
