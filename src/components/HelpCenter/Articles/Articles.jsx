import React, {Fragment, useEffect, useState} from 'react';
import { Input } from "../../ui/input";
import { Select, SelectGroup, SelectValue, SelectLabel, SelectItem, SelectTrigger, SelectContent } from "../../ui/select";
import {Circle, Ellipsis, Loader2, Plus, X} from "lucide-react";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent } from "../../ui/card";
import { useTheme } from "../../theme-provider";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import {useNavigate, useParams} from "react-router-dom";
import { baseUrl } from "../../../utils/constent";
import moment from "moment";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../../ui/dialog";

const initialState = {
    title: "abc",
    type: "",
    status: "",
    createdAt: moment().fromNow(),
};

const initialStateError = {
    title: "",
    description: "",
}

const status = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Draft", value: 4, fillColor: "#CF1322", strokeColor: "#CF1322",},
];
const status2 = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D",},
    {name: "Scheduled", value: 2, fillColor: "#63C8D9", strokeColor: "#63C8D9",},
    {name: "Draft", value: 4, fillColor: "#CF1322", strokeColor: "#CF1322",},
]

const Articles = () => {
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {theme} = useTheme();
    const {toast} = useToast();
    const {id} = useParams()
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [articlesData, setArticlesData] = useState(initialState);
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [idToDelete, setIdToDelete] = useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllArticles();
        }
    }, [projectDetailsReducer.id])

    const getAllArticles = async () => {
        setIsLoading(true);
        const data = await apiService.getAllArticles(projectDetailsReducer.id);
        if (data.status === 200) {
            setArticles(data.data);
        }
        setIsLoading(false)
    };

    const handleCreateClick = () => {
        navigate(`${baseUrl}/help/article/new`);
    };

    const onEdit = (record) => {
        navigate(`${baseUrl}/help/article/${record}`)
    }

    const deleteRow = (id) => {
        setIdToDelete(id);
        setOpenDelete(true);
    }

    const handleDelete = async () => {
        setIsLoadingDelete(true)
        const data = await apiService.deleteArticles(idToDelete)
        const clone = [...articles];
        const index = clone.findIndex((x) => x.id == idToDelete)
        if (data.status === 200) {
            if (index !== -1) {
                clone.splice(index, 1)
                setArticles(clone);
            }
            toast({description: data.message,})
        } else {
            toast({description: data.message, variant: "destructive"})
        }
        setIsLoadingDelete(false)
        setOpenDelete(false);
    }

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>

            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="w-[310px] md:w-full rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start font-medium"}>You really want delete this article ?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <div className={"flex justify-end gap-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-medium border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-card"} w-[76px] text-sm font-medium bg-destructive`}
                                    onClick={handleDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

                <div className={"flex justify-between items-center flex-wrap gap-3"}>
                    <h4 className={"font-normal text-lg sm:text-2xl"}>All Articles</h4>
                    <div className={"flex flex-wrap gap-3"}>
                        <div className={"flex flex-wrap md:flex-nowrap gap-3"}>
                        <Input
                            type="search"
                            placeholder="Search..."
                            className={"pl-4 pr-4 text-sm font-normal h-9 min-w-[352px] w-full"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
                            <SelectTrigger className={"min-w-[236px] w-full px-4 py-[7px] h-auto"}>
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categories</SelectLabel>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Category 1">Category 1</SelectItem>
                                    <SelectItem value="Category 2">Category 2</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                    <Button size="sm" onClick={handleCreateClick} className={"gap-2 font-medium hover:bg-primary"}>
                        <Plus size={20} strokeWidth={3} /> New Article
                    </Button>
                    </div>
                </div>
            <div className={"mt-6"}>
                <Card className={""}>
                    <CardContent className={"p-0"}>
                        <Table>
                            <TableHeader className={`${theme === "dark" ? "" : "bg-muted"} py-8 px-5`}>
                                <TableRow>
                                    {["Title", "Category / Subcategory", "Status", "Seen", "Created At", ""].map((x, i) => (
                                        <TableHead className={`font-medium text-card-foreground px-2 py-[10px] md:px-3`} key={i}>{x}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    isLoading ? (
                                        [...Array(10)].map((_, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    {
                                                        [...Array(6)].map((_, i) => {
                                                            return (
                                                                <TableCell
                                                                    className={"max-w-[373px] px-2 py-[10px] md:px-3"}>
                                                                    <Skeleton className={"rounded-md  w-full h-7"}/>
                                                                </TableCell>
                                                            )
                                                        })
                                                    }
                                                </TableRow>
                                            )
                                        })
                                    ) : articles.length > 0 ? <Fragment>
                                        {
                                            articles.map((x, index) => (
                                                <TableRow key={index}>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x?.category_title} / {x?.sub_category_title}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <Select value={x.post_status}
                                                                // onValueChange={(value) => handleStatusChange(x, value)}
                                                        >
                                                            <SelectTrigger className="w-[137px] h-7">
                                                                <SelectValue
                                                                    placeholder={x.post_status ? status.find(s => s.value === x.post_status)?.name : "Publish"}/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {
                                                                        (x.post_status === 2 ? status2 : status || []).map((x, i) => {
                                                                            return (
                                                                                <Fragment key={i}>
                                                                                    <SelectItem value={x.value}
                                                                                                disabled={x.value === 2}>
                                                                                        <div
                                                                                            className={"flex items-center gap-2"}>
                                                                                            <Circle fill={x.fillColor}
                                                                                                    stroke={x.strokeColor}
                                                                                                    className={`font-normal w-2 h-2`}/>
                                                                                            {x.name}
                                                                                        </div>
                                                                                    </SelectItem>
                                                                                </Fragment>
                                                                            )
                                                                        })
                                                                    }
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell
                                                        className={"px-2 py-[10px] md:px-3 font-normal"}>{x.view}</TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        {x?.updated_at ? moment.utc(x?.updated_at).local().startOf('seconds').fromNow() : "-"}
                                                    </TableCell>
                                                    <TableCell className={"px-2 py-[10px] md:px-3 font-normal"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Ellipsis size={16}/>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align={"end"}>
                                                                <DropdownMenuItem
                                                                    onClick={() => onEdit(x.id)}>Edit</DropdownMenuItem>
                                                                {/*<DropdownMenuItem onClick={() => onEdit(x.id, x)}>Edit</DropdownMenuItem>*/}
                                                                <DropdownMenuItem
                                                                    onClick={() => deleteRow(x.id)}>Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </Fragment> : <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyData/>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Articles;
