"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Users, DollarSign } from "lucide-react"

interface RoomManagementProps {
  rooms: any[]
}

export function RoomManagement({ rooms }: RoomManagementProps) {
  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [formData, setFormData] = useState({
    room_number: '',
    room_type: '',
    price_per_night: '',
    capacity: '',
    description: ''
  })
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAddRoom = async () => {
    if (!formData.room_number || !formData.room_type || !formData.price_per_night || !formData.capacity) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('rooms')
        .insert({
          room_number: formData.room_number,
          room_type: formData.room_type,
          price_per_night: parseFloat(formData.price_per_night),
          capacity: parseInt(formData.capacity),
          description: formData.description,
          amenities: ['WiFi', 'TV', 'AC'], // Default amenities
          is_available: true
        })

      if (error) throw error

      alert('Thêm phòng thành công!')
      setIsAddingRoom(false)
      setFormData({
        room_number: '',
        room_type: '',
        price_per_night: '',
        capacity: '',
        description: ''
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleAvailability = async (roomId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_available: !currentStatus })
        .eq('id', roomId)

      if (error) throw error

      alert('Cập nhật trạng thái phòng thành công!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditRoom = (room: any) => {
    setEditingRoom(room)
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: room.price_per_night.toString(),
      capacity: room.capacity.toString(),
      description: room.description || ''
    })
    setIsEditingRoom(true)
  }

  const handleUpdateRoom = async () => {
    if (!formData.room_number || !formData.room_type || !formData.price_per_night || !formData.capacity) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          room_number: formData.room_number,
          room_type: formData.room_type,
          price_per_night: parseFloat(formData.price_per_night),
          capacity: parseInt(formData.capacity),
          description: formData.description,
        })
        .eq('id', editingRoom.id)

      if (error) throw error

      alert('Cập nhật phòng thành công!')
      setIsEditingRoom(false)
      setEditingRoom(null)
      setFormData({
        room_number: '',
        room_type: '',
        price_per_night: '',
        capacity: '',
        description: ''
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      room_number: '',
      room_type: '',
      price_per_night: '',
      capacity: '',
      description: ''
    })
    setEditingRoom(null)
    setIsAddingRoom(false)
    setIsEditingRoom(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Room Inventory</h3>
          <p className="text-sm text-muted-foreground">Manage your room types, pricing, and availability</p>
        </div>
        <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>Create a new room in your inventory</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  placeholder="101"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={formData.room_type} onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Night</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="150.00"
                  value={formData.price_per_night}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="2"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Room description..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddRoom}
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Room'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Room Dialog */}
      <Dialog open={isEditingRoom} onOpenChange={setIsEditingRoom}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update room information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="editRoomNumber">Room Number</Label>
              <Input
                id="editRoomNumber"
                placeholder="101"
                value={formData.room_number}
                onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editRoomType">Room Type</Label>
              <Select value={formData.room_type} onValueChange={(value) => setFormData(prev => ({ ...prev, room_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPrice">Price per Night</Label>
              <Input
                id="editPrice"
                type="number"
                placeholder="150.00"
                value={formData.price_per_night}
                onChange={(e) => setFormData(prev => ({ ...prev, price_per_night: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editCapacity">Capacity</Label>
              <Input
                id="editCapacity"
                type="number"
                placeholder="2"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                placeholder="Room description..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleUpdateRoom}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Room'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Capacity: {room.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">${room.price_per_night}/night</span>
                  </div>
                </div>
              </div>

              {room.description && <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>}

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
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleEditRoom(room)}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={room.is_available ? "destructive" : "default"}
                  className="flex-1"
                  onClick={() => handleToggleAvailability(room.id, room.is_available)}
                  disabled={isLoading}
                >
                  {room.is_available ? "Mark Occupied" : "Mark Available"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
