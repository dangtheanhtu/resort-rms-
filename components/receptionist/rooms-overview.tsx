"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, Users, DollarSign } from "lucide-react"

interface RoomsOverviewProps {
  rooms: any[]
}

export function RoomsOverview({ rooms }: RoomsOverviewProps) {
  const availableRooms = rooms.filter((room) => room.is_available)
  const occupiedRooms = rooms.filter((room) => !room.is_available)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rooms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Home className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableRooms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <Home className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{occupiedRooms.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Room {room.room_number}</CardTitle>
                <Badge variant={room.is_available ? "secondary" : "destructive"}>
                  {room.is_available ? "Available" : "Occupied"}
                </Badge>
              </div>
              <CardDescription className="capitalize">{room.room_type} Room</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Up to {room.capacity} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">${room.price_per_night}/night</span>
                </div>
              </div>

              {room.amenities && room.amenities.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-1">Amenities</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity: string) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {room.amenities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Details
                </Button>
                {!room.is_available && (
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Mark Available
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
