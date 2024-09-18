"use client";

import {AuthorType, LoginResponseType} from "@/app/types";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import AuthorListEntry from "@/components/AuthorListEntry";
import Pagination from "@components/Pagination";
import {useSearchParams} from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams()
    const [authorList, setAuthorList] = useState<AuthorType[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(searchParams.get("page") !== null ? +(searchParams.get("page")!) : 1);
    const [limit, setLimit] = useState<number>(searchParams.get("limit") !== null ? +(searchParams.get("limit")!) : 10);
    const [maxPage, setMaxPage] = useState<number>(1);
    
    useEffect(() => {
        fetchBookList(generateServerUrlFromClientUrl());
        fetchMaxPages(generateServerUrlForMaxPageFromClientUrl())
    }, []);

    function generateServerUrlFromClientUrl() {
        let url: string;
        url = process.env.NEXT_PUBLIC_BASE_URL + '/authors?page=' + currentPage + '&limit=' + limit
        return url
    }

    function generateServerUrlForMaxPageFromClientUrl() {
        let url: string;
        url = process.env.NEXT_PUBLIC_BASE_URL + '/authors/pagescount?limit=' + limit

        return url
    }

    async function fetchBookList(url: string) {
        const response = await fetch(url, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token"),
            }
        })
        if (response.ok) {
            setAuthorList(await response.json() as AuthorType[])
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
                    console.log("regenerate fail")
                    window.location.href = '/auth/login'
                }
            }
        }
    }
    
    async function fetchMaxPages(url: string) {
        const response = await fetch(url, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token"),
            }
        })
        if (response.ok) {
            setMaxPage(+(await response.text()));
        }
    }

    async function onPageChanged(page: number): Promise<any> {
        let currentUrl = window.location.href
        let currentPage = searchParams.get("page") !== null ? searchParams.get("page") : "1"
        window.location.href = currentUrl.replaceAll('page=' + currentPage, 'page=' + page)
    }

    const booksHtml = authorList.map(author => {
            const url = '/authors/' + author.id;
            return <div key={author.id} className="mt-8">
                <Link href={url}>{<AuthorListEntry author={author}></AuthorListEntry>}</Link>
            </div>
        }
    )

    return (
        <main>
            <header className="w-full ml-40 mt-8">
                <h1 className="text-3xl">Authors</h1>
                <div className="w-80 mt-8">
                    <Link
                        className="inline h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                        href='/home'>Home</Link>
                    <Link
                        className="inline ml-3 h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                        href='/books'>Browse books</Link>
                    <Link
                        className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                        href='/auth/login'>Logout</Link>
                </div>
            </header>
            <div className="max-w-7xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-8 ml-40 items-center">
                <div className="col-span-1 items-center">
                    <div className="flex flex-col gap-4 mt-14">
                        <ul>{booksHtml}</ul>
                    </div>
                </div>
            </div>
            <div className="fixed left-0 bottom-0 w-full">
                <Pagination currentPage={currentPage} maxPage={maxPage}
                            onPageChanged={(page: number) => onPageChanged(page)}/>
            </div>
        </main>
    );
}