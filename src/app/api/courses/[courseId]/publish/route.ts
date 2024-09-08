import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const PATCH = async (
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

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                },
            },
        });

        if(!course){
            return new NextResponse("Not found!", { status: 404 });
        }

        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

        if(!hasPublishedChapter){
            return new NextResponse("Course must have at least one published chapter.", { status: 400 });
        }

        if(!course.title || !course.description || !course.imageUrl || !course.categoryId){
            return new NextResponse("Missing required fields.", { status: 401 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: true,
            },
        })

        return NextResponse.json(publishedCourse);
        
    } catch (error) {
        console.log("[COURSE_PUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}