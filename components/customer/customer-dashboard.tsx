"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RoomCard } from "./room-card"
import { BookingCard } from "./booking-card"
import { BookingModal } from "./booking-modal"
import { LogOut, Calendar, Home, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CustomerDashboardProps {
  profile: any
  rooms: any[]
  bookings: any[]
}

export function CustomerDashboard({ profile, rooms, bookings }: CustomerDashboardProps) {
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const handleBookRoom = (room: any) => {
    setSelectedRoom(room)
    setIsBookingModalOpen(true)
  }

  const handleModifyBooking = (booking: any) => {
    // TODO: Implement modify booking functionality
    alert(`Modify booking ${booking.id} - Feature coming soon!`)
  }

  const handleViewBookingDetails = (booking: any) => {
    // TODO: Implement view booking details functionality
    alert(`View details for booking ${booking.id} - Feature coming soon!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Paradise Resort</h1>
              <p className="text-muted-foreground">Welcome back, {profile.full_name}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="rooms" className="gap-2">
              <Home className="h-4 w-4" />
              Browse Rooms
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Find Your Perfect Room</h2>
              <p className="text-muted-foreground text-pretty">
                Discover our luxurious accommodations designed for your comfort and relaxation.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} onBook={() => handleBookRoom(room)} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-balance mb-2">Your Reservations</h2>
              <p className="text-muted-foreground text-pretty">Manage your current and upcoming bookings.</p>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start planning your perfect getaway by browsing our available rooms.
                  </p>
                  <Button onClick={() => setSelectedRoom(null)}>Browse Rooms</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {bookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onModify={handleModifyBooking}
                    onViewDetails={handleViewBookingDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-foreground">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{profile.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                    <Badge variant="secondary" className="capitalize">
                      {profile.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BookingModal
        room={selectedRoom}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        customerId={profile.id}
      />
    </div>
  )
}
