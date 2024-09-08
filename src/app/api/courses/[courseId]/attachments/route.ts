import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const POST = async (req: Request, { params }: { params: { courseId: string; } }) => {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: { 
                id: params.courseId, 
                userId: userId,
            }
        })
        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url: values.url,
                name: values.url.split('/').pop(),
                courseId
            },
        });

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[COURSE_ID_ATTACHMENTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}