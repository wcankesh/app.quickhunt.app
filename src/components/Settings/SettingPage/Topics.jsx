import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {useTheme} from "../../theme-provider";
import CategoriesSheet from "./CategoriesSheet";
import {Button} from "../../ui/button";
import {Check, Menu, Pencil, Plus, Trash2} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import {Input} from "../../ui/input";
import TopicsSheet from "./TopicsSheet";

const topics = [
    {
        label:"Welcome 👋",
        last_updated:"13 days ago",
        id:1
    },
    {
        label:"Improvement 👍",
        last_updated:"13 days ago",
        id:2
    },
    {
        label:"Styling 🎨",
        last_updated:"13 days ago",
        id:3
    },
    {
        label:"Integrations 🔗",
        last_updated:"13 days ago",
        id:4
    },
    {
        label:"Misc 🤷",
        last_updated:"13 days ago",
        id:5
    },
    {
        label:"Deal Breaker 💔",
        last_updated:"13 days ago",
        id:6
    },
    {
        label:"Bug 🐛",
        last_updated:"13 days ago",
        id:7
    },

]


const Topics = () => {
    const [isSheetOpen, setSheetOpen] = useState(false);
    const [isEdit,setIsEdit]=useState(null);
    const { theme } = useTheme();

    const onEditOption = (index) => { setIsEdit(index)}
    const updateRow = () =>{ setIsEdit(null); }


    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);
    return (
        <Card>
            <TopicsSheet isOpen={isSheetOpen} onOpen={openSheet} onClose={closeSheet} />
            <CardHeader className={"p-6 gap-1 border-b flex flex-row justify-between items-center"}>
                <div>
                    <CardTitle className={"text-2xl font-medium leading-8"}>Topics</CardTitle>
                    <CardDescription className={"text-sm text-muted-foreground p-0 mt-1 leading-5"}>Add Topics so that users can tag them when creating Ideas.</CardDescription>
                </div>
                <div className={"m-0"}>
                    <Button onClick={openSheet} className={"text-sm font-semibold"}><Plus size={16} className={"mr-1 text-[#f9fafb]"} />New Topics</Button>
                </div>
            </CardHeader>
            <CardContent className={"p-0"}>
                <Table>
                    <TableHeader className={"p-0"}>
                        <TableRow>
                            <TableHead className={"w-[50px]"}></TableHead>
                            <TableHead className={`pl-0 w-2/5 ${theme === "dark" ? "" : "text-card-foreground"}`}>Topic Name</TableHead>
                            <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Last Update</TableHead>
                            <TableHead className={`text-end pr-[39px] ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            (topics || []).map((x,index)=>{
                                return(
                                    <TableRow key={x.id}>
                                        <TableCell className={`${theme === "dark" ? "" : "text-muted-foreground"}`}><Menu className={"cursor-grab"} size={16} /></TableCell>
                                        { isEdit === index ? <TableCell className={"pl-0 py-[11px]"}>
                                                                <Input className={"w-full h-9"} value={x.label}/>
                                                             </TableCell>
                                            : <TableCell className={`font-medium text-xs pl-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                {x.label}
                                              </TableCell>
                                        }
                                        <TableCell className={`font-medium text-xs text-center ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.last_updated}</TableCell>
                                        <TableCell className={"flex justify-end "}>
                                            <div className="pr-0">
                                                { isEdit === index ? <Button onClick={updateRow} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] ${theme === "dark" ? "" : "text-muted-foreground"}`}><Check  size={16}/></Button>
                                                    : <Button onClick={() => onEditOption(index)} variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] ${theme === "dark" ? "" : "text-muted-foreground"}`}><Pencil size={16}/></Button>}
                                            </div>
                                            <div className="pl-2"><Button variant={"outline hover:bg-transparent"} className={`p-1 border w-[30px] h-[30px] ${theme === "dark" ? "" : "text-muted-foreground"}`}><Trash2 size={16} /></Button></div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default Topics;