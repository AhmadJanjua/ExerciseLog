import { useState, type Dispatch, type JSX, type SetStateAction } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

import { cn } from "@/lib/utils";

function OptionSelector(
    { name, setName, options }:
        {
            name: string, setName: Dispatch<SetStateAction<string>>
            options?: string[]
        }
): JSX.Element {
    function onSelect(name: string): void {
        setName(name);
        setOpen(false);
    }

    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" className="shrink-0">
                    Select
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-0" align="end">
                <Command>
                    <CommandInput placeholder="Search exercises…" />
                    <CommandEmpty>No entries found.</CommandEmpty>

                    <CommandGroup>
                        {options?.map((opt) => (
                            <CommandItem key={opt} value={opt} onSelect={onSelect}>
                                <Check className={
                                    cn("mr-2 h-4 w-4", opt === name ? "opacity-100" : "opacity-0")
                                }/>
                                {opt}
                            </CommandItem>
                        ))}
                    </CommandGroup>

                </Command>
            </PopoverContent>
        </Popover>
    );
}

export { OptionSelector };