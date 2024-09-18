"use client";
import Link from "next/link";
import {ExceptionType, RegisterRequestType} from "@/app/types";
import {info} from "next/dist/build/output/log";

export default function Page() {
    
    async function register(formData: FormData) {
        const username = formData.get("username")?.toString()
        const login = formData.get("login")?.toString()
        const password = formData.get("password")?.toString()
        const registerData: RegisterRequestType = {username: username, login: login, password: password};
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Auth/register',
            {
                method: "POST",
                body: JSON.stringify(registerData),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                }
            }
        );
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            info('Account created')
            window.location.href = "/auth/login";
        }
    }
    
    return (
        <main>
            <div className="flex justify-center items-center">
                <div className="max-w-2xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-96 items-center">
                    <div className="col-span-1 items-center">
                        <h1 className="text-3xl">Register</h1>
                        <form action={register}>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Username</label>
                                    <input name="username" placeholder="username" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
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
                                    <p className="inline">Already have an account? </p>
                                    <Link className="inline cursor-pointer text-yellow-600"
                                          href="/auth/login">Login</Link>
                                </div>
                                <button
                                    className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100"
                                    type="submit">Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}