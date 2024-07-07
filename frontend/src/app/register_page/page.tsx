"use client";

import axios from "../api/axios";
import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AxiosError } from "axios";

const REGISTER_URL = '/users/register';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,24}$/;

interface ErrorResponse {
    message: string;
}

export default function Page() {
    const userRef = useRef<HTMLInputElement | null>(null);
    const errRef = useRef<HTMLParagraphElement | null>(null);

    const [username, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [password, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatchPwd(password === matchPwd);
    }, [password, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, matchPwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, {
                username,
                email,
                password
            });
            console.log(response.data);
            setSuccess(true);
        } catch (error) {
            const err = error as AxiosError;
            if (!err.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                const data = err.response.data as ErrorResponse;
                setErrMsg('Bad Request: ' + (data.message || 'Invalid Input'));
            } else if (err.response?.status === 409) {
                setErrMsg('Username or email already taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current?.focus();
        }
    };

    return (
        <>
            {success ? (
                <section className="flex justify-center items-center p-32">
                    <Card className="flex justify-center items-center p-32 lg:w-96 flex-shrink"
                        style={{ boxShadow: '10px 10px 45px #d4d4d4, -10px -10px 45px #d4d4d4' }}>
                        <CardContent>
                            <h1 className="text-lg font-bold">Success!</h1>
                            <p>
                                <Link href="/login_page">
                                    <p className="hover:underline">Log In!</p>
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </section>
            ) : (
                <div className="bg-gradient-to-br from-[#000000] to-[#130F40]">
                    <Header />
                    <div className="flex justify-center m-20">
                        <Card className="lg:w-auto w-72 flex justify-center items-center bg-[#E8E4C9]"
                            style={{ boxShadow: '10px 10px 45px #000000, -10px -10px 45px #000000' }}>
                            <CardContent className="px-20 py-10">
                                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                                    {errMsg}
                                </p>
                                <p className="p-5 text-4xl font-bold flex justify-center">Sign Up</p>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="username">
                                            Username:
                                        </label>
                                        <span className={userFocus && !validName ? "invalid" : "hide"}>
                                            <p>Invalid</p>
                                        </span>
                                        <span className={userFocus && validName ? "valid" : "hide"}>
                                            <p>Valid</p>
                                        </span>
                                        <Input
                                            className="lg:w-96 flex-shrink"
                                            type="text"
                                            id="username"
                                            ref={userRef}
                                            autoComplete="off"
                                            placeholder="Juan Dela Cruz"
                                            onChange={(e) => setUser(e.target.value)}
                                            required
                                            aria-invalid={validName ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={() => setUserFocus(true)}
                                            onBlur={() => setUserFocus(false)}
                                        />
                                        <p id="uidnote" className={userFocus && !validName ? "instructions" : "offscreen"}>
                                            4 to 24 characters.<br />
                                            Must begin with a letter.<br />
                                            Letters, numbers, underscores, hyphens allowed.
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="email">
                                            Email:
                                        </label>
                                        <span className={emailFocus && !validEmail ? "invalid" : "hide"}>
                                            <p>Invalid</p>
                                        </span>
                                        <span className={emailFocus && validEmail ? "valid" : "hide"}>
                                            <p>Valid</p>
                                        </span>
                                        <Input
                                            className="lg:w-96 flex-shrink"
                                            type="email"
                                            id="email"
                                            placeholder="juandelacruz@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="emailnote"
                                            onFocus={() => setEmailFocus(true)}
                                            onBlur={() => setEmailFocus(false)}
                                        />
                                        <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                                            Must be a valid email address.<br />
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="password">
                                            Password:
                                        </label>
                                        <span className={pwdFocus && !validPwd ? "invalid" : "hide"}>
                                            <p>Invalid</p>
                                        </span>
                                        <span className={pwdFocus && validPwd ? "valid" : "hide"}>
                                            <p>Valid</p>
                                        </span>
                                        <Input
                                            className="lg:w-96 flex-shrink"
                                            type="password"
                                            id="password"
                                            placeholder="*********"
                                            onChange={(e) => setPwd(e.target.value)}
                                            required
                                            aria-invalid={validPwd ? "false" : "true"}
                                            aria-describedby="pwdnote"
                                            onFocus={() => setPwdFocus(true)}
                                            onBlur={() => setPwdFocus(false)}
                                        />
                                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                            6 to 24 characters.<br />
                                            Must include uppercase and lowercase letters.<br />
                                        </p>
                                    </div>
                                    <div>
                                        <label htmlFor="confirm_pwd">
                                            Confirm Password:
                                        </label>
                                        <span className={matchPwdFocus && !validMatchPwd ? "invalid" : "hide"}>
                                            <p>Invalid</p>
                                        </span>
                                        <span className={matchPwdFocus && validMatchPwd ? "valid" : "hide"}>
                                            <p>Valid</p>
                                        </span>
                                        <Input
                                            className="lg:w-96 flex-shrink"
                                            type="password"
                                            id="confirm_pwd"
                                            placeholder="*********"
                                            onChange={(e) => setMatchPwd(e.target.value)}
                                            required
                                            aria-invalid={validMatchPwd ? "false" : "true"}
                                            aria-describedby="confirmpwdnote"
                                            onFocus={() => setMatchPwdFocus(true)}
                                            onBlur={() => setMatchPwdFocus(false)}
                                        />
                                        <p id="confirmpwdnote" className={matchPwdFocus && !validMatchPwd ? "instructions" : "offscreen"}>
                                            Must match the password<br />
                                        </p>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button
                                            disabled={!validName || !validEmail || !validPwd || !validMatchPwd}
                                            type="submit"
                                            className="w-56 rounded"
                                            variant={"outline"}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                    <p className="text-xs">Already have an account?</p>
                                    <Link href="/login_page">
                                        <p className="text-xs hover:underline">Log In</p>
                                    </Link>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    <Footer/>
                </div>
            )}
        </>
    );
}
