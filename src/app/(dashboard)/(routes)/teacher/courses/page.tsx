import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";


const CoursesPage = async () => {

    const { userId } = auth();

    if(!userId){
        return redirect('/');
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        }
    })

    return ( 
        <div className="container mx-auto p-6">
            <DataTable columns={columns} data={courses} />
        </div>
     );
}
 
export default CoursesPage;