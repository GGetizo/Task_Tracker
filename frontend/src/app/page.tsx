"use client"
import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import EditButton from "@/components/editButton";
import AddTask from "@/components/addTask";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "../app/api/axios"; // Adjust the import path as needed
import { useAuth } from "../context/authProvider"; // Import useAuth

const FETCH_TASKS_URL = "/tasks/getTask"; // Adjust the URL according to your setup
const DELETE_TASK_URL = "/tasks/deleteTask"; // Adjust the URL according to your setup

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authData) {
        setError("User is not authenticated");
        return;
      }

      try {
        const response = await axios.get(FETCH_TASKS_URL, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        });
        setTasks(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks. Please try again.");
      }
    };

    fetchTasks();
  }, [authData]);

  const deleteTask = async (taskId: string) => {
    if (!authData) {
      setError("User is not authenticated");
      return;
    }

    try {
      await axios.delete(`${DELETE_TASK_URL}/${taskId}`, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });
      // Remove the task from the state after successful deletion
      setTasks(tasks.filter(task => task._id !== taskId));
      setError(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleUpdateTask = (updatedTask: any) => {
    setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
  };

  return (
    <>
      <div className="font-sans w-auto bg-gradient-to-br from-[#000000] to-[#130F40]">
        <Header />
        <div className="flex flex-col items-center mt-32">
          <p className="text-xl font-bold text-white">TASKS</p>
          <AddTask />
          <Card className="w-full max-w-screen-md rounded mb-24">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {tasks.length === 0 ? (
              <p className="text-white text-center">No tasks available</p>
            ) : (
              <CardContent className="flex flex-col p-4 space-y-4">
                <div className="flex justify-center p-4">
                </div>
                {tasks.map((task) => (
                  <div key={task._id} className="bg-[#F4ECE6] p-4 border border-gray-200 rounded">
                    <div className="flex flex-col space-y-4">
                      <p className="font-bold">{task.title}</p>
                      <p>{task.description}</p>
                      <div className="flex items-center space-x-2">
                        <Checkbox checked={task.completed} /> {/* Assume you handle the checked state */}
                        <label>Completed</label>
                      </div>
                      <p>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline set'}</p>
                      <div className="flex space-x-2">
                        <EditButton task={task} onUpdate={handleUpdateTask} />
                        <Button
                          variant="destructive"
                          className="border-black border-solid border-2 text-white rounded bg-red-600 hover:bg-red-900"
                          onClick={() => deleteTask(task._id)}
                        >
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
