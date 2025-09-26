"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface BookingsChartProps {
  bookings: any[]
}

export function BookingsChart({ bookings }: BookingsChartProps) {
  // Group bookings by month
  const monthlyBookings = bookings.reduce((acc: any, booking) => {
    const date = new Date(booking.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthName, bookings: 0 }
    }
    acc[monthKey].bookings += 1
    return acc
  }, {})

  const chartData = Object.values(monthlyBookings).slice(-6) // Last 6 months

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Trends</CardTitle>
        <CardDescription>Number of bookings over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, "Bookings"]} />
            <Line type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
