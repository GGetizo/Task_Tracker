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
import { useAuth } from "../context/authProvider";

const EDIT_TASK_URL = "/tasks";

interface EditButtonProps {
  task: {
    _id: string;
    title: string;
    description: string;
    deadline: string;
  };
  onUpdate: (updatedTask: any) => void;
}

const EditButton: React.FC<EditButtonProps> = ({ task, onUpdate }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState<Date | undefined>(task.deadline ? new Date(task.deadline) : undefined);
  const { authData } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!authData) {
      setError("User is not authenticated");
      return;
    }
  
    try {
      const response = await axios.patch(`${EDIT_TASK_URL}/${task._id}`, {
        title,
        description,
        deadline: date?.toISOString(), // Convert date to ISO string
      }, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });
      console.log("Task updated successfully:", response.data.task);
      onUpdate(response.data.task);
      setError(null);
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    }
  };
  

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="border-black border-solid border-2 rounded bg-[#49D649] hover:bg-[#348734]"
          >
            Edit
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent
        className="bg-[#171717] w-auto border-black lg:overflow-auto overflow-scroll lg:max-h-[100%] max-h-[70%]">
          <AlertDialogTitle>
            <p className="flex justify-center text-white">Edit Task</p>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p className="flex justify-center text-white">Edit your task</p>
          </AlertDialogDescription>
          <form onSubmit={handleSubmit}>
            <label htmlFor="editTitle">
              <p className="font-bold text-white">Edit Title</p>
            </label>
            <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
             className="text-white rounded w-72"/>
            <label htmlFor="editDescription">
              <p className="font-bold text-white">Edit Description</p>
            </label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-white rounded w-72"/>
            <label htmlFor="date">
              <p className="font-bold text-white">Deadline</p>
            </label>
            <Button
              variant={"outline"}
              className={cn(
                "w-72 justify-start text-left font-normal text-white border-black bord-solid border-2",
                !date && "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {date ? format(date, "PPP") : <p>Pick a date</p>}
            </Button>
            <Calendar
              className="bg-[#171717] w-72 text-white border-black bord-solid border-2"
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Button
              type="submit"
              className="mt-4 bg-[#D7BDFF] hover:bg-[#501C82] rounded"
              variant="outline"
            >
              Submit
            </Button>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditButton;
