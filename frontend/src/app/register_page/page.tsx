"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
                username,
                email,
                password,
            });

            if (response.status === 200) {
                router.push("/login_page"); // Redirect to login page after successful registration
            } else {
                throw new Error(response.data.message || "Registration failed");
            }
        } catch (err: any) {
            setError("Registration failed: " + (err.response?.data?.message || err.message || "An error occurred"));
        }
    };

    return (
        <div>
            <Header />
            <div className="flex justify-center m-32">
                <Card className="w-auto flex justify-center items-center">
                    <CardContent>
                        <p className="p-5 flex justify-center">Sign Up</p>
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
                                <p>Email:</p>
                                <Input
                                    type="email"
                                    placeholder="juandelacruz@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                <Link href="/login_page">
                                    <p className="text-xs">Already have an account?</p>
                                    <p className="text-xs hover:underline">Log In</p>
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
