"use client"

import { useState } from "react"
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
import { Plus, Edit, DollarSign, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ServiceManagementProps {
  services: any[]
  bookingServices: any[]
}

export function ServiceManagement({ services, bookingServices }: ServiceManagementProps) {
  const [isAddingService, setIsAddingService] = useState(false)
  const [isEditingService, setIsEditingService] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAddService = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          is_active: true
        })

      if (error) throw error

      alert('Thêm dịch vụ thành công!')
      setIsAddingService(false)
      setFormData({ name: '', description: '', price: '', category: '' })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (serviceId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId)

      if (error) throw error

      alert('Cập nhật trạng thái dịch vụ thành công!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditService = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      category: service.category
    })
    setIsEditingService(true)
  }

  const handleUpdateService = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        })
        .eq('id', editingService.id)

      if (error) throw error

      alert('Cập nhật dịch vụ thành công!')
      setIsEditingService(false)
      setEditingService(null)
      setFormData({ name: '', description: '', price: '', category: '' })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '' })
    setEditingService(null)
    setIsAddingService(false)
    setIsEditingService(false)
  }

  // Calculate service popularity
  const serviceStats = services.map((service) => {
    const bookings = bookingServices.filter((bs) => bs.service_id === service.id)
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, bs) => sum + bs.total_price, 0)
    return { ...service, totalBookings, totalRevenue }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Service Catalog</h3>
          <p className="text-sm text-muted-foreground">Manage additional services and amenities</p>
        </div>
        <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Create a new service for your resort</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  placeholder="Spa Massage"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceCategory">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spa">Spa</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="recreation">Recreation</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="servicePrice">Price</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  placeholder="120.00"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea
                  id="serviceDescription"
                  placeholder="Service description..."
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
                  onClick={handleAddService}
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Service'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={isEditingService} onOpenChange={setIsEditingService}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="editServiceName">Service Name</Label>
              <Input
                id="editServiceName"
                placeholder="Spa Massage"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editServiceCategory">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spa">Spa</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="recreation">Recreation</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editServicePrice">Price</Label>
              <Input
                id="editServicePrice"
                type="number"
                placeholder="120.00"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editServiceDescription">Description</Label>
              <Textarea
                id="editServiceDescription"
                placeholder="Service description..."
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
                onClick={handleUpdateService}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Service'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {serviceStats.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge variant={service.is_active ? "secondary" : "outline"}>
                  {service.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="capitalize">{service.category}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">${service.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{service.totalBookings} bookings</span>
                </div>
              </div>

              {service.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
              )}

              <div className="text-sm">
                <p className="font-medium">Total Revenue: ${service.totalRevenue}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleEditService(service)}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={service.is_active ? "destructive" : "default"}
                  className="flex-1"
                  onClick={() => handleToggleActive(service.id, service.is_active)}
                  disabled={isLoading}
                >
                  {service.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
