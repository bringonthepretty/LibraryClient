"use client";
import {AuthorType, BookType, ExceptionType} from "@/app/types";
import {info} from "next/dist/build/output/log";
import React, {useEffect, useState} from "react";
import Link from "next/link";

export default function Page({params}: { params: { id: string } }) {

    const [author, setAuthor] = useState<AuthorType>({});
    
    useEffect(() => {
        async function fetchAuthor() {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/authors/' + params.id, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token"),
                    Accept: 'application/json',
                }
            })
            if (!response.ok) {
                const exception = (await response.json()) as ExceptionType;
                alert(`${exception.status} ${exception.title}: ${exception.detail}`)
                window.location.href = '/books'
            } else {
                setAuthor(await response.json() as AuthorType)
            }
        }

        fetchAuthor();
    }, []);
    async function editAuthor(formData: FormData) {
        const name = formData.get("name")?.toString()
        const surname = formData.get("surname")?.toString()
        const birthdate = formData.get("birthdate")?.toString()
        const country = formData.get("country")?.toString()
        const birthdateAsDate = new Date(birthdate!).toISOString().slice(0, 10);
        const authorData: AuthorType = {name: name, surname: surname, birthDate: birthdateAsDate, country: country};
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Authors/' + params.id,
            {
                method: "PUT",
                body: JSON.stringify(authorData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem("token"),
                    Accept: 'application/json',
                }
            }
        );
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            info('Author created')
            window.location.href = "/authors/" + ((await response.json()) as AuthorType).id;
        }
    }

    return (
        <main>
            <header className="w-full ml-40 mt-8">
                <div className="w-80 mt-8">
                    <Link
                        className="inline h-10 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                        href='/home'>Home</Link>
                    <Link
                        className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                        href='/auth/login'>Logout</Link>
                </div>
            </header>
            <div className="flex justify-center items-center">
                <div className="max-w-2xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-80 items-center">
                    <div className="col-span-1 items-center">
                        <h1 className="text-3xl">Edit author</h1>
                        <form action={editAuthor}>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Name</label>
                                    <input name="name" defaultValue={author.name} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Surname</label>
                                    <input name="surname" defaultValue={author.surname} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Country</label>
                                    <input name="country" defaultValue={author.country} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Birthdate</label>
                                    <input name="birthdate" defaultValue={author.birthDate} required={true} type="date"
                                           className="flex h-30 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <button
                                    className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100"
                                    type="submit">Edit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}