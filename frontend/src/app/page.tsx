"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AddTask from "@/components/addTask";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "../app/api/axios"; // Adjust the import path as needed
import { useAuth } from "../context/authProvider"; // Import useAuth

const FETCH_TASKS_URL = "/tasks"; // Adjust the URL according to your setup

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]); // Adjust the type according to your task data structure
  const [error, setError] = useState<string | null>(null); // Set state type to string or null
  const { authData } = useAuth(); // Get authentication data from useAuth

  useEffect(() => {
    // Fetch tasks when the component mounts
    const fetchTasks = async () => {
      if (!authData) {
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get(FETCH_TASKS_URL, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`, // Use the accessToken from authData
          },
        });
        setTasks(response.data);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [authData]); // Fetch tasks whenever authData changes

  return (
    <>
      <div className="font-sans w-auto bg-gradient-to-br from-[#000000] to-[#130F40]">
        <Header />
        <div className="flex flex-col items-center mt-32">
          <p className="text-xl font-bold text-white">TASKS</p>
          <Card className="w-full max-w-screen-md rounded">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {tasks.length === 0 ? (
              <p className="text-white text-center">No tasks available</p>
            ) : (
              <CardContent className="flex flex-col p-4 space-y-4">
              <div className="flex justify-center p-4">
                <AddTask />
              </div>
                {tasks.map((task) => (
                  <div key={task._id} className="bg-[#F4ECE6] p-4 border border-gray-200 rounded">
                    <div className="flex flex-col space-y-4">
                      <p className="font-bold">{task.title}</p>
                      <p>{task.description}</p>
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`completed-${task._id}`} checked={task.completed} />
                        <label htmlFor={`completed-${task._id}`}>Completed</label>
                      </div>
                      <p>Started at: {new Date(task.createdAt).toLocaleDateString()}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-black border-solid border-2 rounded bg-neutral-400 hover:bg-neutral-600">
                          Edit
                        </Button>
                        <Button variant="destructive" className="border-black border-solid border-2 text-white rounded bg-red-600 hover:bg-red-900">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        </div>
        <Footer />
      </div>
    </>
  );
}
