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

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
            },
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId,
            },
        });

        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl){
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_PUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}