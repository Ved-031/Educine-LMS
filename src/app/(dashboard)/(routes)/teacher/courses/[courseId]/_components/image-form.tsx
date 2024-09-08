"use client";

import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";


interface ImageFormProps {
    courseId: string;
    initialData: Course;
}

const FormSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required!",
    })
})

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const toogleEdit = () => setIsEditing(prev => !prev);

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            setIsEditing(false);
            toast.success("Image uploaded");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Course image
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
                        !isEditing && !initialData.imageUrl && (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add an image
                            </>
                        )
                    }
                    {
                        !isEditing && initialData.imageUrl && (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit image
                            </>
                        )
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    !initialData.imageUrl ? 
                        (
                            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-4">
                                <ImageIcon className="h-10 w-10 text-slate-500" />
                            </div>
                        )
                    :
                        (
                            <div className="relative aspect-video mt-2">
                                <Image 
                                    src={initialData.imageUrl}
                                    alt="Upload"
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        )
                )
            }
            {
                isEditing && (
                    <div>
                        <FileUpload 
                            endpoint="courseImage" 
                            onChange={(url) => {
                                if(url){
                                    onSubmit({ imageUrl: url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            16:9 aspect ratio recommended
                        </div>
                    </div>
                )
            }
        </div>
    )
}