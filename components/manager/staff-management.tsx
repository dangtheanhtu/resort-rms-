"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Mail, Phone, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface StaffManagementProps {
  profiles: any[]
}

export function StaffManagement({ profiles }: StaffManagementProps) {
  const [isAddingStaff, setIsAddingStaff] = useState(false)
  const [isEditingStaff, setIsEditingStaff] = useState(false)
  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'receptionist'
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const staff = profiles.filter((profile) => ["receptionist", "manager"].includes(profile.role))
  const customers = profiles.filter((profile) => profile.role === "customer")

  const roleColors = {
    manager: "bg-purple-100 text-purple-800",
    receptionist: "bg-blue-100 text-blue-800",
    customer: "bg-green-100 text-green-800",
  }

  const handleUpdateStaff = async () => {
    if (!formData.full_name || !formData.email || !formData.role) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
        })
        .eq('id', editingStaff.id)

      if (error) throw error

      alert('Cập nhật nhân viên thành công!')
      setIsEditingStaff(false)
      setEditingStaff(null)
      setFormData({ full_name: '', email: '', phone: '', role: 'receptionist' })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      return
    }

    setIsLoading(true)
    try {
      // Note: This will also delete the user from auth.users due to cascade
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', staffId)

      if (error) throw error

      alert('Xóa nhân viên thành công!')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditStaff = (staff: any) => {
    setEditingStaff(staff)
    setFormData({
      full_name: staff.full_name,
      email: staff.email,
      phone: staff.phone || '',
      role: staff.role
    })
    setIsEditingStaff(true)
  }

  const resetForm = () => {
    setFormData({ full_name: '', email: '', phone: '', role: 'receptionist' })
    setEditingStaff(null)
    setIsAddingStaff(false)
    setIsEditingStaff(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Staff Directory</h3>
          <p className="text-sm text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => alert('Chức năng thêm nhân viên cần được triển khai với Supabase Auth Admin')}>
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {member.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.full_name}</CardTitle>
                  <Badge className={roleColors[member.role as keyof typeof roleColors]}>{member.role}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleEditStaff(member)}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteStaff(member.id)}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditingStaff} onOpenChange={setIsEditingStaff}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>Update staff information and role</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="editStaffName">Full Name</Label>
              <Input
                id="editStaffName"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStaffEmail">Email (Read-only)</Label>
              <Input
                id="editStaffEmail"
                placeholder="john@example.com"
                value={formData.email}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStaffPhone">Phone</Label>
              <Input
                id="editStaffPhone"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStaffRole">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleUpdateStaff}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Staff'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Customer Statistics</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  customers.filter((c) => {
                    const created = new Date(c.created_at)
                    const now = new Date()
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                  }).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staff.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
