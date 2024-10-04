import React, {useState, Fragment, useEffect} from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../ui/breadcrumb";
import { baseUrl } from "../../../utils/constent";
import { Button } from "../../ui/button";
import { Circle, Loader2, Play, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import {ApiService} from "../../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";

    const statusOptions = [
        { name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D" },
        { name: "Draft", value: 2, fillColor: "#CF1322", strokeColor: "#CF1322" },
    ];
    const categoryOptions = [
        { name: "Category 1", value: 1 },
        { name: "Category 2", value: 2 },
    ];
    const subcategoryOptions = [
        { name: "Subcategory 1", value: 1 },
        { name: "Subcategory 2", value: 2 },
    ];

    const initialState =
        {
            title: 'New Article',
            category: 1,
            subcategory: 1,
            status: 1,
        }

    const initialStateError =
    {
        title: '',
        category: 1,
        subcategory: 1,
        status: 1,
    }

const ArticleDetail = () => {
    const apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {toast} = useToast();
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [articlesDetails, setArticlesDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [articleList, setArticleList] = useState([]);

    useEffect(() => {
        if(projectDetailsReducer.id){
            getAllCategory();
            getSingleArticle();
        }
    }, [projectDetailsReducer.id])

    const getAllCategory = async () => {
        setIsLoading(true);
        const data = await apiService.getAllCategory(projectDetailsReducer.id);
        if (data.status === 200) {
            setArticleList(data.data);
        }
        setIsLoading(false)
    };

    const getSingleArticle = async () => {
        setIsLoading(true);
        const data = await apiService.getSingleArticle(id);
        if (data.status === 200) {
            setArticlesDetails({
                ...initialState,
                title: data.data.title,
                category: data.data.category_id,
                subcategory: data.data.sub_category_id,
                status: data.data.status,
            });
        }
        setIsLoading(false)
    };

    const handleOnChange = (name, value) => {
        setArticlesDetails({ ...articlesDetails, [name]: value });
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const selectedCategory = articleList?.find((category) => category.id === Number(articlesDetails?.category));
    const subcategories = selectedCategory ? selectedCategory?.sub_categories : [];

    const handlePublish = async () => {
        let validationErrors = {};
        Object.keys(articlesDetails).forEach(name => {
            const error = formValidate(name, articlesDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setLoading(true);

        const selectedCategory = articleList.find(item => item.id === Number(articlesDetails.category));
        let selectedSubCategory = null;
        if (selectedCategory && selectedCategory.sub_categories.length > 0) {
            selectedSubCategory = selectedCategory.sub_categories.find(sub => sub.id === Number(articlesDetails.subcategory));
        }

        let formData = new FormData();
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', articlesDetails.category);
        formData.append('sub_category_id', selectedSubCategory ? selectedSubCategory.id : null);
        formData.append('title', articlesDetails.title);
        formData.append('description', articlesDetails.description);
        formData.append(`images`, articlesDetails.image);
        const data = await apiService.createArticles(formData);
        if(data.status === 200) {
            setArticlesDetails(initialState);
            navigate(`${baseUrl}/help/article`);
            toast({description: data.message,});
        } else {
            toast({description: data.message, variant: "destructive",})
        }
    };

    const renderSidebarItems = () => {
        return (
            <div>
                <div className={"border-b px-4 py-6 space-y-6"}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Title</Label>
                        <Input
                            name="title"
                            placeholder={"The Evolution of Urban Green Spaces: From Parks to Vertical Gardens"}
                            value={articlesDetails.title}
                            onChange={(e) => handleOnChange("title", e.target.value)}
                            className={"text-sm font-normal w-full h-auto"}
                            autoFocus
                        />
                        {
                            formError?.title && <span className="text-red-500 text-sm">{formError?.title}</span>
                        }
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Select Category</Label>
                        <Select value={articlesDetails.category} onValueChange={(value) => handleOnChange('category', value)}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {articleList.map((item) => (
                                        <SelectItem key={item.id} value={item.id}>
                                            {item.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Subcategory</Label>
                        <Select value={articlesDetails.subcategory} onValueChange={(value) => handleOnChange('subcategory', value)}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {subcategories.length > 0 ? (
                                        subcategories.map((subCategory) => (
                                            <SelectItem key={subCategory.id} value={subCategory.id}>
                                                {subCategory.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem disabled>No Subcategories</SelectItem>
                                    )}
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
                            <BreadcrumbLink onClick={() => navigate(`${baseUrl}/help/article`)}>
                                Create New Article
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbPage>{articlesDetails.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className={"flex gap-4 items-center"}>
                    <Select defaultValue={1} onValueChange={(value) => handleOnChange('status', Number(value))}>
                        <SelectTrigger className={"w-[106px] h-auto py-[6px]"}>
                            <SelectValue placeholder="Draft" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {statusOptions.map((x) => (
                                    <SelectItem key={x.value} value={x.value}>
                                        <div className={"flex items-center gap-2"}>
                                            <Circle fill={x.fillColor} stroke={x.strokeColor} className={`font-normal w-2 h-2`} />
                                            {x.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant={"ghost hover:bg-none"} className={"px-3 py-[6px] border font-normal h-auto"}><Play size={16} className={"mr-3"} /> Preview</Button>
                    <Button className={"w-[81px] py-[7px] font-medium h-8 hover:bg-primary"} onClick={handlePublish}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
                    </Button>
                    <Button variant={"ghost hover:bg-none"} className={"p-1 h-auto border"}><Trash2 size={16} /></Button>
                </div>
            </div>
            <div className={"flex h-[calc(100%_-_83px)] overflow-y-auto"}>
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
