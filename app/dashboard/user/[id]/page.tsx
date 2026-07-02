
"use client"

import {
  User,
  Shield,
  Bell,
  Activity,
  Camera,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  KeyRound,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { user } from "@prisma/client"
import { SectionCards } from "@/components/section-cards"

export default function ProfilePage() {

  const params = useParams()
  const id = params.id as string
  const [user, setUser] = useState<user>()

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${id}`)
        const data = await res.json()
        setUser(data.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUser()
  }, [])

  console.log(user, "ksjfksajfk")
  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
      {/* HEADER */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="h-24 w-24 border">
                  <AvatarImage src="/avatar.jpg" />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>

                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  {user?.name}
                </h1>

                <p className="text-muted-foreground">
                  {user?.email}
                </p>

                <div className="mt-2 flex gap-2">
                  <Badge>{user?.role}</Badge>
                  <Badge variant={`${user?.verified ? "default" : "destructive"}`} >
                    {user?.verified
                      ? "Verified"
                      : "Not Verified"
                    }
                  </Badge>
                </div>
              </div>
            </div>

            <Button>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <SectionCards />
                  

      {/* TABS */}
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>

          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>

          <TabsTrigger value="preferences">
            <Bell className="mr-2 h-4 w-4" />
            Preferences
          </TabsTrigger>

          <TabsTrigger value="activity">
            <Activity className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>
                Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input defaultValue="Chander" />
                </div>

                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input defaultValue="Shekhar" />
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input defaultValue="chander" />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="admin@shalomworship.com" />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+91 9876543210" />
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input placeholder="https://shalomworship.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  rows={5}
                  placeholder="Tell something about yourself..."
                />
              </div>

              <Button>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>
                Security Settings
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" />
                </div>
              </div>

              <Button>
                <KeyRound className="mr-2 h-4 w-4" />
                Update Password
              </Button>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Two Factor Authentication
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Secure your account with 2FA
                  </p>
                </div>

                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>
                Preferences
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Email Notifications
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>

                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Marketing Emails
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Receive product announcements
                  </p>
                </div>

                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    Dark Mode
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Use dark appearance
                  </p>
                </div>

                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVITY */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">
                      Created Song
                    </p>
                    <p className="text-muted-foreground">
                      Peedhi Se Peedhi Tak
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">
                      Updated Artist
                    </p>
                    <p className="text-muted-foreground">
                      Shalom Worship
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">
                      Created Event
                    </p>
                    <p className="text-muted-foreground">
                      Worship Night 2026
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">
                      Last Login
                    </p>
                    <p className="text-muted-foreground">
                      Today at 09:32 AM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
