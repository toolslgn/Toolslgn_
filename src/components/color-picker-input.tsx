"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Pipette } from "lucide-react";
import { isValidHexColor, PRESET_COLORS } from "@/lib/brand-kit";

interface ColorPickerInputProps {
    value: string;
    onChange: (color: string) => void;
    label?: string;
}

export function ColorPickerInput({
    value,
    onChange,
    label = "Brand Color",
}: ColorPickerInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleColorChange = (newColor: string) => {
        onChange(newColor);
        setInputValue(newColor);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (isValidHexColor(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-2">
                {/* Color Swatch & Input */}
                <div className="relative flex-1">
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="#3B82F6"
                        className="pl-12"
                        maxLength={7}
                    />
                    <div
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded border-2 border-border cursor-pointer"
                        style={{ backgroundColor: isValidHexColor(value) ? value : "#000" }}
                        onClick={() => setOpen(true)}
                    />
                </div>

                {/* Color Picker Popover */}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Pipette className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="end">
                        <div className="space-y-3">
                            <HexColorPicker color={value} onChange={handleColorChange} />

                            {/* Preset Colors */}
                            <div>
                                <p className="text-xs font-medium mb-2">Presets</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {PRESET_COLORS.map((preset) => (
                                        <button
                                            key={preset.color}
                                            className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                                            style={{ backgroundColor: preset.color }}
                                            onClick={() => handleColorChange(preset.color)}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
