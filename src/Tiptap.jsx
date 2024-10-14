import React, {useState, Fragment, useEffect, useCallback} from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TaskList from '@tiptap/extension-task-list';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { Heading } from '@tiptap/extension-heading';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "./components/ui/dropdown-menu";
import {Button} from "./components/ui/button";
import {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider} from "./components/ui/tooltip";
import {Popover, PopoverContent, PopoverTrigger} from "./components/ui/popover";
import {AlignCenter, AlignJustify, AlignLeft, AlignRight, BoldIcon, ChevronDown, Clipboard, Columns2, Copy, EllipsisVertical, GripVertical, Heading1, Heading2, Heading3, Highlighter, ItalicIcon, List, ListOrdered, ListTodo, LucideImage, LucideLink, LucideTable, Minus, Palette, Pilcrow, Plus, Quote, RemoveFormatting, SquareDashedBottomCode, Trash2, UnderlineIcon} from "lucide-react";
import {DropdownMenuGroup} from "@radix-ui/react-dropdown-menu";
import {TaskItem} from "@tiptap/extension-task-item";
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline';
import ColorPicker from "./components/Comman/ColorPicker";
import {Label} from "./components/ui/label";
import {Switch} from "./components/ui/switch";

const extensions = [
    StarterKit,
    Table.configure({
        resizable: true,
    }),
    TableRow,
    TableCell,
    TableHeader,
    TextStyle,
    Color,
    TaskList,
    Image,
    Heading.configure({
        levels: [1, 2, 3],
    }),
    TaskItem.configure({
        nested: true,
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Underline,
]

const Tiptap = ({value, name, onChange}) => {

    const [linkUrl, setLinkUrl] = useState('');
    const [selectedHeading, setSelectedHeading] = useState('Medium');
    const [selectedIcon, setSelectedIcon] = useState(<Pilcrow size={16} />);

    const handleSelect = (icon) => {
        setSelectedIcon(icon);
    };

    const handleSelectHeading = (level, label) => {
        editor.chain().focus().toggleHeading({ level }).run();
        setSelectedHeading(label);
    };

    const editor = useEditor({
        extensions,
        // content: {value},
        content: value,
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            onChange({ target: { name, value: content } });
        },
    })

    const updateLink = useCallback(() => {
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }, [editor, linkUrl]);

    const addImage = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target.result;
                editor.chain().focus().setImage({ src: url }).run();
            };
            reader.readAsDataURL(file);
        }
    }, [editor]);

    if (!editor) {return null}

    const hideInput = !!editor;

    return (
        <div className={"flex items-center gap-3"}>

            {
                editor && (
                    <Fragment>
                    <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className="text-black inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800">
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Label className={"flex items-center gap-1"}>{selectedIcon}<ChevronDown size={10} /></Label>
                                </PopoverTrigger>
                                <PopoverContent className={"flex gap-0.5 flex-col p-1 items-center w-auto"}>
                                    <div className={"text-xs w-full p-1.5"}>Hierarchy</div>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.commands.setParagraph();
                                                handleSelect(<Pilcrow size={16} />);
                                            }}
                                            className={editor.isActive('paragraph',) ? 'is-active p-1.5 gap-2 justify-start text-sm font-medium w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 gap-2 justify-start text-sm font-medium w-full'}
                                    >
                                        <Pilcrow size={16} /><span>Paragraph</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleHeading({level: 1}).run();
                                                handleSelect(<Heading1 size={16} />);
                                            }}
                                            className={editor.isActive('heading', { level: 1 }) ? 'is-active gap-2 p-1.5 justify-start w-full hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full'}
                                    >
                                        <Heading1 size={16} />
                                        <span>Heading 1</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleHeading({level: 2}).run();
                                                handleSelect(<Heading2 size={16} />);
                                            }}
                                            className={editor.isActive('heading', { level: 2 }) ? 'is-active gap-2 p-1.5 justify-start w-full hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full'}
                                    >
                                        <Heading2 size={16} />
                                        <span>Heading 2</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleHeading({level: 3}).run();
                                                handleSelect(<Heading3 size={16} />);
                                            }}
                                            className={editor.isActive('heading', { level: 3 }) ? 'is-active gap-2 p-1.5 justify-start w-full hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full'}
                                    >
                                        <Heading3 size={16} />
                                        <span>Heading 3</span>
                                    </Button>
                                    <div className={"text-xs w-full p-1.5"}>Lists</div>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleBulletList().run();
                                                handleSelect(<List size={16} />);
                                            }}
                                            className={editor.isActive('bulletList') ? 'is-active gap-2 p-1.5 justify-start w-full hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full'}
                                    >
                                        <List size={16} />
                                        <span>Bullet List</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleOrderedList().run();
                                                handleSelect(<ListOrdered size={16} />);
                                            }}
                                            className={editor.isActive('orderedList') ? 'is-active gap-2 p-1.5 justify-start w-full hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full'}
                                    >
                                        <ListOrdered size={16} />
                                        <span>Numbered List</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => {
                                                editor.chain().focus().toggleTaskList().run();
                                                handleSelect(<ListTodo size={16} />);
                                            }}
                                            className={editor.isActive('taskList') ? 'is-active gap-2 p-1.5 justify-start w-full h-8 hover:bg-neutral-100 bg-neutral-100' : 'gap-2 p-1.5 justify-start w-full h-8'}
                                    >
                                        <ListTodo size={16} />
                                        <span>Todo List</span>
                                    </Button>
                                </PopoverContent>
                            </Popover>
                            </Button>
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Label className={"flex items-center gap-1"}>{selectedHeading} <ChevronDown size={10} /></Label>
                                </PopoverTrigger>
                                <PopoverContent className={"flex gap-0.5 flex-col p-1 items-center w-auto"}>
                                    <Button variant={"ghost"}
                                            onClick={() => handleSelectHeading(5, 'Smaller')}
                                            className={editor.isActive('heading', { level: 5 }) ? 'is-active p-1.5 justify-start text-sm font-medium w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 justify-start text-sm font-medium w-full'}
                                    >
                                        <span className={"text-[12px]"}>Smaller</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => handleSelectHeading(4, 'Small')}
                                            className={editor.isActive('heading', { level: 4 }) ? 'is-active p-1.5 justify-start text-sm font-medium text-left w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 justify-start text-sm font-medium text-left w-full'}
                                    >
                                        <span className={"text-[14px]"}>Small</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => handleSelectHeading(3, 'Medium')}
                                            className={editor.isActive('heading', { level: 3 }) ? 'is-active p-1.5 justify-start text-sm font-medium text-left w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 justify-start text-sm font-medium text-left w-full'}
                                    >
                                        <span>Medium</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => handleSelectHeading(2, 'Large')}
                                            className={editor.isActive('heading', { level: 2 }) ? 'is-active p-1.5 justify-start text-sm font-medium text-left w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 justify-start text-sm font-medium text-left w-full'}
                                    >
                                        <span className={"text-[18px]"}>Large</span>
                                    </Button>
                                    <Button variant={"ghost"}
                                            onClick={() => handleSelectHeading(1, 'Extra Large')}
                                            className={editor.isActive('heading', { level: 1 }) ? 'is-active p-1.5 justify-start text-sm font-medium text-left w-full rounded hover:bg-neutral-100 bg-neutral-100' : 'p-1.5 justify-start text-sm font-medium text-left w-full'}
                                    >
                                        <span className={"text-[24px]"}>Extra Large</span>
                                    </Button>
                                </PopoverContent>
                            </Popover>
                            </Button>
                            <div className="bg-neutral-200 dark:bg-neutral-800 h-full min-h-[1.5rem] w-[1px] mx-1 first:ml-0 last:mr-0"/>
                            <Button
                                variant="ghost"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={editor.isActive('bold') ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><BoldIcon size={16} /></TooltipTrigger>
                                        <TooltipContent className={"p-[6px] text-xs"}>
                                            <p>Bold</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={editor.isActive('italic') ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><ItalicIcon size={16} /></TooltipTrigger>
                                        <TooltipContent className={"p-[6px] text-xs"}>
                                            <p>Italic</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={editor.isActive('underline') ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><UnderlineIcon size={16} /></TooltipTrigger>
                                        <TooltipContent className={"p-[6px] text-xs"}>
                                            <p>Underline</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={editor.isActive('codeBlock') ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                            >
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger><SquareDashedBottomCode size={16} /></TooltipTrigger>
                                        <TooltipContent className={"p-[6px] text-xs"}>
                                            <p>Code Block</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Button>
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <LucideLink size={16} />
                                </PopoverTrigger>
                                <PopoverContent className={"p-0"}>
                                    <div className={"p-2"}>
                                    <div className={"flex items-center gap-2"}>
                                        <Label className={"flex items-center gap-2 p-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-text"}>
                                            <LucideLink size={16} />
                                            <input
                                                type="text"
                                                placeholder="Enter URL"
                                                value={linkUrl}
                                                onChange={(e) => setLinkUrl(e.target.value)}
                                                className="border rounded-md p-1 w-full outline-none h-"
                                            />
                                        </Label>
                                        <Button onClick={updateLink} className={"py-1 px-2 h-auto hover:bg-primary"}>Set Link</Button>
                                    </div>
                                        <div className={"mt-3 flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400"}>
                                            <Label htmlFor={"open-link"}>Open in new tab</Label>
                                            <Switch id="open-link" className={"announce-create-switch h-auto w-[38px]"} />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            </Button>
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Highlighter size={16} />
                                </PopoverTrigger>
                                <PopoverContent className={"p-0 w-auto border-0"}>
                                    <input type={"color"} onChange={() => editor.chain().focus().toggleHighlight().run()}/>
                                </PopoverContent>
                            </Popover>
                            </Button>
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Palette size={16} />
                                </PopoverTrigger>
                                <PopoverContent className={"p-0 w-auto border-0"}>
                                    <ColorPicker onChange={event => editor.chain().focus().setColor(event.target.value).run()} value={editor.getAttributes('textStyle').color} hideInput={hideInput}
                                    />
                                </PopoverContent>
                            </Popover>
                            </Button>
                            <Button variant="ghost" className={"h-8 gap-1 min-w-[2rem] px-2 w-auto py-0"}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <EllipsisVertical size={16} />
                                </PopoverTrigger>
                                <PopoverContent className={"p-0 w-auto border-0"}>
                                    <div className={"text-black inline-flex h-full leading-none gap-0.5 flex-row p-1 items-center bg-white rounded-lg dark:bg-black shadow-sm border border-neutral-200 dark:border-neutral-800"}>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                            className={editor.isActive({ textAlign: 'left' }) ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                                        >
                                            <AlignLeft size={16} />
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                            className={editor.isActive({ textAlign: 'center' }) ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                                        >
                                            <AlignCenter size={16} />
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                            className={editor.isActive({ textAlign: 'right' }) ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                                        >
                                            <AlignRight size={16} />
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                                            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active h-8 gap-1 min-w-[2rem] px-2 w-auto py-0' : 'h-8 gap-1 min-w-[2rem] px-2 w-auto py-0'}
                                        >
                                            <AlignJustify size={16} />
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            </Button>
                        </div>
                    </BubbleMenu>
                    </Fragment>
                )
            }

            <div className={"flex items-center gap-0.5"}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild type={"button"}>
                        <Button variant={"ghost hover:none"} className={"min-w-[1rem] p-1 w-auto h-7"}>
                            <Plus size={16} strokeWidth={3}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <div className={"text-xs px-[8px] py-[6px]"}>Format</div>
                            <DropdownMenuItem
                                onClick={() => {editor.chain().focus().toggleHeading({level: 1}).run();}}
                                className={editor.isActive('heading', { level: 1 }) ? 'is-active gap-3' : 'gap-3'}
                            >
                                <Heading1 size={18} />
                                    <span>Heading 1</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {editor.chain().focus().toggleHeading({level: 2}).run();}}
                                className={editor.isActive('heading', { level: 2 }) ? 'is-active gap-3' : 'gap-3'}
                            >
                                <Heading2 size={18} />
                                    <span>Heading 2</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {editor.chain().focus().toggleHeading({level: 3}).run();}}
                                className={editor.isActive('heading', { level: 3 }) ? 'is-active gap-3' : 'gap-3'}
                            >
                                <Heading3 size={18} />
                                <span>Heading 3</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={editor.isActive('bulletList') ? 'is-active gap-3' : 'gap-3'}
                            >
                                <List size={18} />
                                <span>Bullet List</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                className={editor.isActive('orderedList') ? 'is-active gap-3' : 'gap-3'}
                            >
                                <ListOrdered size={18} />
                                <span>Numbered List</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().toggleTaskList().run()}
                                className={editor.isActive('taskList') ? 'is-active gap-3' : 'gap-3'}
                            >
                                <ListTodo size={18} />
                                <span>Task List</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                className={editor.isActive('blockquote') ? 'is-active gap-3' : 'gap-3'}
                            >
                                <Quote size={18} />
                                <span>Blockquote</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                className={editor.isActive('codeBlock') ? 'is-active gap-3' : 'gap-3'}
                            >
                                <SquareDashedBottomCode size={18} />
                                <span>Code Block</span>
                            </DropdownMenuItem>
                            <div className={"text-xs px-[8px] py-[6px]"}>Insert</div>
                            <DropdownMenuItem
                                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                                className={"gap-3"}
                            >
                                <LucideTable size={18} />
                                <span>Table</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={addImage} className={"gap-3"}>
                                <LucideImage size={18} />
                                <span>Set image</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} className={"gap-3"}>
                                <Columns2 size={18} />
                                <span>Columns</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()} className={"gap-3"}>
                                <Minus size={18} />
                                <span>Horizontal Rule</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild type={"button"}>
                        <Button variant={"ghost hover:none"} className={"min-w-[1rem] p-1 w-auto h-7"}>
                            <GripVertical size={16} strokeWidth={3} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className={"gap-3"}>
                                <RemoveFormatting size={18} />
                                <span>Clear Formatting</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className={"gap-3"}>
                                <Clipboard size={18} />
                                <span>Copy to Clipboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className={"gap-3"}>
                                <Copy size={18} />
                                <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={"gap-3"}>
                                <Trash2 size={18} />
                                <span>Delete</span>
                                {/*<Button onClick={() => editor.chain().focus().deleteSelection().run()}>*/}
                                {/*    <Trash2 size={16} /> Delete Content*/}
                                {/*</Button>*/}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <EditorContent className={"tiptap-editor w-full"} editor={editor} />
        </div>
    )
};

export default Tiptap;