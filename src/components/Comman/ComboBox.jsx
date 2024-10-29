import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { cn } from "../../lib/utils";
import {useState} from "react";

const ComboBox = ({ items, placeholder, onSelect, value, setValue,classNames,isSearchBar=true }) => {
    const [open,setOpen]=useState(false);
    const selectedItem = items.find((x) => x.value === value);
    const placeholderColor = selectedItem ? selectedItem.color : "";
    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`flex justify-between h-9 ${classNames}`}
                    >
                        <div className="flex items-center">
                            <div
                                className={`h-2 w-2 mr-2 rounded-full ${placeholder == "Publish" ? "bg-[#389E0D]" : placeholder == "Draft" ? "bg-[#CF1322]" : ""}`}
                                style={{ backgroundColor: placeholderColor }}
                            ></div>
                            {value
                                ? selectedItem?.label
                                : placeholder}
                        </div>
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        { isSearchBar && <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9"/>}
                        <CommandList>
                            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup>
                                    {items.map((item) => (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                onSelect(currentValue);
                                                setOpen(false);
                                            }}
                                        >
                                          <div className={`h-2 w-2 mr-2 rounded-full`} style={{ backgroundColor: item?.color }}></div>  {item.label}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    value === item.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default ComboBox;