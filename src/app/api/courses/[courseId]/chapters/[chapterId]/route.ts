import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";


const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET
});

export const DELETE = async (
    req: Request,
    { params }: {
        params: {
            courseId: string;
            chapterId: string;
        }
    }
) => {
    try {
        const { userId } = auth();
        const { chapterId, courseId } = params;

        // Checking if the user is authenticated
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            }
        })

        // Checking if the user owns this course
        if(!ownCourse){
            return new NextResponse("Unauthorized", { status: 401 });
        };

        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId,
            },
        });

        // Checking if the chapter exists
        if(!chapter){
            return new NextResponse("Chapter not found", { status: 404 });
        };

        // If video is uploaded then clearing the mux data
        if(chapter.videoUrl){

            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId,
                },
            });

            if(existingMuxData){
                await mux.video.assets.delete(existingMuxData.assetsId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

        };

        // Deleting chapter from the database
        const deletedChapter = await db.chapter.delete({
            where: {
                id: chapterId,
                courseId,
            },
        });

        const publishedChaptersInCourse = db.chapter.findMany({
            where: {
                courseId,
                isPublished: true,
            },
        });

        if(!publishedChaptersInCourse){
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                },
            });
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}

export const PATCH = async (
    req: Request,
    { params }: {
        params: {
            courseId: string;
            chapterId: string;
        }
    }
) => {
    try {

        const { userId } = auth();
        const { chapterId, courseId } = params;
        const { isPublished, ...values } = await req.json();

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

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                ...values,
            },
        });

        if(values.videoUrl){

            const existingMuxData = await db.muxData.findUnique({
                where: {
                    chapterId,
                }
            });

            if(existingMuxData){
                await mux.video.assets.delete(existingMuxData.assetsId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                })
            };

            const asset = await mux.video.assets.create({
                input: [{ url: values.videoUrl || "" }],
                playback_policy: ["public"],
                test: false,
            });

            const muxData = await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetsId: asset.id,
                    playbackId: asset.playback_ids?.[0].id,
                }
            });

        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}