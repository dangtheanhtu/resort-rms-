"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  payments: any[]
}

export function RevenueChart({ payments }: RevenueChartProps) {
  // Group payments by month
  const monthlyRevenue = payments
    .filter((p) => p.payment_status === "completed")
    .reduce((acc: any, payment) => {
      const date = new Date(payment.payment_date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, revenue: 0 }
      }
      acc[monthKey].revenue += payment.amount
      return acc
    }, {})

  const chartData = Object.values(monthlyRevenue).slice(-6) // Last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Monthly revenue over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
