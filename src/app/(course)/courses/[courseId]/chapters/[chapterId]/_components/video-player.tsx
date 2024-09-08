"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Toast } from "react-hot-toast";
import MuxPlayer from "@mux/mux-player-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface VideoPlayerProps {
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    title: string;
    playbackId: string;
    isLocked: boolean;
    completeOnEnd: boolean;
}

export const VideoPlayer = ({
    courseId,
    chapterId,
    nextChapterId,
    title,
    playbackId,
    isLocked,
    completeOnEnd,
}: VideoPlayerProps) => {

    const [isReady, setIsReady] = useState(true);

    return (
        <div className="relative aspect-video">
            {
                isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                        <Lock className="h-8 w-8" />
                        <p className="text-sm">
                            This chapter is locked.
                        </p>
                    </div>
                )
            }
            {
                !isReady && !isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                        <Loader2 className="animate-spin h-8 w-8 text-secondary" />
                    </div>
                )
            }
            {
                !isLocked && (
                    <MuxPlayer 
                        title={title}
                        className={cn(
                            !isReady && "hidden",
                        )}
                        onCanPlay={() => setIsReady(true)}
                        onEnded={() => {}}
                        autoPlay
                        playbackId={playbackId}
                    />
                )   
            }
        </div>
    )
}