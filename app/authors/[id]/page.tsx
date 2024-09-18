"use client";
import React, {useEffect, useState} from "react";
import {AuthorType, ExceptionType} from "@/app/types";
import Author from "@/components/Author";
import Link from "next/link";
import Popup from "reactjs-popup";

export default function Page({ params }: { params: { id: string } }) {

    const [author, setAuthor] = useState<AuthorType>({name: "d", surname: "d"});
    
    useEffect(() => {
        async function fetchAuthor() {
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/authors/' + params.id, {
                method: "GET"
            })
            if (!response.ok) {
                const exception = (await response.json()) as ExceptionType;
                alert(`${exception.status} ${exception.title}: ${exception.detail}`)
                window.location.href = '/authors'
            } else {
                setAuthor(await response.json() as AuthorType)
            }
        }

        fetchAuthor();
    }, []);

    async function deleteFunction() {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/authors/' + params.id, {
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
                <h1 className="flex">You are about to delete this author.</h1>
                <h1 className="flex">All his books will be deleted as well.</h1>
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

    const commandsBlock = () => {
        const editUrl = '/books/' + params.id + '/edit'
        if (localStorage.role == "admin") {
            return <div className="mt-8">
                <button onClick={() => window.location.href = editUrl}
                        className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Edit
                </button>
                <Popup modal={true} position="center center" trigger={<button className="inline h-10 w-1/3 rounded-md border border-input px-3 py-2 text-sm ring-offset-backgroun bg-yellow-100">Delete</button>}>
                    {popupBody}
                </Popup>
            </div>
        } else {
            return <div></div>
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
                <div className="max-w-2xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-96 items-center">
                    <div className="col-span-1 items-center">
                        <Author author={author!}></Author>
                    </div>
                    {commandsBlock()}
                </div>
            </div>
        </main>
    );
}