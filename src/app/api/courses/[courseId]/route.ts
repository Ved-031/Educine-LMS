import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

import { db } from "@/lib/db";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export const DELETE = async (req: Request, { params }: { params: { courseId: string }; }) => {
    try {
        const { userId } = auth();
        const { courseId } = params;

        console.log("[DELETE_COURSE]", "userId:", userId, "courseId:", courseId);

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
                    },
                },
            },
        });

        console.log("[DELETE_COURSE]", "course:", course);

        if(!course){
            return new NextResponse("Not found", { status: 404 });
        }

        if(course.chapters){
            for(const chapter of course.chapters){
                if(chapter.muxData?.assetsId){
                    console.log("[DELETE_COURSE]", "Deleting Mux asset:", chapter.muxData.assetsId);
                    await mux.video.assets.delete(chapter.muxData.assetsId);
                }
            }
        }

        console.log("[DELETE_COURSE]", "Deleting course:", courseId);
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
                userId,
            },
        });

        return new NextResponse("Course deleted");

    } catch (error: any) {
        console.error("[CHAPTER_DELETE]", error.message);
        console.error("[CHAPTER_DELETE]", error.stack);
        return new NextResponse("Internal server error", { status: 500 });
    }
}


export const PATCH = async (req: Request, { params }: { params: { courseId: string }; }) => {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.update({
            where: { 
                id: courseId,
                userId,
            },
            data: { 
                ...values,
            },
        });

        return NextResponse.json(course);

    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 });
    }
}