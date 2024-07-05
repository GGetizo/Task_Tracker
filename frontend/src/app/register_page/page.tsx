"use client"
import axios from "../api/axios";
import { useRouter } from 'next/navigation';
import { 
    useState,
    useRef,
    useEffect
 } from 'react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/header";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{6,24}$/;
const REGISTER_URL = '/users/register';


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
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(username);
        setValidName(result);
    }, [username]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password === matchPwd;
        setValidMatchPwd(match);
    }, [password, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [username, email, password, matchPwd]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL, JSON.stringify({
                username,
                email,
                password
            }));
            console.log(response.data);
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Bad Request: ' + (err.response.data.message || 'Invalid Input'));
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
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
                <Card className="flex justify-center items-center p-32"
                style={{boxShadow:'10px 10px 45px #d4d4d4, -10px -10px 45px #d4d4d4'}}>
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
            <div>
            <Header />
            <div className="flex justify-center m-20">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <Card className="w-auto flex justify-center items-center"
                style={{boxShadow:'10px 10px 45px #d4d4d4, -10px -10px 45px #d4d4d4'}}>
                    <CardContent>
                        <p className="p-5 flex justify-center">Sign Up</p>
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
                                    4 to 24 characters.<br/>
                                    Must begin with a letter.<br/>
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
                                    type="email"
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
                                    Must be a valid email address.<br/>
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
                                    type="password"
                                    placeholder="*********"
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                    aria-invalid={validPwd ? "false" : "true"}
                                    aria-describedby="pwdnote"
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                />
                                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                    6 to 24 characters.<br/>
                                    Must include uppercase and lowercase letters.<br/>
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
                                    type="password"
                                    placeholder="*********"
                                    id="confirm_pwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    required
                                    aria-invalid={validMatchPwd ? "false" : "true"}
                                    aria-describedby="confirmpwdnote"
                                    onFocus={() => setMatchPwdFocus(true)}
                                    onBlur={() => setMatchPwdFocus(false)}
                                />
                                <p id="confirmpwdnote" className={matchPwdFocus && !validMatchPwd ? "instructions" : "offscreen"}>
                                    Must match the password<br/>
                                </p>
                            </div>
                            <Button disabled={!validName || !validEmail || !validPwd || !validMatchPwd ? true : false}
                             type="submit" className="w-96" variant={"outline"}>Submit</Button>
                            <p className="text-xs">Already have an account?</p>
                            <Link href="/login_page">
                                <p className="text-xs hover:underline">Log In</p>
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
