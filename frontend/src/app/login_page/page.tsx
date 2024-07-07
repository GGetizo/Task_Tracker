// login_page/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import { useAuth } from "@/context/authProvider";
import axios from "../api/axios"; // Import axios for making HTTP requests
import { AxiosError } from "axios";

const LOGIN_URL = '/users/login';

export default function Login() {
    const { setAuth } = useAuth();
    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [username, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [username, password]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                window.location.href = '/'; // Redirect to the home page
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(LOGIN_URL, 
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log('Response data:', response?.data); // Log the full response data
    
            const { accessToken, userId } = response?.data; // Extract userId
            const user = { username, accessToken, userId }; // Include userId
    
            console.log('User object:', user); // Log the user object
    
            setAuth(user);
            localStorage.setItem('user', JSON.stringify(user)); // Sync with localStorage
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (error) {
            const err = error as AxiosError;
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Incorrect Username or Password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
        }
    }
    
 
    return (
        <>
        {success ? (
            <section className="flex justify-center items-center content-center">
                <h1>Log In Succesful</h1>
            </section>
        ) : (
        <div> 
            <Header />
            <div className="flex justify-center m-20">
                <Card className="w-[28rem] flex justify-center items-center"
                style={{boxShadow:'10px 10px 45px #d4d4d4, -10px -10px 45px #d4d4d4'}}>
                    <CardContent className="px-20 py-10">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                    </p>
                        <p className="p-5 text-4xl font-bold flex justify-center">Login</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="username">
                                <p>Username:</p>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Juan Dela Cruz"
                                    id="username"
                                    ref={userRef}
                                    value={username}
                                    onChange={(e) => setUser(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">
                                <p>Password:</p>
                                </label>
                                <Input
                                    type="password"
                                    placeholder="*********"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-center">
                                <Button type="submit" variant={"outline"} className="w-56 rounded">Sign In</Button>
                            </div>
                                <p className="text-xs">Don&apos;t have an account?</p>
                                <Link href="/register_page">
                                    <p className="text-xs hover:underline">Sign Up</p>
                                </Link>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
        )}
    </>
    );
}
