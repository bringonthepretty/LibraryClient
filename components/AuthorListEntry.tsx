import {AuthorType} from "@/app/types";

export default function AuthorListEntry({author} : {author: AuthorType}) {
    return (
        <div className="flex justify-center">
            <div className="w-full md:grid-cols-2 gap-6 md:gap-12 items-center">
                <div className="inline col-span-1 items-center">
                    <h1 className="text-3xl">{author.name} {author.surname}</h1>
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="inline">
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">Birthdate: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{author.birthDate}</h1>
                            </div>
                            <div className="space-y-2">
                                <label className="inline text-sm font-medium leading-none">Country: </label>
                                <h1 className="inline h-10 w-full rounded-md py-2 text-sm ring-offset-background">{author.country}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}