import React, { Fragment, useState } from 'react';
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent } from "../../ui/card";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import { X, Plus, Ellipsis, Loader2, CircleX } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetOverlay } from "../../ui/sheet";
import { Label } from "../../ui/label";
import moment from 'moment';
import {useToast} from "../../ui/use-toast";
import {useTheme} from "../../theme-provider";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../ui/dialog";
import ReactQuillEditor from "../../Comman/ReactQuillEditor";
import {Tooltip, TooltipProvider, TooltipTrigger} from "@radix-ui/react-tooltip";
import {TooltipContent} from "../../ui/tooltip";

const initialState = {
    title: "",
    description: "",
    articles: "",
    createdAt: moment().fromNow(),
    image: [],
};

const initialStateTable = [
    {
        title : "Get Started",
        data : [
            {
                title: "Setup account",
                description: "Sample Description",
                articles: "02",
                createdAt: moment().startOf('hour').fromNow(),
            }
        ]
    }
];

const Category = () => {
    const {theme} = useTheme();
    const {toast} = useToast()
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [categoryData, setCategoryData] = useState(initialState);
    const [isSave, setIsSave] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [tables, setTables] = useState(initialStateTable);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [type, setType] = useState('');
    const [editData, setEditData] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);

    const openSheet = (type, index = 0, data ) => {
        setType(type);
        setSelectedIndex(index);
        setEditData(data);
        setCategoryData(data || initialState);
        setSheetOpen(true);
    };

    const closeSheet = () => {
        setSheetOpen(false);
        setCategoryData(initialState);
    };

    const handleOnChange = (name, value) => {
        setCategoryData({ ...categoryData, [name]: value });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCategoryData({ ...categoryData, image: file });
        }
    };

    const handleSaveCategory = () => {
        setIsLoading(true)
        let clone = [...tables];
        if (type === 'cate') {
            if (editData) {
                let updatedTables = clone.map((x, i) => {
                    if (i === selectedIndex) {
                        return {
                            ...x,
                            title: categoryData.title,
                        };
                    }
                    return x;
                });
                setTables(updatedTables);
            } else {
                let newTable = {
                    title: categoryData.title || "New Table",
                    data: []
                };
                clone.push(newTable);
                setTables(clone);
            }
        } else if (type === 'sub') {
            if (selectedIndex >= 0 && selectedIndex < clone.length) {
                let updatedTable = { ...clone[selectedIndex] };
                if (editData) {
                    updatedTable.data = updatedTable.data.map((item) =>
                        item.title === editData.title ? { ...categoryData } : item
                    );
                } else {
                    updatedTable.data.push(categoryData);
                }
                clone[selectedIndex] = updatedTable;
                setTables(clone);
            } else {
                console.error("Invalid index for the table");
            }
        }
        closeSheet();
        setSelectedIndex(null)
        setIsLoading(false)
        toast({ description: 'Category saved successfully!' });
    };

    const deleteCustomer =  (index) => {
        setOpenDelete(true);
        setSelectedIndex(index)
    };

    const handleDelete = (type, index, data) => {
        setIsLoading(true);
        let clone = [...tables];
         if (type === 'sub') {
            let updatedTable = { ...clone[index] };
            updatedTable.data = updatedTable.data.filter(item => item.title !== data.title);
            clone[index] = updatedTable;
             toast({ description: 'Subcategory deleted successfully!' });
        } else {
             clone.splice(selectedIndex, 1);
             toast({ description: 'Category deleted successfully!' });
         }
        setTables(clone);
        setOpenDelete(false);
        setIsLoading(false);
    };

    return (
        <Fragment>
            {isSheetOpen && (
                <Sheet open={isSheetOpen} onOpenChange={isSheetOpen ? closeSheet : openSheet}>
                    <SheetOverlay className={"inset-0"} />
                    <SheetContent className={"sm:max-w-[662px] p-0"}>
                        <SheetHeader className={"px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b"}>
                            <h5 className={"text-sm md:text-xl font-medium"}>
                                {type === "cate"
                                    ? (editData ? "Update Category" : "Create New Category")
                                    : (editData ? "Update Subcategory" : "Create New Subcategory")}
                            </h5>
                            <X onClick={closeSheet} size={18} className={"cursor-pointer m-0"} />
                        </SheetHeader>
                        <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b space-y-6"}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="title">Category name</Label>
                                <Input
                                    value={categoryData.title}
                                    onChange={(e) => handleOnChange("title", e.target.value)}
                                    type="text"
                                    id="title"
                                    className={"h-9"}
                                    placeholder={"Enter the category name..."}
                                />
                            </div>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="description">Category description</Label>
                                <ReactQuillEditor
                                    value={categoryData.description}
                                    onChange={(e) => handleOnChange("description", e.target.value)}
                                />
                            </div>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                {categoryData.image && categoryData.image instanceof File ? (
                                    <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                        <img
                                            className={"upload-img"}
                                            src={URL.createObjectURL(categoryData.image)}
                                            alt="Uploaded icon"
                                            // onLoad={() => URL.revokeObjectURL(categoryData.image)}
                                        />
                                        <CircleX className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`} size={20} onClick={() => handleOnChange("image", null)} />
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            id="imageInput"
                                            type="file"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <label
                                            htmlFor="imageInput"
                                            className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                        >
                                            <h4 className="text-xs font-semibold">Upload Icon</h4>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={"px-3 py-4 sm:py-6 sm:px-8 space-x-4"}>
                            <Button
                                className={`border w-[127px] font-semibold ${isSave ? "justify-center items-center" : ""}`}
                                onClick={handleSaveCategory}
                            >
                                {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Category"}
                            </Button>
                            <Button
                                variant={"ghost hover:bg-none"}
                                onClick={closeSheet}
                                className={`border border-primary font-semibold`}
                            >
                                Cancel
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            )}
            <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

                {
                    openDelete &&
                    <Fragment>
                        <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                            <DialogContent className="w-[310px] md:w-full rounded-lg">
                                <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                    <div className={"flex flex-col gap-2"}>
                                        <DialogTitle className={"text-start"}>You really want delete this category ?</DialogTitle>
                                        <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                    </div>
                                    <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                                </DialogHeader>
                                <div className={"flex justify-end gap-2"}>
                                    <Button variant={"outline hover:none"}
                                            className={"text-sm font-semibold border"}
                                            onClick={() => setOpenDelete(false)}>Cancel</Button>
                                    <Button
                                        variant={"hover:bg-destructive"}
                                        className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[76px] text-sm font-semibold bg-destructive`}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </Fragment>
                }

                <div className={"space-y-6"}>
                    <h4 className={"font-medium text-lg sm:text-2xl"}>All Category</h4>
                    <div className={"flex justify-between"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className={"pl-4 pr-4 text-sm font-normal h-9 max-w-[352px] w-full"}
                        />
                        <Button
                            size="sm"
                            onClick={() => openSheet("cate")}
                            className={"gap-2 font-semibold hover:bg-primary"}
                        >
                            <Plus size={20} strokeWidth={3} />New Category
                        </Button>
                    </div>
                </div>

                {tables.map((x, i) => (
                    <div key={i} className={"mt-[34px]"}>
                        <Card className={""}>
                            <CardContent className={"p-0"}>
                                <div className={"rounded-md grid grid-cols-1 overflow-auto whitespace-nowrap"}>
                                    <Table>
                                        <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                            <TableRow className={""}>
                                                <TableHead className={`px-2 py-[10px] md:px-3 text-primary font-semibold w-[300px]`}>
                                                    {x.title}
                                                </TableHead>
                                                <TableHead className={`font-semibold px-2 py-[10px] md:px-3 w-[300px]`}>Description</TableHead>
                                                <TableHead className={`font-semibold px-2 py-[10px] md:px-3 w-[300px]`}>Articles</TableHead>
                                                <TableHead className={`font-semibold px-2 py-[10px] md:px-3 w-[300px]`}>Created at</TableHead>
                                                {/*<TableHead className={`font-semibold px-2 py-[10px] md:px-3 w-[300px] text-center`}>*/}
                                                <TableHead className={`font-semibold px-2 py-[10px] md:px-3 w-[300px]`}>
                                                    <div className={"space-x-2"}>
                                                        {/*<TooltipProvider>*/}
                                                        {/*    <Tooltip>*/}
                                                        {/*        <TooltipTrigger asChild>*/}
                                                        {/*            <Button*/}
                                                        {/*                variant="outline" size="icon"*/}
                                                        {/*                onClick={() => openSheet('sub',i)}*/}
                                                        {/*                className={"border border-primary font-normal text-primary w-7 h-7"}*/}
                                                        {/*            >*/}
                                                        {/*                <Plus size={16} />*/}
                                                        {/*            </Button>*/}
                                                        {/*        </TooltipTrigger>*/}
                                                        {/*        <TooltipContent>*/}
                                                        {/*            <p>Add Subcategory</p>*/}
                                                        {/*        </TooltipContent>*/}
                                                        {/*    </Tooltip>*/}
                                                        {/*</TooltipProvider>*/}
                                                        <Button
                                                            size={"sm"}
                                                            variant={"ghost hover:bg-none"}
                                                            onClick={() => openSheet('sub',i)}
                                                            className={"mr-3 border border-primary font-normal text-primary py-2 px-3"}
                                                        >
                                                            <Plus size={16} className={"mr-2"} /> Add Subcategory
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis size={16} />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheet('cate', i, x)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => deleteCustomer(i)}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {x.data.map((y, j) => (
                                                <TableRow key={j} className="">
                                                    <TableCell className={`inline-flex gap-2 md:gap-1 flex-wrap items-center px-2 py-[10px] md:px-3 w-[300px]`}>
                                                        <span className={"cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"}>{y.title}</span>
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                        <span className={"cate-ellipsis"} dangerouslySetInnerHTML={{ __html: y.description || "-" }}/>
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                        {y.articles ? y.articles : "00"}
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 w-[300px]"}>
                                                        {y.createdAt}
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 w-[300px] text-center"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis className={`font-medium`} size={18} />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => openSheet('sub', i,y)}>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem className={"cursor-pointer"} onClick={() => handleDelete('sub', i, y)}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default Category;
