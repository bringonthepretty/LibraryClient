"use client";

import {BookType, LoginResponseType} from "@/app/types";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import BookListEntry from "@/components/BookListEntry";
import {useSearchParams} from 'next/navigation'
import Pagination from "@components/Pagination";

export default function Page() {
    const searchParams = useSearchParams()
    const byName = searchParams.get("name")
    const byGenre = searchParams.get("genre")
    const byAuthor = searchParams.get("author")

    const [bookList, setBookList] = useState<BookType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(searchParams.get("page") !== null ? +(searchParams.get("page")!) : 1);
    const [limit, setLimit] = useState<number>(searchParams.get("limit") !== null ? +(searchParams.get("limit")!) : 10);
    const [maxPage, setMaxPage] = useState<number>(1);

    useEffect(() => {
        fetchBookList(generateServerUrlFromClientUrl());
        fetchMaxPage(generateServerUrlForMaxPageFromClientUrl())
    }, []);
    
    function generateServerUrlFromClientUrl() {
        let url: string;

        if (byName !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byName?page=' + currentPage + '&limit=' + limit + '&name=' + byName
        } else if (byGenre !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byGenre?page=' + currentPage + '&limit=' + limit + '&genre=' + byGenre
        } else if (byAuthor !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byAuthor?page=' + currentPage + '&limit=' + limit + '&authorId=' + byAuthor
        } else {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books?page=' + currentPage + '&limit=' + limit
        }
        
        return url
    }
    
    function generateServerUrlForMaxPageFromClientUrl() {
        let url: string;

        if (byName !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/pagescountbyname?limit=' + limit + '&name=' + byName
        } else if (byGenre !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/pagescountbygenre?limit=' + limit + '&genre=' + byGenre
        } else if (byAuthor !== null) {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/pagescountbyauthor?limit=' + limit + '&authorId=' + byAuthor
        } else {
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/pagescount?limit=' + limit
        }

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
                    console.log("regenerate fail")
                    window.location.href = '/auth/login'
                }
            }
        }
    }
    
    async function fetchMaxPage(url: string) {
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

    async function onNameSearchBoxChanged(value: string) {
        let clientUrl: string;
        let url: string;
        if (value.length > 0) {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit + '&name=' + value;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byName?page=' + currentPage + '&limit=' + limit + '&name=' + value;
        } else {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books?page=' + currentPage + '&limit=' + limit
        }

        window.history.pushState(null, "", clientUrl)
        fetchBookList(url)
    }

    async function onGenreSearchBoxChanged(value: string) {
        let clientUrl: string;
        let url: string;
        if (value.length > 0) {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit + '&genre=' + value;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byGenre?page=' + currentPage + '&limit=' + limit + '&genre=' + value;
        } else {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books?page=' + currentPage + '&limit=' + limit
        }

        window.history.pushState(null, "", clientUrl)
        fetchBookList(url)
    }

    async function onAuthorIdSearchBoxChanged(value: string) {
        let clientUrl: string;
        let url: string;
        if (value.length > 0) {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit + '&author=' + value;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books/byAuthor?page=' + currentPage + '&limit=' + limit + '&authorId=' + value;
        } else {
            clientUrl = '/books?page=' + currentPage + '&limit=' + limit;
            url = process.env.NEXT_PUBLIC_BASE_URL + '/books?page=' + currentPage + '&limit=' + limit
        }

        window.history.pushState(null, "", clientUrl)
        fetchBookList(url)
    }

    async function onPageChanged(page: number): Promise<any> {
        let currentUrl = window.location.href
        let currentPage = searchParams.get("page") !== null ? searchParams.get("page") : "1"
        if (currentPage?.includes("page=")) {
            window.location.href = currentUrl.replaceAll('page=' + currentPage, 'page=' + page)
        } 
        
    }

    const booksHtml = bookList.map(book => {
            const url = '/books/' + book.id;
            return <div key={book.id} className="mt-8">
                <Link href={url}>{<BookListEntry book={book}></BookListEntry>}</Link>
            </div>
        }
    )

    return (
        <main>
            <header className="w-full ml-40 mt-8">
                <h1 className="text-3xl">Library</h1>
                <div className="w-80 mt-8">
                    <Link
                        className="inline h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                        href='/home'>Home</Link>
                    <Link
                        className="inline ml-3 h-10 w-1/2 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:text-muted-foreground bg-yellow-100"
                        href='/authors'>Browse authors</Link>
                    <Link
                        className="inline ml-3 h-10 w-1/4 rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-yellow-100"
                        href='/auth/login'>Logout</Link>
                </div>
            </header>
            <div className="w-full ml-40 mt-8">
                <input className="inline rounded-md border border-input " placeholder='Search by name' defaultValue={byName!}
                       onChange={(event) => onNameSearchBoxChanged(event.target.value)}/>
                <input className="inline ml-3 rounded-md border border-input " placeholder='Search by genre' defaultValue={byGenre!}
                       onChange={(event) => onGenreSearchBoxChanged(event.target.value)}/>
                <input className="inline ml-3 rounded-md border border-input " placeholder='Search by author id :(' defaultValue={byAuthor!}
                       onChange={(event) => onAuthorIdSearchBoxChanged(event.target.value)}/>
            </div>
            <div className="max-w-7xl w-full md:grid-cols-2 gap-6 md:gap-12 mt-8 ml-8 items-center">
                <div className="col-span-1 items-center">
                    <div className="flex flex-col gap-4 mt-14">
                        <ul>{booksHtml}</ul>
                    </div>
                </div>
            </div>
            <div className="fixed left-0 bottom-0 w-full">
                <Pagination currentPage={currentPage} maxPage={maxPage} onPageChanged={(page: number) => onPageChanged(page)}/>
            </div>
        </main>
    );
}