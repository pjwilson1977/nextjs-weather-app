import React from "react";
import { FaSearchLocation } from "react-icons/fa";
import { cn } from "@/utils/cn";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLButtonElement> | undefined;
};

export default function Searchbox(props: Props) {   
    return (
        <form onSubmit={props.onSubmit} className={cn("flex relative items-center justify-center h-10",props.className)}>
            <input type="text" onChange={props.onChange} className="px-4 py-2 w-[200px] border border:gray-300 rounded-l-md focus:outline-none focus:border-blue-500 h-full" placeholder="Search..."/>
            <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none hover:bg-blue-500 whitespace-nowrap h-full">
                <FaSearchLocation className="" />
            </button>
        </form>
    );
}