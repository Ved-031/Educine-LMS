import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const POST = async (
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
        const { title } = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        })

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 0;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition,
            }
        })

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}