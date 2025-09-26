"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, Tv, Car, Users, Star } from "lucide-react"

interface RoomCardProps {
  room: any
  onBook: () => void
}

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  TV: Tv,
  "Mini Bar": Car,
  AC: Star,
  Jacuzzi: Star,
  Balcony: Star,
}

export function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-gradient-to-br from-resort-rose to-resort-cream relative">
        <img
          src={room.image_url || `/placeholder.svg?height=200&width=300&query=${room.room_type} hotel room`}
          alt={`${room.room_type} room`}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Room {room.room_number}</Badge>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize">{room.room_type} Room</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">${room.price_per_night}</p>
            <p className="text-sm text-muted-foreground">per night</p>
          </div>
        </div>
        <CardDescription className="text-pretty">{room.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Up to {room.capacity} guests</span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 4).map((amenity: string) => {
                const Icon = amenityIcons[amenity] || Star
                return (
                  <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon className="h-3 w-3" />
                    <span>{amenity}</span>
                  </div>
                )
              })}
              {room.amenities.length > 4 && (
                <span className="text-xs text-muted-foreground">+{room.amenities.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        <Button onClick={onBook} className="w-full bg-primary hover:bg-primary/90">
          Reserve Room
        </Button>
      </CardContent>
    </Card>
  )
}
