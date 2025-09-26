import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Resort Management System</CardTitle>
            <CardDescription>
              Streamline your resort operations with our comprehensive management platform
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/register">Create Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
