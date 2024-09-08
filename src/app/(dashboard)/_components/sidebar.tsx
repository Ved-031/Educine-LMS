"use client";

import { Logo } from "@/components/logo";
import { SidebarRoutes } from "./sidebar-routes";


export const Sidebar = () => {
    return ( 
        <div className="bg-white h-full border-r flex flex-col overflow-y-auto shadow-sm inset-y-0">
            <div className="p-6">
                <Logo />
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
     );
}
