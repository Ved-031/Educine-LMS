"use client";

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";


interface ChapterFormProps {
    initialData: Course & { chapters: Chapter[] };
    courseId: string;
}

const FormSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required!",
    })
})

export const ChaptersForm = ({ initialData, courseId }: ChapterFormProps) => {

    const router = useRouter();

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toogleCreating = () => {
        setIsCreating(prev => !prev);
    }

    const form = useForm<z.infer <typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values);
            toast.success("Chapter created");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            setIsCreating(false);
        }
    }

    const onReorder = async (updatedData: { id: string; position: number; }[]) => {
        try {
            setIsUpdating(true);

            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updatedData
            })
            toast.success("Chapters reordered");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsUpdating(false);
        }
    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
                </div>
            )}
            <div className="flex items-center justify-between font-medium">
                Course chapters
                <Button
                    variant="ghost"
                    onClick={toogleCreating}
                >
                    {
                        isCreating ?
                            <>
                                Cancel
                            </>
                        :
                            <>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Create chapter
                            </>
                    }
                </Button>
            </div>
            {
                !isCreating && (
                    <div className={cn(
                        "text-sm mt-2",
                        !initialData.chapters.length && "text-slate-500 italic"
                    )}>
                        {!initialData.chapters.length && "No chapters"}
                        <ChaptersList 
                            onEdit={onEdit}
                            onReorder={onReorder}
                            items={initialData.chapters || []}
                        />
                    </div>
                )
            }
            {
                !isCreating && (
                    <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the chapters
                    </p>
                )
            }
            {
                isCreating && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField 
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isSubmitting}
                                                placeholder="e.g  ' Introduction to the course '"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={isSubmitting || !isValid}
                                type="submit"
                            >
                                Create
                            </Button>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}