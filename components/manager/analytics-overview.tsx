"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react"

interface AnalyticsOverviewProps {
  bookings: any[]
  payments: any[]
  rooms: any[]
  bookingServices: any[]
}

export function AnalyticsOverview({ bookings, payments, rooms, bookingServices }: AnalyticsOverviewProps) {
  // Calculate analytics
  const totalBookings = bookings.length
  const completedPayments = payments.filter((p) => p.payment_status === "completed")
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0

  // Monthly comparisons
  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const currentYear = new Date().getFullYear()

  const currentMonthBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.created_at)
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
  }).length

  const lastMonthBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.created_at)
    const year = currentMonth === 0 ? currentYear - 1 : currentYear
    return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === year
  }).length

  const bookingGrowth =
    lastMonthBookings > 0 ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0

  const currentMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date)
      return (
        p.payment_status === "completed" &&
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      )
    })
    .reduce((sum, p) => sum + p.amount, 0)

  const lastMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date)
      const year = currentMonth === 0 ? currentYear - 1 : currentYear
      return (
        p.payment_status === "completed" && paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === year
      )
    })
    .reduce((sum, p) => sum + p.amount, 0)

  const revenueGrowth = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0

  const occupancyRate = Math.round((rooms.filter((r) => !r.is_available).length / rooms.length) * 100)

  const popularServices = bookingServices.reduce((acc: any, bs: any) => {
    const serviceName = bs.services.name
    acc[serviceName] = (acc[serviceName] || 0) + bs.quantity
    return acc
  }, {})

  const topService = Object.entries(popularServices).sort(([, a]: any, [, b]: any) => b - a)[0]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Booking Growth</CardTitle>
          {bookingGrowth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.abs(bookingGrowth).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {bookingGrowth >= 0 ? "Increase" : "Decrease"} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
          {revenueGrowth >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.abs(revenueGrowth).toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            {revenueGrowth >= 0 ? "Increase" : "Decrease"} from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Booking Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averageBookingValue.toFixed(0)}</div>
          <p className="text-xs text-muted-foreground">Per booking average</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Service</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{topService ? topService[0] : "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {topService ? `${topService[1]} bookings` : "No services booked"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
