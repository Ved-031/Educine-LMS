import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


export const DELETE = async (
    req: Request, 
    { params }: { 
        params: { 
            courseId: string; 
            attachmentId: string 
        } 
    }
) => {
    try {

        const { userId } = auth();
        const { attachmentId, courseId } = params;

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

        const attachment = await db.attachment.delete({
            where: {
                id: attachmentId,
                courseId,
            },
        })

        return NextResponse.json(attachment);

    } catch (error) {
        console.log("[ATTACHMENT_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}