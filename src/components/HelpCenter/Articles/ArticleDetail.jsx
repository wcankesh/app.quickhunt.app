import React, {Fragment, useEffect, useRef, useState} from 'react';
import {apiService, baseUrl, DO_SPACES_ENDPOINT, extractImageFilename, fileUploaderOnEditor} from "../../../utils/constent";
import {Button} from "../../ui/button";
import {Circle, Loader2, Play} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../../ui/select";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Card, CardHeader} from "../../ui/card";
import {useSelector} from "react-redux";
import {useToast} from "../../ui/use-toast";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Table from "@editorjs/table";
import Marker from "@editorjs/marker";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Image from "@editorjs/image";
import Quote from "@editorjs/quote";
import InlineCode from "@editorjs/inline-code";
import EditorJS from "@editorjs/editorjs";
import CommonBreadCrumb from "../../Comman/CommonBreadCrumb";
import {Skeleton} from "../../ui/skeleton";

const statusOptions = [
    {name: "Publish", value: 1, fillColor: "#389E0D", strokeColor: "#389E0D"},
    {name: "Draft", value: 0, fillColor: "#CF1322", strokeColor: "#CF1322"},
];

const initialState =
    {
        title: 'New Article',
        categoryId: null,
        subcategoryId: null,
        description: "",
        isActive: 1,
    }

const initialStateError =
    {
        title: '',
        categoryId: null,
        subcategoryId: null,
        description: "",
        isActive: 1,
    }

