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
        });

        if(!course){
            return new NextResponse("Not found!", { status: 404 });
        }

        const unPublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: false,
            },
        });

        return NextResponse.json(unPublishedCourse);
        
    } catch (error) {
        console.log("[COURSE_UNPUBLISH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}