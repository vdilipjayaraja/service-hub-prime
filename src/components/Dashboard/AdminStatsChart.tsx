
import React from "react";
import {
  ChartContainer,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const ticketData = [
  { date: "Mon", open: 8, closed: 4 },
  { date: "Tue", open: 12, closed: 8 },
  { date: "Wed", open: 6, closed: 10 },
  { date: "Thu", open: 14, closed: 12 },
  { date: "Fri", open: 9, closed: 7 },
  { date: "Sat", open: 5, closed: 6 },
  { date: "Sun", open: 4, closed: 9 }
];

const chartConfig = {
  open: { label: "Opened Tickets", color: "#fb923c" },
  closed: { label: "Closed Tickets", color: "#22c55e" }
};

const AdminStatsChart: React.FC = () => {
  return (
    <div>
      <h3 className="font-semibold text-lg mb-2">Ticket Activity (Past 7 Days)</h3>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={ticketData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="open" stroke="#fb923c" name="Tickets Opened" strokeWidth={2} dot />
            <Line type="monotone" dataKey="closed" stroke="#22c55e" name="Tickets Closed" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default AdminStatsChart;
