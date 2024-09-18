import React, { useState, Fragment } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { baseUrl } from "../../../utils/constent";
import { Button } from "../../ui/button";
import { Circle, Loader2, Play, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";

const statusOptions = [
    { name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D" },
    { name: "Draft", value: 3, fillColor: "#CF1322", strokeColor: "#CF1322" },
];
const categoryOptions = [
    { name: "Category 1", value: "category1" },
    { name: "Category 2", value: "category2" },
];
const subcategoryOptions = [
    { name: "Subcategory 1", value: "subcategory1" },
    { name: "Subcategory 2", value: "subcategory2" },
];

const ArticleDetail = () => {
    const navigate = useNavigate();
    const { type, id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        subcategory: '',
        status: 3
    });

    const commonHandleChange = (name, value) => {
        setFormData({...formData, [name]: value});
    };

    const handlePublish = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        navigate(`${baseUrl}/help-center/articles`);
    };

    const renderSidebarItems = () => {
        return (
            <div>
                <div className={"border-b px-4 py-6 space-y-6"}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-medium"}>Title</Label>
                        <Input
                            name="title"
                            placeholder={"The Evolution of Urban Green Spaces: From Parks to Vertical Gardens"}
                            value={formData.title}
                            onChange={(e) => commonHandleChange("title", e.target.value)}
                            className={"text-sm font-medium w-full h-auto"}
                            autoFocus
                        />
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-medium"}>Select Category</Label>
                        <Select onValueChange={(value) => commonHandleChange('category', value)}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {categoryOptions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-medium"}>Subcategory</Label>
                        <Select onValueChange={(value) => commonHandleChange('subcategory', value)}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {subcategoryOptions.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Fragment>
            <div className={"py-6 px-4 border-b flex items-center justify-between"}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbLink onClick={() => navigate(`${baseUrl}/help-center/articles`)}>
                                Create New Article
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbPage>{formData.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className={"flex gap-4 items-center"}>
                    <Select onValueChange={(value) => commonHandleChange('status', Number(value))}>
                        <SelectTrigger className="w-[106px] h-auto">
                            <SelectValue placeholder="Draft" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {statusOptions.map((x) => (
                                    <SelectItem key={x.value} value={x.value}>
                                        <div className={"flex items-center gap-2"}>
                                            <Circle fill={x.fillColor} stroke={x.strokeColor} className={`font-medium w-2 h-2`} />
                                            {x.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant={"ghost hover:bg-none"} className={"px-3 py-[6px] border font-medium h-auto"}><Play size={16} className={"mr-3"} /> Preview</Button>
                    <Button className={"py-[6px] font-semibold h-auto hover:bg-primary"} onClick={handlePublish}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish"}
                    </Button>
                    <Button variant={"ghost hover:bg-none"} className={"p-1 h-auto border"}><Trash2 size={16} /></Button>
                </div>
            </div>
            <div className={"flex h-[calc(100%_-_85px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    {renderSidebarItems()}
                </div>
                <div className={"bg-muted w-full h-full hidden md:block overflow-y-auto"}>
                    <Card className={"m-8 mb-0"}>
                        <CardContent>abc</CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default ArticleDetail;
