import {BookType} from "@/app/types";
import Image from "next/image";

export default function BookListEntry({book}: {book: BookType}) {
    
    let availableString: string;
    if (book.available) {
        availableString = "Borrow"
    } else {
        availableString = "Already borrowed"
    }
    return (
        <div className="flex justify-center">
            <div className="relative h-48 w-full">
                <Image className="object-contain" fill={true} src={book.image!} alt="Cover"></Image>
            </div>
            <div className="w-full md:grid-cols-2 gap-6 md:gap-12 items-center">
                <div className="inline col-span-1 items-center">
                    <h1 className="text-3xl">{book.name}</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="inline">
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">ISBN: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{book.isbn}</h1>
                            </div>
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">Genre: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{book.genre}</h1>
                            </div>
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">Status: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{availableString}</h1>
                            </div>
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">Author: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{book.author?.name} </h1>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{book.author?.surname}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:grid-cols-2 gap-6 md:gap-12 items-center">
                <label className="text-sm font-medium leading-none">Description: </label>
                <h1 className="flex fit h-32 w-full border rounded-md px-3 py-2 text-sm ring-offset-background">{book.description}</h1>
            </div>
        </div>
    )
}