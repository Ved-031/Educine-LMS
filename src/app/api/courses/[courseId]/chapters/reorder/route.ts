import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const PUT = async (
    req: Request, 
    { params }: {
        params: {
            courseId: string;
        }
    }
) => {
    try {

        const { userId } = auth();
        const { courseId } = params;
        const { list } = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for(let item of list){
            await db.chapter.update({
                where: {
                    id: item.id,
                    courseId,
                },
                data: {
                    position: item.position
                },
            });
        }

        return new NextResponse("success", { status: 200 });

    } catch (error) {
        console.log("[REORDER]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}