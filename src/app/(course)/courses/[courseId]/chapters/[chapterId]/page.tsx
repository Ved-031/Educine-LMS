import { redirect } from "next/navigation";
import { File } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";


interface ChapterIdPageProps {
    params: {
        courseId: string;
        chapterId: string;
    }
}

const ChapterIdPage = async ({ params }: ChapterIdPageProps) => {

    const { userId } = auth();
    const { chapterId, courseId } = params;

    if(!userId){
        return redirect("/");
    }

    const { 
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({ userId, courseId, chapterId });

    if(!chapter || !course){
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    return ( 
        <div>
            {
                userProgress?.isCompleted && (
                    <Banner 
                        variant="success" 
                        label="You already completed this chapter." 
                    />
                )
            }
            {
                isLocked && (
                    <Banner 
                        variant="warning" 
                        label="You need to purchase this course to watch this chapter." 
                    />
                )
            }
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer
                        courseId={courseId}
                        chapterId={chapterId}
                        nextChapterId={nextChapter?.id}
                        title={chapter.title}
                        playbackId={muxData?.playbackId!}
                        isLocked={isLocked}
                        completeOnEnd={completeOnEnd}
                    />
                </div>
                <div className="">
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-2xl font-semibold mb-2">
                            {chapter.title}
                        </h2>
                        {
                            purchase ? 
                            (
                                <div>
                                    {/* // TODO: Add course progress button  */}
                                </div> 
                            )
                            : 
                            (
                                <CourseEnrollButton
                                    courseId={courseId}
                                    price={course.price!}
                                />
                            )
                        }
                    </div>
                    <Separator />
                    <div>
                        <Preview
                            value={chapter.description!}
                        />
                    </div>
                    {
                        !!attachments.length && (
                            <>
                                <Separator />
                                <div className="p-4">
                                    {
                                        attachments.map((attachment) => (
                                            <a 
                                                key={attachment.id}
                                                href={attachment.url}
                                                target="_blank"
                                                className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                            >
                                                <File className="h-4 w-4" />
                                                <p className="line-clamp-1">
                                                    {attachment.name}
                                                </p>
                                            </a>
                                        ))
                                    }
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
     );
}
 
export default ChapterIdPage;