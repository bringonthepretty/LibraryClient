"use client";
import {BookType, ExceptionType} from "@/app/types";
import React, {useEffect, useState} from "react";
import Book from "@/components/Book";
import Popup from "reactjs-popup";
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
    
    async function borrow() {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/books/' + params.id + '/borrow', {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token"),
            }
        })
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            window.history.back()
        }
    }

    async function returnFunction() {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/books/' + params.id + '/return', {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token"),
            }
        })
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            window.history.back()
        }
    }

    async function deleteFunction() {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/books/' + params.id, {
            method: "DELETE",
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        })
        if (!response.ok) {
            const exception = (await response.json()) as ExceptionType;
            alert(`${exception.status} ${exception.title}: ${exception.detail}`)
        } else {
            window.history.back()
        }
    }
    
    const popupBody: any = (close: () => void) => {
        return (
            <div className="w-80 h-44 bg-yellow-50 rounded-md border flex flex-col justify-center items-center">
                <h1 className="flex">You are about to delete this book.</h1>
                <h1 className="flex">Are you sure?</h1>
                <div className="flex w-60">
                    <button onClick={deleteFunction}
                            className="inline h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Yes
                    </button>
                    <button onClick={() => close()}
                            className="inline h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">No
                    </button>
                </div>
            </div>
        )
    }

    const commandsBlock = (available: boolean | undefined) => {
        const editUrl = '/books/' + params.id + '/edit'

        if (localStorage.role == "admin") {
            if (available) {
                return <div className="mt-8">
                    <button onClick={() => window.location.href = editUrl}
                            className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Edit
                    </button>
                    <Popup modal={true} position="center center" trigger={<button className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Delete</button>}>
                        {popupBody}
                    </Popup>
                    <button onClick={borrow}
                            className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Borrow
                    </button>
                </div>
            } else {
                if (localStorage.id == book.borrowedByUserId) {
                    return <div className="mt-8">
                        <button onClick={() => window.location.href = editUrl}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Edit
                        </button>
                        <Popup modal={true} position="center center" trigger={<button className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Delete</button>}>
                            {popupBody}
                        </Popup>
                        <button onClick={returnFunction}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100 align-bottom">Return
                        </button>
                    </div>
                } else {
                    return <div className="mt-8">
                        <button onClick={() => window.location.href = editUrl}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Edit
                        </button>
                        <Popup modal={true} position="center center" trigger={<button className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Delete</button>}>
                            {popupBody}
                        </Popup>
                        <button disabled={true}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100 opacity-60">Borrow
                        </button>
                    </div>   
                }
            }
        } else {
            if (available) {
                return <div className="mt-8">
                    <button onClick={borrow}
                        className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Borrow
                    </button>
                </div>   
            } else {
                if (localStorage.id == book.borrowedByUserId) {
                    return <div className="mt-8">
                        <button onClick={returnFunction}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100 opacity-60">Borrow
                        </button>
                    </div>
                } else {
                    return <div className="mt-8">
                        <button disabled={true}
                                className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100 opacity-60">Borrow
                        </button>
                    </div>   
                }
            }
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
                <div className="max-w-6xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-80 items-center">
                    <div className="col-span-1 items-center">
                        <Book book={book!}></Book>
                    </div>
                    {commandsBlock(book.available)}
                </div>
            </div>
        </main>
    );
}