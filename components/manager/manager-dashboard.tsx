"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AnalyticsOverview } from "./analytics-overview"
import { RevenueChart } from "./revenue-chart"
import { BookingsChart } from "./bookings-chart"
import { RoomManagement } from "./room-management"
import { ServiceManagement } from "./service-management"
import { StaffManagement } from "./staff-management"
import { LogOut, BarChart3, Home, Users, Settings, DollarSign, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ManagerDashboardProps {
  profile: any
  bookings: any[]
  rooms: any[]
  payments: any[]
  services: any[]
  profiles: any[]
  bookingServices: any[]
}

export function ManagerDashboard({
  profile,
  bookings,
  rooms,
  payments,
  services,
  profiles,
  bookingServices,
}: ManagerDashboardProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // Calculate key metrics
  const totalRevenue = payments.filter((p) => p.payment_status === "completed").reduce((sum, p) => sum + p.amount, 0)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date)
      return (
        p.payment_status === "completed" &&
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      )
    })
    .reduce((sum, p) => sum + p.amount, 0)

  const occupancyRate = Math.round((rooms.filter((r) => !r.is_available).length / rooms.length) * 100)

  const activeBookings = bookings.filter((b) => ["confirmed", "checked_in"].includes(b.status)).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
              <p className="text-muted-foreground">Resort Operations & Analytics</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">Current occupancy</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings}</div>
              <p className="text-xs text-muted-foreground">Confirmed & checked-in</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="rooms" className="gap-2">
              <Home className="h-4 w-4" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Settings className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="staff" className="gap-2">
              <Users className="h-4 w-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Business Analytics</h2>
              <p className="text-muted-foreground text-pretty">
                Comprehensive insights into your resort's performance and trends.
              </p>
            </div>

            <AnalyticsOverview
              bookings={bookings}
              payments={payments}
              rooms={rooms}
              bookingServices={bookingServices}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart payments={payments} />
              <BookingsChart bookings={bookings} />
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Room Management</h2>
              <p className="text-muted-foreground text-pretty">
                Manage room inventory, pricing, and availability settings.
              </p>
            </div>

            <RoomManagement rooms={rooms} />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Service Management</h2>
              <p className="text-muted-foreground text-pretty">
                Configure additional services and amenities offered to guests.
              </p>
            </div>

            <ServiceManagement services={services} bookingServices={bookingServices} />
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Staff Management</h2>
              <p className="text-muted-foreground text-pretty">Manage staff accounts and access permissions.</p>
            </div>

            <StaffManagement profiles={profiles} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Detailed Reports</h2>
              <p className="text-muted-foreground text-pretty">
                Generate comprehensive reports for business analysis and planning.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Report</CardTitle>
                  <CardDescription>Detailed revenue breakdown by period</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">Generate Report</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Report</CardTitle>
                  <CardDescription>Room utilization and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">Generate Report</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Analytics</CardTitle>
                  <CardDescription>Customer behavior and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary hover:bg-primary/90">Generate Report</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
