import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const PATCH = async (
    req: Request,
    { params }: {
        params: {
            chapterId: string;
            courseId: string;
        }
    }
) => {
    try {
        const { userId } = auth();
        const { chapterId, courseId } = params;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: false,
            },
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
        });

        if(!publishedChaptersInCourse.length){

            await db.course.update({
                where: {
                    id: courseId,
                    userId,
                },
                data: {
                    isPublished: false,
                },
            });

        }

        return NextResponse.json(unPublishedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}