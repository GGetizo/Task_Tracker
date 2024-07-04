"use client"
import Header from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="font-sans w-auto bg-gradient-to-r from-[#F4ECE6] to-[#FFFFFF]">
      <Header/>
      <div className="flex justify-center m-32">
      <Card className="lg:w-auto w-80 h-auto rounded border-black">
        <CardContent className="flex flex-row p-0">
          <div className="bg-[#F4ECE6] flex flex-col items-center justify-center p-4">
            <div className="flex flex-col space-y-5">
            <div>
              <p>Task 1</p>
              <p>Description</p>
              <p>Completed</p>
              <p>User</p>
            </div>
            <div>
              <p>Task 2</p>
              <p>Description</p>
              <p>Completed</p>
              <p>User</p>
            </div>
          </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