const ArticleDetail = () => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const {toast} = useToast();
    const navigate = useNavigate();
    const {id} = useParams();
    const editorCore = useRef(null);

    const [articlesDetails, setArticlesDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [articleList, setArticleList] = useState([]);
    const [load, setLoad] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadBreadCrumb, setIsLoadBreadCrumb] = useState(true);

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleArticle();
        }
        if (projectDetailsReducer.id) {
            getAllCategory();
        }
    }, [id, projectDetailsReducer.id])

    const getAllCategory = async () => {
        const data = await apiService.getAllCategory({
            projectId: projectDetailsReducer.id,
        });
        setIsLoading(false)
        if (data.success) {
            setArticleList(data.data?.rows);
        }
    };

    const getSingleArticle = async () => {
        const data = await apiService.getSingleArticle(id);
        if (data.success) {
            setArticlesDetails({
                ...initialState,
                id: data.data.id,
                title: data.data.title,
                categoryId: data.data.categoryId,
                subcategoryId: data.data.subcategoryId,
                description: data.data.description,
                isActive: data.data.isActive,
            });
        }
        setIsLoading(false)
        setIsLoadBreadCrumb(false)
    };

    const handleOnChange = (name, value) => {
        setArticlesDetails({...articlesDetails, [name]: value});
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
            case "categoryId":
                if (!value || value?.toString()?.trim() === "") {
                    return "Select a Category";
                } else {
                    return "";
                }
            case "subcategoryId":
                if (!value || value?.toString()?.trim() === "") {
                    return "Select a Sub Category";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const selectedCategory = articleList?.find((category) => category.id === Number(articlesDetails?.categoryId));
    const subcategories = selectedCategory ? selectedCategory?.subCategories : [];

    const handleArticle = async (type) => {
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

        const selectedCategory = articleList.find(item => item.id === Number(articlesDetails.categoryId));
        let selectedSubCategory = null;
        if (selectedCategory && selectedCategory.subCategories.length > 0) {
            selectedSubCategory = selectedCategory.subCategories.find(sub => sub.id === Number(articlesDetails.subcategoryId));
        }

        const cleanedBlocks = (articlesDetails.description?.blocks || []).map(block => {
            if (block.type === 'image' && block.data?.file?.url) {
                const fullUrl = block.data.file.url;
                return {
                    ...block,
                    data: {
                        ...block.data,
                        file: {
                            ...block.data.file,
                            url: extractImageFilename(fullUrl)
                        }
                    }
                };
            }
            return block;
        });

        setLoad(type);

        const payload = {
            projectId: projectDetailsReducer.id,
            categoryId: articlesDetails.categoryId,
            subcategoryId: selectedSubCategory ? selectedSubCategory.id : null,
            title: articlesDetails.title,
            description: {
                ...articlesDetails.description,
                blocks: cleanedBlocks
            },
            isActive: articlesDetails.isActive,
        };

        let data;
        if (type === 'update') {
            data = await apiService.updateArticle(payload, articlesDetails.id);
        } else {
            data = await apiService.createArticles(payload);
        }

        if (data?.success) {
            if (type === 'update') {
                setArticleList(articleList);
            } else {
                setArticlesDetails(initialState);
                navigate(`${baseUrl}/help/article`);
            }
            toast({description: data.message});
        } else {
            toast({description: data?.error?.message, variant: "destructive"});
        }
        setLoad('');
    };

    const handleSave = React.useCallback(async () => {
        const savedData = await editorCore.current.save();
        setArticlesDetails(prevState => ({
            ...prevState,
            description: {blocks: savedData.blocks}
        }));
    }, []);

    useEffect(() => {
        if (!isLoading) {
            let editorData = { blocks: [{ type: "paragraph", data: { text: "Hey" } }] };
            if (articlesDetails.description) {
                const parsedData = articlesDetails.description;
                if (parsedData && parsedData.blocks) {
                    editorData.blocks = parsedData.blocks.map(block => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            const filename = block.data.file.url;
                            return {
                                ...block,
                                data: {
                                    ...block.data,
                                    file: {
                                        ...block.data.file,
                                        url: `${DO_SPACES_ENDPOINT}/${filename}`
                                    }
                                }
                            };
                        }
                        return block;
                    });
                }
            }

            editorCore.current = new EditorJS({
                holder: 'editorjs',
                autofocus: true,
                tools: editorConstants,
                onChange: handleSave,
                data: {
                    time: new Date().getTime(),
                    blocks: editorData.blocks,
                    version: "2.12.4",
                },
                version: "2.12.4",
            });

            return () => {
                if (editorCore.current && typeof editorCore.current.destroy === 'function') {
                    editorCore.current.destroy();
                }
            };
        }
    }, [isLoading]);

    const editorConstants = {
        embed: Embed,
        header: {
            class: Header,
            inlineToolbar: true,
            config: {
                placeholder: 'Enter a header',
                levels: [2, 3, 4], // Available header levels
                defaultLevel: 2,   // Default level
            },
        },
        table: Table,
        marker: Marker,
        list: List,
        warning: Warning,
        code: Code,
        linkTool: LinkTool,
        image: {
            class: Image,
            inlineToolbar: true,
            config: {
                uploader: fileUploaderOnEditor({ uploadFolder: 'post', moduleName: 'article' }),
            },
            actions: [
                {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                               className="lucide lucide-trash-2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>,
                    title: 'Delete',
                    action: (block) => {
                        // handleImageDelete(editorCore, block.id);
                    },
                },
            ],
        },
        quote: Quote,
        inlineCode: InlineCode,
    }

    const renderSidebarItems = () => {
        return (
            <div>
                <div className={"border-b px-4 py-6 space-y-6"}>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Title</Label>
                        <Input
                            name="title"
                            placeholder={"Article title"}
                            value={articlesDetails.title}
                            onChange={(e) => handleOnChange("title", e.target.value)}
                            className={"text-sm font-normal w-full h-auto"}
                            autoFocus
                        />
                        {formError?.title && <span className="text-red-500 text-sm">{formError?.title}</span>}
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Select Category</Label>
                        <Select value={articlesDetails.categoryId}
                                onValueChange={(value) => handleOnChange('categoryId', value)}>
                            <SelectTrigger className="h-auto">
                                {/*{articlesDetails.categoryId ? (*/}
                                <SelectValue>
                                    {articleList?.find(item => item.id === articlesDetails.categoryId)?.title ||
                                    <span className="text-muted-foreground">Select Category</span>}
                                </SelectValue>
                                {/*) : (<span className="text-muted-foreground">Select Category</span>)}*/}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        articleList?.length > 0 ?
                                            articleList?.map((item, i) => (
                                                <SelectItem key={i} value={item.id} className={"cursor-pointer"}>
                                                    {item.title}
                                                </SelectItem>
                                            )) : (
                                                <SelectItem disabled className={"cursor-pointer"}>No Categories</SelectItem>
                                            )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {formError.categoryId && <span className="text-red-500 text-sm">{formError.categoryId}</span>}
                    </div>
                    <div className={"space-y-2"}>
                        <Label className={"text-sm font-normal"}>Select Sub Category</Label>
                        <Select value={articlesDetails.subcategoryId}
                                onValueChange={(value) => handleOnChange('subcategoryId', value)}>
                            <SelectTrigger className="h-auto">
                                {/*{articlesDetails.subcategoryId ? (*/}
                                <SelectValue>
                                    {subcategories.find(item => item.id === articlesDetails.subcategoryId)?.title ||
                                    <span className="text-muted-foreground">Select Sub Category</span>}
                                </SelectValue>
                                {/*) : (<span className="text-muted-foreground">Select Category</span>)}*/}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {subcategories.length > 0 ? (
                                        subcategories.map((subCategory, i) => (
                                            <SelectItem key={i} value={subCategory.id} className={"cursor-pointer"}>
                                                {subCategory.title}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem disabled className={"cursor-pointer"}>No Sub Category</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {formError.subcategoryId &&
                        <span className="text-red-500 text-sm">{formError.subcategoryId}</span>}
                    </div>
                </div>
            </div>
        );
    };

    const links = [{label: 'Article', path: `/help/article`}];

    return (
        <Fragment>
            <div className={"p-4 md:py-6 md:px-4 border-b flex items-center justify-between flex-wrap gap-2"}>
                <CommonBreadCrumb
                    links={[{label: 'Article', path: `/help/article`}]}
                    currentPage={(isLoading || isLoadBreadCrumb) && id !== "new" ? null : articlesDetails?.title}
                    truncateLimit={30}
                />
                <div className={"flex gap-4 items-center"}>
                    <Select value={articlesDetails.isActive}
                            onValueChange={(value) => handleOnChange('isActive', Number(value))}>
                        <SelectTrigger className={"w-[120px] h-auto py-[6px]"}>
                            <SelectValue
                                placeholder={articlesDetails.isActive ? statusOptions.find(s => s.value == articlesDetails.isActive)?.name : "Publish"}/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {statusOptions.map((x, i) => (
                                    <SelectItem key={i} value={x.value}>
                                        <div className={"flex items-center gap-2"}>
                                            <Circle fill={x.fillColor} stroke={x.strokeColor}
                                                    className={`font-normal w-2 h-2`}/>
                                            {x.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button variant={"ghost hover:bg-none"} className={"px-3 py-[6px] border font-normal h-auto"}><Play
                        size={16} className={"mr-3"}/> Preview</Button>
                    <Button className={"w-[81px] py-[7px] font-medium h-8 hover:bg-primary"}
                            onClick={() => articlesDetails.id ? handleArticle('update') : handleArticle('create')}>
                        {load ?
                            <Loader2 className="h-4 w-4 animate-spin"/> : (articlesDetails.id ? "Update" : "Create")}
                    </Button>
                </div>
            </div>
            <div className={"flex flex-wrap md:flex-nowrap h-[calc(100%_-_83px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    {renderSidebarItems()}
                </div>
                {/*<div className={"hidden md:block bg-muted w-full h-full px-16 flex flex-col gap-4 py-8 justify-start overflow-y-auto h-[calc(100%_-_94px)]"}>*/}
                <div
                    className={"bg-muted w-full p-4 md:px-16 md:py-8 flex flex-col md:gap-4 justify-start overflow-y-auto h-[calc(100vh_-_402px)] md:h-[calc(100vh_-_140px)]"}>
                    {/*<div className={"bg-muted w-full p-4 md:px-16 md:py-8 flex flex-col md:gap-4 justify-start overflow-y-auto h-[calc(100%_-_94px)]"}>*/}
                    {
                        (isLoading && id !== "new") ? <div className={"flex flex-col gap-4"}>
                            {
                                Array.from(Array(25)).map((_, r) => {
                                    return (
                                        <div key={r}>
                                            <Skeleton className="h-[10px] rounded-full bg-muted-foreground/20"/>
                                        </div>
                                    )
                                })
                            }
                        </div> : <Card className={`rounded-[10px] p-0 h-full overflow-auto`}>
                            <CardHeader className={"p-3 md:pt-0"}>
                                <div className={"md:pl-14 md:pt-6 m-0 w-full"}>
                                    <div id="editorjs"/>
                                </div>
                            </CardHeader>
                        </Card>
                    }

                </div>
            </div>
        </Fragment>
    );
};

export default ArticleDetail;
