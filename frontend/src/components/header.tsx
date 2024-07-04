"use client"
import Link from 'next/link'
import React, { useState } from "react";

export default function header() {    
    return (
<div>
<header className="h-6 top-0 rounded flex flex-row items-center justify-between lg:px-4 px-2 py-8">
    <div className="flex-shrink-0 flex items-center lg:space-x-2">
        <p className="lg:text-base text-xs">Task Tracker</p>
    </div>
    <div className="flex flex-row lg:space-x-8 space-x-2">
        <Link href="/">
            <p className="lg:text-base text-xs hover:underline">Home</p>
        </Link>
        <Link href="/login_page">
            <p className="lg:text-base text-xs hover:underline">Login</p>
        </Link>
    </div>
</header>
</div>
    );
}