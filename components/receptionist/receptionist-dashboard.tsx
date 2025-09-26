"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookingsList } from "./bookings-list"
import { CheckInOutList } from "./check-in-out-list"
import { RoomsOverview } from "./rooms-overview"
import { LogOut, Calendar, Home, Users, ClipboardCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ReceptionistDashboardProps {
  profile: any
  bookings: any[]
  rooms: any[]
  todayCheckIns: any[]
  todayCheckOuts: any[]
}

export function ReceptionistDashboard({
  profile,
  bookings,
  rooms,
  todayCheckIns,
  todayCheckOuts,
}: ReceptionistDashboardProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  // Calculate statistics
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length
  const checkedInGuests = bookings.filter((b) => b.status === "checked_in").length
  const availableRooms = rooms.filter((r) => r.is_available).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Receptionist Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {profile.full_name}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">All time bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{checkedInGuests}</div>
              <p className="text-xs text-muted-foreground">Current guests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableRooms}</div>
              <p className="text-xs text-muted-foreground">Ready for booking</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="today">Today's Tasks</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Today's Operations</h2>
              <p className="text-muted-foreground text-pretty">
                Manage today's check-ins, check-outs, and priority tasks.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Today's Check-ins ({todayCheckIns.length})
                  </CardTitle>
                  <CardDescription>Guests arriving today</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckInOutList bookings={todayCheckIns} type="checkin" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Today's Check-outs ({todayCheckOuts.length})
                  </CardTitle>
                  <CardDescription>Guests departing today</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckInOutList bookings={todayCheckOuts} type="checkout" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">All Bookings</h2>
              <p className="text-muted-foreground text-pretty">
                View and manage all guest reservations and their status.
              </p>
            </div>

            <BookingsList bookings={bookings} />
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Room Management</h2>
              <p className="text-muted-foreground text-pretty">Monitor room availability and maintenance status.</p>
            </div>

            <RoomsOverview rooms={rooms} />
          </TabsContent>

          <TabsContent value="guests" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Guest Directory</h2>
              <p className="text-muted-foreground text-pretty">View current and upcoming guest information.</p>
            </div>

            <div className="grid gap-4">
              {bookings
                .filter((booking) => booking.status === "checked_in")
                .map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-semibold">{booking.profiles.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Room {booking.rooms.room_number} • {booking.profiles.email}
                        </p>
                      </div>
                      <Badge variant="secondary">Checked In</Badge>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
