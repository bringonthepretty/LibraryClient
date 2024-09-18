"use client";
import {BookType, ExceptionType} from "@/app/types";
import {info} from "next/dist/build/output/log";
import Link from "next/link";
import React from "react";

export default function Page() {

    async function createBook(formData: FormData) {
        const isbn = formData.get("isbn")?.toString()
        const name = formData.get("name")?.toString()
        const genre = formData.get("genre")?.toString()
        const description = formData.get("description")?.toString()
        const image = formData.get("image") as File
        const base64 = await getBase64(image);
        const authorId = formData.get("authorId")?.toString()
        const bookData: BookType = {isbn: isbn, name: name, genre: genre, description: description, image: base64, authorId: authorId};
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Books',
            {
                method: "POST",
                body: JSON.stringify(bookData),
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
            info('Book created')
            window.location.href = "/books/" + ((await response.json()) as BookType).id;
        }
    }

    async function getBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result as string)
            }
            reader.onerror = reject
        })
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
                        <h1 className="text-3xl">Create book</h1>
                        <form action={createBook}>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Name</label>
                                    <input name="name" placeholder="name" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">ISBN</label>
                                    <input name="isbn" placeholder="ISBN" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Genre</label>
                                    <input name="genre" placeholder="genre" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Description</label>
                                    <input name="description" placeholder="description" required={true}
                                           className="flex h-30 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Image</label>
                                    <input name="image" placeholder="image" type="file" required={true}
                                           accept="image/png, image/jpeg"
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">AuthorId</label>
                                    <input name="authorId" placeholder="authorId" required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <button
                                    className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100"
                                    type="submit">Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}