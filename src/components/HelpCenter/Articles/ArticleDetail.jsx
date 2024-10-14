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
import Tiptap from "../../../Tiptap";

    const statusOptions = [
        { name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D" },
        { name: "Draft", value: 0, fillColor: "#CF1322", strokeColor: "#CF1322" },
    ];

    const initialState =
        {
            title: 'New Article',
            category_id: 1,
            category_title: "",
            sub_category_id: 1,
            sub_category_title: "",
            description: "",
            is_active: 1,
        }

    const initialStateError =
    {
        title: '',
        category_id: 1,
        category_title: "",
        sub_category_id: 1,
        sub_category_title: "",
        description: "",
        is_active: 1,
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
        if(id !== "new" && projectDetailsReducer.id){
            getSingleArticle();
        }
            getAllCategory();
    }, [projectDetailsReducer.id])

    const getAllCategory = async () => {
        setIsLoading(true);
        const data = await apiService.getAllCategory({
            project_id: projectDetailsReducer.id,
        });
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
                id: data.data.id,
                title: data.data.title,
                category_id: data.data.category_id,
                sub_category_id: data.data.sub_category_id,
                description: data.data.description,
                is_active: data.data.is_active,
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

    const onChangeText = (event) => {
        setArticlesDetails({...articlesDetails, [event.target.name]: event.target.value})
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

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

    const selectedCategory = articleList?.find((category) => category.id === Number(articlesDetails?.category_id));
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
        const selectedCategory = articleList.find(item => item.id === articlesDetails.category_id);
        let selectedSubCategory = null;
        if (selectedCategory && selectedCategory.sub_categories.length > 0) {
            selectedSubCategory = selectedCategory.sub_categories.find(sub => sub.id === articlesDetails.sub_category_id);
        }

        let formData = new FormData();
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', articlesDetails.category_id);
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
        setLoading(false)
    };

    const updateArticle = async () => {
        setLoading(true);
        const selectedCategory = articleList.find(item => item.id === Number(articlesDetails.category_id));
        let selectedSubCategory = null;
        if (selectedCategory && selectedCategory.sub_categories.length > 0) {
            selectedSubCategory = selectedCategory.sub_categories.find(sub => sub.id === Number(articlesDetails.sub_category_id));
        }
        let formData = new FormData();
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('category_id', articlesDetails.category_id);
        formData.append('sub_category_id', selectedSubCategory ? selectedSubCategory.id : null);
        formData.append('title', articlesDetails.title);
        formData.append('description', articlesDetails.description);
        formData.append('is_active', articlesDetails.is_active);
        const data = await apiService.updateArticle(formData, articlesDetails.id)
        if (data.status === 200) {
            setArticleList(articleList)
            toast({description: data.message,});
        } else {
            toast({description: data.message, variant: "destructive",});
        }
        setLoading(false)
    }

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
                        <Select value={articlesDetails.category_id} onValueChange={(value) => handleOnChange('category_id', value)}>
                            <SelectTrigger className="h-auto">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        articleList.length > 0 ?
                                            articleList.map((item) => (
                                                <SelectItem key={item.id} value={item.id}>
                                                    {item.title}
                                                </SelectItem>
                                            )) : (
                                                <SelectItem disabled>No Categories</SelectItem>
                                            )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Subcategory</Label>
                        <Select value={articlesDetails.sub_category_id} onValueChange={(value) => handleOnChange('sub_category_id', value)}>
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
                    <Select value={articlesDetails.is_active} onValueChange={(value) => handleOnChange('is_active', Number(value))}>
                        <SelectTrigger className={"w-[120px] h-auto py-[6px]"}>
                            <SelectValue placeholder={articlesDetails.is_active ? statusOptions.find(s => s.value == articlesDetails.is_active)?.name : "Publish"} />
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
                    <Button className={"w-[81px] py-[7px] font-medium h-8 hover:bg-primary"} onClick={articlesDetails.id ? updateArticle : handlePublish}>
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
                        <CardContent className={"p-6"}><Tiptap onChange={onChangeText} value={articlesDetails.description} name={"description"} /></CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default ArticleDetail;
