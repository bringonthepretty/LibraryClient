"use client";
import {ExceptionType, LoginRequestType, LoginResponseType} from "@/app/types";
import Link from "next/link";

export default function Page() {
    
    async function login(formData: FormData) {
        const login = formData.get("login")?.toString()
        const password = formData.get("password")?.toString()
        const loginData: LoginRequestType = {login: login, password: password};
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Auth/login',
            {
                method: "POST",
                body: JSON.stringify(loginData),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include'
            }
        );
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            const responseJson: LoginResponseType = await response.json();
            localStorage.token = responseJson.token?.replaceAll("\"", "");  
            localStorage.id = responseJson.id;  
            localStorage.role = responseJson.role;
            window.location.href = "/home"
        }
    }

    return (
        <main>
            <div className="flex justify-center items-center">
                <div className="max-w-2xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-96 items-center">
                    <div className="col-span-1 items-center">
                        <h1 className="text-3xl">Welcome</h1>
                        <form action={login}>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Login</label>
                                    <input name="login" placeholder="login" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Password</label>
                                    <input name="password" placeholder="password" type="password" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div>
                                    <p className="inline">Don't have an account? </p>
                                    <Link className="inline cursor-pointer text-yellow-600" href="/auth/register">Register</Link>
                                </div>
                                <button
                                    className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100"
                                    type="submit">Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}