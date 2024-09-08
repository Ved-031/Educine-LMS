"use client";

import * as z from "zod";
import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Pencil, PlusCircle, Video } from "lucide-react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Chapter, MuxData } from "@prisma/client";


interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string;
}

const FormSchema = z.object({
    videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const toogleEdit = () => setIsEditing(prev => !prev);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Video uploaded");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            toogleEdit();
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Chapter video
                <Button
                    variant="ghost"
                    onClick={toogleEdit}
                >
                    {
                        isEditing && (
                            <>
                                Cancel
                            </>
                        )
                    }
                    {
                        !isEditing && !initialData.videoUrl && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add a video
                            </>
                        )
                    }
                    {
                        !isEditing && initialData.videoUrl && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit video
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    !initialData.videoUrl ? 
                        (
                            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
                                <Video className="h-10 w-10 text-slate-500" />
                            </div>
                        )
                    :
                        (
                            <div className="relative aspect-video mt-2">
                                <MuxPlayer 
                                    playbackId={initialData.muxData?.playbackId || ""}
                                />
                            </div>
                        )
                )
            }
            {
                isEditing && (
                    <div>
                        <FileUpload 
                            endpoint="chapterVideo" 
                            onChange={(url) => {
                                if(url){
                                    onSubmit({ videoUrl: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Upload this chapter video
                        </div>
                    </div>
                )
            }
            {
                initialData.videoUrl && !isEditing && (
                    <div className="text-xs text-muted-foreground">
                        Videos can take few minutes to process. Refresh the page if video does not appear.
                    </div>
                )
            }
        </div>
    )
}