"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "../app/api/axios";
import { AxiosError } from "axios";
import { useAuth } from "../context/authProvider";

const CREATE_TASK_URL = "/tasks/newTask";

export default function TaskList() {
  const [date, setDate] = useState<Date | undefined>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { authData } = useAuth();
  const userId = authData?.userId;

  console.log('userId:', userId);
  console.log('isAuthenticated:', authData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || !description || !date) {
      setErrorMsg("All fields are required");
      setSuccessMsg("");
      return;
    }
  
    if (!authData) {
      setErrorMsg("User is not authenticated");
      setSuccessMsg("");
      return;
    }
  
    try {
      const response = await axios.post(CREATE_TASK_URL, {
        title,
        description,
        completed: false, // Set default value if needed
        // createdAt: date.toISOString(), // Not needed as it's handled by default value
      }, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        }
      });
  
      console.log('Response:', response);
      setSuccessMsg("Task created successfully!");
      setErrorMsg("");
      setTitle("");
      setDescription("");
      setDate(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error message:', error.message);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
        }
      } else if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
      } else {
        console.error('An unknown error occurred');
      }
      setErrorMsg("Failed to create task. Please try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="flex flex-col space-y-5 ">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="lg:w-[36.2rem] w-72 border-2 bg-neutral-400 hover:bg-neutral-600 rounded-xl" variant="outline">
            Add
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#F4ECE6] rounded w-auto border-solid border-2
         border-black lg:overflow-auto overflow-scroll lg:max-h-[100%] max-h-[70%]">
          <AlertDialogTitle className="flex justify-center m-0">
            <p>Create a task</p>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            <p className="m-0">Please enter all fields</p>
          </AlertDialogDescription>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">
              <p className="font-bold">Task Title</p>
            </label>
            <Input
              type="text"
              className="rounded w-auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label htmlFor="description">
              <p className="font-bold">Task Description</p>
            </label>
            <Textarea
              className="rounded w-auto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label htmlFor="date">
              <p className="font-bold">Deadline</p>
            </label>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
            <Calendar
              className="bg-white border-solid border-2 border-black"
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            <Button type="submit" className="mt-4 hover:bg-gray-600 rounded" variant="outline">
              Submit
            </Button>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {successMsg && <p className="text-green-500">{successMsg}</p>}
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
