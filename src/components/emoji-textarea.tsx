"use client";

import { useState, useRef } from "react";
import { Smile } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface EmojiTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    maxLength?: number;
}

export function EmojiTextarea({
    value,
    onChange,
    placeholder,
    rows = 6,
    maxLength,
}: EmojiTextareaProps) {
    const [open, setOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const textAfterCursor = value.substring(cursorPosition);

        const newValue = textBeforeCursor + emojiData.emoji + textAfterCursor;
        onChange(newValue);

        // Set cursor position after emoji
        setTimeout(() => {
            textarea.focus();
            const newPosition = cursorPosition + emojiData.emoji.length;
            textarea.setSelectionRange(newPosition, newPosition);
        }, 0);

        setOpen(false);
    };

    return (
        <div className="relative">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className="resize-none pr-12"
            />

            {/* Emoji Picker Button */}
            <div className="absolute right-3 bottom-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                        >
                            <Smile className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto border-0" align="end">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
