"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import axios from "axios"; // Import axios for making HTTP requests
import { useRouter } from "next/navigation"; // Use router for navigation

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/login", {
                email: username,
                password,
            });

            // Store the JWT token in localStorage
            localStorage.setItem("token", response.data.token);

            // Redirect to another page (e.g., dashboard)
            router.push("/dashboard");
        } catch (err: any) {
            setError("Login failed: " + err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div>
            <Header />
            <div className="flex justify-center m-32">
                <Card className="w-auto flex justify-center items-center">
                    <CardContent>
                        <p className="p-5 flex justify-center">Login</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <p>Username:</p>
                                <Input
                                    type="text"
                                    placeholder="Juan Dela Cruz"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <p>Password:</p>
                                <Input
                                    type="password"
                                    placeholder="*********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex flex-row justify-center space-x-6 p-2">
                                <Link href="/register_page">
                                    <p className="text-xs">Don&apos;t have an account?</p>
                                    <p className="text-xs hover:underline">Sign Up</p>
                                </Link>
                                <Button type="submit" variant={"outline"}>Submit</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
