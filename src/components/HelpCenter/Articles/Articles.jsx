import React, {Fragment, useEffect, useState} from 'react';
import { Input } from "../../ui/input";
import { Select, SelectGroup, SelectValue, SelectLabel, SelectItem, SelectTrigger, SelectContent } from "../../ui/select";
import {Circle, Ellipsis, Plus} from "lucide-react";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Card, CardContent } from "../../ui/card";
import { useTheme } from "../../theme-provider";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import {useNavigate, useParams} from "react-router-dom";
import { baseUrl } from "../../../utils/constent";
import moment from "moment";

const Articles = () => {
    const { theme } = useTheme();
    const {id, type} = useParams()
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const handleCreateClick = () => {
        navigate(`${baseUrl}/help-center/articles/new`);
    };

    const handleDelete = () => {}

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className={"space-y-6"}>
                <h4 className={"font-medium text-lg sm:text-2xl"}>All Articles</h4>
                <div className={"flex justify-between items-center flex-wrap md:flex-nowrap gap-4"}>
                    <div className={"flex flex-wrap md:flex-nowrap gap-4"}>
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
                    <Button size="sm" onClick={handleCreateClick} className={"gap-2 font-semibold hover:bg-primary"}>
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
                                        <TableHead className={`font-semibold px-2 py-[10px] md:px-3`} key={i}>{x}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    articles.map((article, index) => (
                                        <TableRow key={index}>
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>{article.title}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>{article.category} / {article.subcategory}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>{article.status}</TableCell>
                                            {/*<TableCell>*/}
                                            {/*    <Select value={x.post_status}*/}
                                            {/*            onValueChange={(value) => handleStatusChange(x, value)}>*/}
                                            {/*        <SelectTrigger className="w-[137px] h-7">*/}
                                            {/*            <SelectValue*/}
                                            {/*                placeholder={x.post_status ? status.find(s => s.value === x.post_status)?.name : "Publish"}/>*/}
                                            {/*        </SelectTrigger>*/}
                                            {/*        <SelectContent>*/}
                                            {/*            <SelectGroup>*/}
                                            {/*                {*/}
                                            {/*                    (x.post_status === 2 ? status2 : status || []).map((x, i) => {*/}
                                            {/*                        return (*/}
                                            {/*                            <Fragment key={i}>*/}
                                            {/*                                <SelectItem value={x.value}*/}
                                            {/*                                            disabled={x.value === 2}>*/}
                                            {/*                                    <div*/}
                                            {/*                                        className={"flex items-center gap-2"}>*/}
                                            {/*                                        <Circle fill={x.fillColor}*/}
                                            {/*                                                stroke={x.strokeColor}*/}
                                            {/*                                                className={`font-medium w-2 h-2`}/>*/}
                                            {/*                                        {x.name}*/}
                                            {/*                                    </div>*/}
                                            {/*                                </SelectItem>*/}
                                            {/*                            </Fragment>*/}
                                            {/*                        )*/}
                                            {/*                    })*/}
                                            {/*                }*/}
                                            {/*            </SelectGroup>*/}
                                            {/*        </SelectContent>*/}
                                            {/*    </Select>*/}
                                            {/*</TableCell>*/}
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>{article.seen}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>{moment(article.createdAt).format('YYYY-MM-DD')}</TableCell>
                                            <TableCell className={"px-2 py-[10px] md:px-3 font-medium"}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Ellipsis size={16} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align={"end"}>
                                                        <DropdownMenuItem onClick={() => navigate(`${baseUrl}/help-center/articles/${id}/edit`)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete()}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
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
