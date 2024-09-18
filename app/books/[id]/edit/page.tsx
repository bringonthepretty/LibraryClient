"use client";
import {BookType, ExceptionType} from "@/app/types";
import {info} from "next/dist/build/output/log";
import React, {useEffect, useState} from "react";
import Link from "next/link";

export default function Page({params}: { params: { id: string } }) {

    const [book, setBook] = useState<BookType>({});
    
    useEffect(() => {
        async function fetchBook() {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/books/' + params.id, {
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
                setBook(await response.json() as BookType)
            }
        }

        fetchBook();
    }, []);

    async function editBook(formData: FormData) {
        const isbn = formData.get("isbn")?.toString()
        const name = formData.get("name")?.toString()
        const genre = formData.get("genre")?.toString()
        const description = formData.get("description")?.toString()
        const imageFile = formData.get("image") as File
        let base64: string;
         
        if (imageFile.size > 0) {
            const image = formData.get("image") as File;
            base64 = await getBase64(image)
        } else {
            base64 = book.image!
        }
        const authorId = formData.get("authorId")?.toString()
        const bookData: BookType = {
            isbn: isbn, 
            name: name, 
            genre: genre, 
            description: description, 
            image: base64, 
            authorId: authorId, 
            available: book.available, 
            borrowedByUserId: book.borrowedByUserId,
            borrowTime: book.borrowTime
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Books/' + params.id,
            {
                method: "PUT",
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
            info('Book edited')
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
                        <h1 className="text-3xl">Edit book</h1>
                        <form action={editBook}>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Name</label>
                                    <input name="name" defaultValue={book.name} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">ISBN</label>
                                    <input name="isbn" defaultValue={book.isbn} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Genre</label>
                                    <input name="genre" defaultValue={book.genre} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Description</label>
                                    <input name="description" defaultValue={book.description} required={true}
                                           className="flex h-30 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Image. Defaults to
                                        previous</label>
                                    <input name="image" type="file" accept="image/png, image/jpeg"
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">AuthorId</label>
                                    <input name="authorId" defaultValue={book.authorId} required={true}
                                           className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground"/>
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