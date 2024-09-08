"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import axios from "axios";
  
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface CourseActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const CourseActions = ({ disabled, courseId, isPublished }: CourseActionsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/courses/${courseId}`);

            toast.success("Course deleted");
            router.push(`/teacher/courses`);
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePublish = async () => {
        try {
            setIsLoading(true);

            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course unpublished");
            }else{
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course published");
                confetti.onOpen();
            }
            
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={handlePublish}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={handleDelete}>
                <Button
                    disabled={isLoading}
                    size="sm"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}