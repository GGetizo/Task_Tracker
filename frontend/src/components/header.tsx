"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/context/authProvider'; // Import useAuth hook

export default function Header() {
    const { authData, logout } = useAuth();

    React.useEffect(() => {
        if (authData) {
            console.log('Header: Authenticated user', authData.username);
        } else {
            console.log('Header: No user authenticated');
        }
    }, [authData]);

    return (
        <header className="h-6 top-0 flex flex-row items-center justify-between lg:px-4 px-2 py-8">
            <div className="flex-shrink-0 flex items-center lg:space-x-2">
                <p className="lg:text-base text-xs text-white">Task Tracker</p>
            </div>
            <div className="flex flex-row lg:space-x-8 space-x-2">
                <Link href="/">
                    <p className="lg:text-base text-xs hover:underline text-white">Home</p>
                </Link>
                {authData ? (
                    <>
                        <p className="lg:text-base text-xs text-white">Welcome, {authData.username}</p>
                        <Button onClick={logout} variant={"outline"} className="rounded border-black bg-red-600 hover:bg-red-800 w-14 h-7 text-white">
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/login_page">
                        <p className="lg:text-base text-xs hover:underline text-white">Login</p>
                    </Link>
                )}
            </div>
        </header>
    );
}
