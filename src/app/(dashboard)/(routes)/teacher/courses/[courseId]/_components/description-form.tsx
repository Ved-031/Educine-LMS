"use client";

import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";


interface DescriptionFormProps {
    courseId: string;
    initialData: Course;
}

const FormSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required!",
    })
})

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const toogleEdit = () => setIsEditing(prev => !prev);

    const form = useForm<z.infer <typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: initialData?.description || ""
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            setIsEditing(false);
            toast.success("Course description updated!");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Course description
                <Button
                    variant="ghost"
                    onClick={toogleEdit}
                >
                    {
                        isEditing ?
                            <>
                                Cancel
                            </>
                        :
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit description
                            </>
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.description && "text-slate-500 italic"
                    )}>
                        {initialData.description || "No description"}
                    </p>
                )
            }
            {
                isEditing && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 mt-4"
                        >
                            <FormField 
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea 
                                                {...field}
                                                disabled={isSubmitting}
                                                placeholder="e.g  ' This course is about ... '"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button
                                    disabled={isSubmitting || !isValid}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}