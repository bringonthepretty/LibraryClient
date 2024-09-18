"use client";
import {BookType, LoginResponseType} from "@/app/types";
import React, {useEffect, useState} from "react";
import BookListEntry from "@/components/BookListEntry";
import {info} from "next/dist/build/output/log";
import Link from "next/link";

export default function Page() {

    const [bookList, setBookList] = useState<BookType[]>([]);

    async function fetchBookList() {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/home/books/', {
            method: "GET",
            credentials: 'include',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token"),
            }
        })
        if (response.ok) {
            setBookList(await response.json() as BookType[])
        } else {
            if (response.status == 401) {
                const regenerateTokenResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/Auth/regenerateTokens', {
                    method: "GET",
                    credentials: 'include',
                });
                if (regenerateTokenResponse.ok) {
                    console.log("regenerate success")
                    const responseJson: LoginResponseType = await regenerateTokenResponse.json();
                    localStorage.token = responseJson.token?.replaceAll("\"", "");
                    localStorage.id = responseJson.id;
                    localStorage.role = responseJson.role;
                    window.location.reload()
                } else {
                    console.log("regenerate wrong")
                    window.location.href = '/auth/login'
                }
            }
        }
    }
    
    
    
    useEffect(() => {
        console.log("use effect")
        fetchBookList();
        
    }, []);

    const booksHtml = bookList.map(book => {
            const url = '/books/' + book.id;
            return <div key={book.id} className="mt-8">
                <Link href={url}>{<BookListEntry book={book}></BookListEntry>}</Link>
            </div>
        }
    )
    
    const headerHtml = () => {
        if (localStorage.role == "admin") {
            return (
                <header className="ml-40 mt-8">
                    <h1 className="text-3xl">My books</h1>
                    <div className="w-full mt-8">
                        <Link
                            className="inline h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                            href='/books'>Browse library</Link>
                        <Link
                            className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                            href='/authors'>Browse authors</Link>
                        <Link
                            className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                            href='/books/create'>Add book</Link>
                        <Link
                            className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                            href='/authors/create'>Add author</Link>
                        <Link
                            className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                            href='/auth/login'>Logout</Link>
                    </div>
                </header>
            )
        } else {
            return (
                <header className="w-full ml-40 mt-8">
                    <h1 className="text-3xl">My books</h1>
                    <div className="w-80 mt-8">
                        <Link
                            className="inline h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                            href='/books'>Browse library</Link>
                        <Link
                            className="inline ml-3 h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                            href='/authors'>Browse authors</Link>
                    </div>
                </header>
            )
        }
    }

    return (
        <main>
            {headerHtml()}
            <div className="max-w-7xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-8 ml-8 items-center">
                <div className="col-span-1 items-center">
                    <div className="flex flex-col gap-4 mt-14">
                        <ul>{booksHtml}</ul>
                    </div>
                </div>
            </div>
        </main>
    );
}