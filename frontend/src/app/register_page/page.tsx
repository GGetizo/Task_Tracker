import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"

export default function Home() {
    return (
      <div>
        <Header/>
        <div className="flex justify-center m-32">
          <Card className="w-auto flex justify-center items-center">
          <CardContent>
          <p className="p-5 flex justify-center">Sign In</p>
          <p>Username:</p>
          <Input type="text" placeholder="Juan Dela Cruz" required/>
          <p>Email</p>
          <Input type="email" placeholder="juandelacruz@gmail.com" required/>
          <p>Password:</p>
          <Input type="password" placeholder="*********" required/>
          <div className="flex flex-row justify-center space-x-6 p-2">
            <Link href="/login_page">
            <p className="text-xs">Already have an account?</p>
            <p className="text-xs hover:underline">Log In</p>
            </Link>
            <Button type="submit" variant={"outline"}>Submit</Button>
          </div>
          </CardContent>
          </Card>
        </div>
      </div>
    );
  }