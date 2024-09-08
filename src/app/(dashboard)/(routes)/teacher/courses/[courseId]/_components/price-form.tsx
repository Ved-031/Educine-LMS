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
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";


interface PriceFormProps {
    courseId: string;
    initialData: Course;
}

const FormSchema = z.object({
    price: z.coerce.number(),
})

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {

    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const toogleEdit = () => setIsEditing(prev => !prev);

    const form = useForm<z.infer <typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            setIsEditing(false);
            toast.success("Price updated");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="flex items-center justify-between font-medium">
                Course price
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
                                Edit price
                            </>
                    }
                </Button>
            </div>
            {
                !isEditing && (
                    <p className={cn(
                        "text-sm mt-2",
                        !initialData.price && "text-slate-500 italic"
                    )}>
                        {initialData.price ? formatPrice(initialData.price) : "No price set"}
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
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isSubmitting}
                                                step="0.01"
                                                type="number"
                                                placeholder="Set a price for your course"
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