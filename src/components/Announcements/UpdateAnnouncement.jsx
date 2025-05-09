import React, {useEffect, useState} from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Badge} from "../ui/badge";
import {BarChart, CalendarIcon, Check, Circle, CircleX, Loader2, Pin, Upload} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Button} from "../ui/button";
import moment from "moment";
import {Calendar} from "../ui/calendar";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useTheme} from "../theme-provider";
import {toast} from "../ui/use-toast";
import {apiService, baseUrl, DO_SPACES_ENDPOINT} from "../../utils/constent";
import {Checkbox} from "../ui/checkbox";
import {Card, CardContent, CardFooter} from "../ui/card";
import CommonBreadCrumb from "../Comman/CommonBreadCrumb";

const initialStateError = {
    title: "",
    description: "",
    slug: "",
    categoryId: "",
}

const UpdateAnnouncement = () => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    const { id } = useParams();
    const {theme} = useTheme();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);

    const [formError, setFormError] = useState(initialStateError);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [labelList, setLabelList] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [isLoad, setIsLoad] = useState('')
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverOpenExpired, setPopoverOpenExpired] = useState(false);
    const [oldSelectedAnnouncement, setOldSelectedAnnouncement] = useState({});

    useEffect(() => {
        if (projectDetailsReducer.id) {
            // if (selectedRecord?.slug) {
            //     getSinglePosts();
            // } else {
            //     setSelectedRecord({
            //         ...selectedRecord,
            //         assignToId: [userDetailsReducer.id.toString()],
            //     });
            // }
            getSinglePosts();
            setLabelList(allStatusAndTypes.labels);
            setMemberList(allStatusAndTypes.members);
            setCategoriesList(allStatusAndTypes.categories);
        }
    }, [projectDetailsReducer.id, allStatusAndTypes,])

    const getSinglePosts = async () => {
        const data = await apiService.getSinglePosts(id);
        if (data.success) {
            const obj = {
                ...data.data.data,
                image: data.data?.data?.featureImage,
                assignToId: data.data?.data?.assignToId?.toString() || '',
                publishedAt: data.data?.data?.publishedAt ? moment(data.data?.data?.publishedAt).format('YYYY-MM-DD') : moment(new Date()),
                expiredAt: data.data?.data?.expiredAt ? moment(data.data?.data?.expiredAt).format('YYYY-MM-DD') : undefined,
                categoryId: data.data?.data?.categoryId?.toString() || '',
                labels: data.data?.data?.labels || [],
            }
            setSelectedRecord(obj);
            setOldSelectedAnnouncement(obj);
        }
        // setPreviewImage(selectedRecord.featureImage);
    }

    const handleFileChange = (file) => {
        const selectedFile = file.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) { // 5 MB
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: 'Image size must be less than 5 MB.'
                }));
            } else {
                setFormError(prevErrors => ({
                    ...prevErrors,
                    image: ''
                }));
                setSelectedRecord({
                    ...selectedRecord,
                    image: selectedFile
                });
                // setPreviewImage(URL.createObjectURL(selectedFile));
            }
        }
    };

    const onDeleteImg = async (name, value) => {
        if (selectedRecord && selectedRecord?.image && selectedRecord?.image?.name) {
            setSelectedRecord({...selectedRecord, image: ""})
        } else {
            setSelectedRecord({...selectedRecord, [name]: value, image: ""})
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required.";
                } else {
                    return "";
                }
            // case "slug":
            //     if (!value || value.trim() === "") {
            //         return "Permalink / Slug is required.";
            //     } else {
            //         return "";
            //     }
            case "description":
                const cleanValue = value.trim();
                const emptyContent = /^(<p>\s*<\/p>|<p><br><\/p>|<\/?[^>]+>)*$/;
                if (!value || cleanValue === "" || emptyContent.test(cleanValue)) {
                    return "Description is required.";
                } else {
                    return "";
                }
            case "image":
                if (value && value.size > 5 * 1024 * 1024) { // 5 MB
                    return "Image size must be less than 5 MB.";
                } else {
                    return "";
                }
            case "categoryId":
                if (!value || value === "null") {
                    return "Category is required.";
                } else {
                    return "";
                }
            case "expiredAt":
                if (selectedRecord.expiredBoolean === 1 && (!value || value === undefined)) {
                    return "Please select an expiration date.";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        const {name, value} = event.target;
        let updatedDetails = {...selectedRecord};

        if (name === "title") {
            const trimmedValue = value.trimStart();
            const slug = trimmedValue
                .replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            updatedDetails = {
                ...updatedDetails,
                title: trimmedValue,
                ...(updatedDetails.slug === updatedDetails.title.replace(/[^a-z0-9\s]/gi, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase() && { slug: slug })
            };
        } else if (name === "slug") {
            const slug = value
                .replace(/[^a-z0-9\s-]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();
            updatedDetails = {
                ...updatedDetails,
                slug: slug
            };
        } else {
            updatedDetails[name] = value;
        }

        setSelectedRecord(updatedDetails);
        setFormError(prev => ({
            ...prev,
            [name]: formValidate(name, updatedDetails[name])
        }));
    };

    const onChangeTextqq = (event) => {
        const {name, value} = event.target;
        let updatedDetails = {...selectedRecord};
        if (name === "title") {
            const slug = value
                .replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            if (updatedDetails.title.replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase() === updatedDetails.slug) {
                updatedDetails = {
                    ...updatedDetails,
                    title: value,
                    slug: slug
                };
            } else {
                updatedDetails = {
                    ...updatedDetails,
                    title: value,
                };
            }

        } else if (name === "slug") {
            const slug = value
                .replace(/[^a-z0-9\s-]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            updatedDetails = {
                ...updatedDetails,
                slug: slug
            };
        } else {
            updatedDetails[name] = value;
        }
        setSelectedRecord(updatedDetails);
        setFormError((formError) => ({
            ...formError,
            [name]: formValidate(name, value)
        }));
    };

    const onChangeCategory = (selectedItems) => {
        const categoryId = selectedItems === null ? "" : selectedItems;
        setSelectedRecord({...selectedRecord, categoryId});
        setFormError((formError) => ({
            ...formError,
            categoryId: formValidate("categoryId", categoryId)
        }));
    }

    const commonToggle = (name, value) => {
        setSelectedRecord({...selectedRecord, [name]: value})
        if (name === "expiredBoolean") {
            setFormError((formError) => ({
                ...formError,
                expiredAt: formValidate("expiredAt", selectedRecord.expiredAt)
            }));
        }
    }

    const onDateChange = (name, date) => {
        if (date) {
            const formattedDate = new Date(date);
            let obj = { ...selectedRecord, [name]: formattedDate };
            if (name === "publishedAt") {
                if (formattedDate > new Date()) {
                    obj = { ...obj, status: 2 };
                } else {
                    obj = { ...obj, status: 1 };
                }
            }
            setSelectedRecord(obj);
            setFormError((formError) => ({
                ...formError,
                expiredAt: formValidate("expiredAt", formattedDate)
            }));
            setPopoverOpen(false);
            setPopoverOpenExpired(false);
        }
    };

    const onDateChangeqq = (name, date) => {
        if (date) {
            let obj = {...selectedRecord, [name]: date};
            if (name === "publishedAt") {
                if (date > new Date()) {
                    obj = {...obj, status: 2}
                } else {
                    obj = {...obj, status: 1}
                }
                // if (selectedRecord.expiredAt) {
                //     obj = { ...obj, expiredAt: null };
                // }
                obj = { ...obj, expiredAt: null, expiredBoolean: 0 };
            }
            setSelectedRecord(obj);
            setPopoverOpen(false);
            setPopoverOpenExpired(false);
        }
    };

    const updatePost = async (loader) => {
        let validationErrors = {};
        Object.keys(selectedRecord).forEach(name => {
            const error = formValidate(name, selectedRecord[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        const categoryError = formValidate("categoryId", selectedRecord.categoryId);
        if (categoryError) {
            validationErrors.categoryId = categoryError;
        }
        const expiredAtError = formValidate("expiredAt", selectedRecord.expiredAt);
        if (expiredAtError) {
            validationErrors.expiredAt = expiredAtError;
        }
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        if (
            selectedRecord.expiredBoolean === 1 &&
            !selectedRecord.expiredAt
        ) {
            selectedRecord.expiredBoolean = 0;
        }

        setIsLoad(loader)
        let formData = new FormData();
        Object.keys(selectedRecord).map((x) => {
            if (x !== "labelId") {
                if (x === "assignToId") {
                    formData.append(x, selectedRecord[x]);
                }
                // else if (x === "slug") {
                //     formData.append("slug", selectedRecord?.slug ? selectedRecord?.slug : selectedRecord?.title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                // }
                else if (x === "publishedAt") {
                    formData.append("publishedAt", moment(selectedRecord?.publishedAt).format("YYYY-MM-DD"));
                } else if (x === "expiredAt") {
                    formData.append("expiredAt", selectedRecord?.expiredBoolean === 1 ? moment(selectedRecord?.expiredAt).format("YYYY-MM-DD") : "");
                } else if (x === "deleteImage" && selectedRecord?.image?.name) {

                } else if (x === "categoryId" && (selectedRecord[x] === null || selectedRecord[x] === "null")) {
                    formData.append("categoryId", "");
                } else {
                    formData.append(x, selectedRecord[x]);
                }
            }

        })

        if (selectedRecord?.labels && Array.isArray(selectedRecord.labels)) {
            if (selectedRecord.labels.length > 0) {
                selectedRecord.labels.forEach((label) => {
                    formData.append("labelId[]", label);
                });
            } else {
                formData.append("labelId[]", "");
            }
        } else {
            formData.append("labelId[]", "");
        }

        const data = await apiService.updatePosts(formData, selectedRecord?.id)
        if (data.success) {
            setSelectedRecord(selectedRecord)
            setOldSelectedAnnouncement(selectedRecord)
            setIsLoad('')
            toast({description: data.message,});

        } else {
            setIsLoad('')
            toast({description: data?.error?.message, variant: "destructive"});
        }
    }

    const handleValueChange = (value) => {
        // const clone = [...changeLogDetails.assignToId]
        // const index = clone.indexOf(value);
        // if (index > -1) {
        //     clone.splice(index, 1);
        // } else {
        //     clone.push(value);
        // }
        setSelectedRecord({...selectedRecord, assignToId: value});
    };

    const onChangeLabel = (value) => {
        const clone = [...(selectedRecord.labels || [])]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setSelectedRecord({...selectedRecord, labels: clone});
    }

    const links = [{ label: 'Announcement', path: `/announcements?pageNo=${getPageNo}` }];

    const publishDate = selectedRecord?.publishedAt ? new Date(selectedRecord.publishedAt) : null;
    const isDateDisabled = (date) => {
        return publishDate && date < publishDate;
    };

    const handleOnCreateCancel = () => {
        setSelectedRecord(oldSelectedAnnouncement);
        setFormError(initialStateError);
        navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`)
    }

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className={"flex justify-between items-center gap-2"}>
                <CommonBreadCrumb
                    links={links}
                    currentPage={selectedRecord?.title}
                    truncateLimit={30}
                />
                <div className={"flex items-center gap-4"}>
                    <Button variant="outline" className={"w-9 h-9"} size="icon"
                            onClick={() => commonToggle("pinTop", selectedRecord.pinTop === 1 ? 0 : 1)}
                    >
                        {
                            selectedRecord.pinTop === 1 ?
                                <Pin size={15} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/> :
                                <Pin size={15}/>
                        }
                    </Button>
                    <Button
                        onClick={() => navigate(`${baseUrl}/announcements/analytic-view?id=${selectedRecord.id}`)}
                        variant="outline" className={"w-9 h-9"} size="icon"
                    >
                        <BarChart size={15}/>
                    </Button>
                    <Button
                        variant={"outline "}
                        disabled={isLoad === 'head'}
                        onClick={() => updatePost('head')}
                        className={`bg-primary w-[101px] font-medium hidden md:flex justify-center items-center ${theme === "dark" ? "text-card-foreground" : "text-card"}`}
                    >
                        {isLoad == 'head' ? <Loader2
                            className="h-4 w-4 animate-spin"/> : "Update Post"}
                    </Button>
                    <Button onClick={() => navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`)} variant={"outline "}
                            className={`text-sm font-medium border border-primary hidden md:block ${theme === "dark" ? "" : "text-primary"}`}>Cancel</Button>
                </div>
            </div>
            <Card className={"mt-4"}>
                <CardContent className={"p-0"}>
                    <div className={"p-2 sm:p-3 lg:p-6 border-b"}>
                        <div className={"flex gap-4"}>
                            <div className="w-full flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="title" className={"font-medium after:ml-0.5 after:content-['*'] after:text-destructive"}>Title</Label>
                                    <Input type="text" id="title" className={"h-9"} name={"title"}
                                           value={selectedRecord.title} onChange={onChangeText}/>
                                    {formError.title &&
                                    <span className="text-sm text-red-500">{formError.title}</span>}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="link" className={"font-medium"}>Permalink / Slug</Label>
                                    <Input type="text" className={"h-9"} id="link" name={"slug"}
                                           value={selectedRecord.slug} onChange={onChangeText} disabled/>
                                    <p className={"text-sm font-normal text-muted-foreground break-words"}>This release will
                                        be available at {projectDetailsReducer.domain ? <a
                                            href={`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${selectedRecord.slug?.toLowerCase()}`}
                                            target={"_blank"}
                                            className={"text-primary max-w-[593px] w-full break-words text-sm"}>{`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${selectedRecord.slug?.toLowerCase()}`}</a> : ""}</p>
                                    {/*{formError?.slug &&*/}
                                    {/*<span className="text-sm text-red-500">{formError?.slug}</span>}*/}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="description" className={"font-medium after:ml-0.5 after:content-['*'] after:text-destructive"}>Description</Label>
                                    <ReactQuillEditor className={"min-h-[145px] h-full"} value={selectedRecord.description} onChange={onChangeText}
                                                      name={"description"}/>
                                    {formError.description && <span className="text-sm text-red-500">{formError.description}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"p-2 sm:p-3 lg:p-6 flex flex-col gap-4 border-b"}>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className="w-full flex flex-col gap-4">
                                <div className={"w-full space-y-1.5"}>
                                    <Label className={"font-medium"}>Label</Label>
                                    <Select value={[]} onValueChange={onChangeLabel}>
                                    {/*<Select value={selectedRecord?.labels?.length > 0 ? selectedRecord.labels[0] : undefined} onValueChange={onChangeLabel}>*/}
                                        <SelectTrigger className="h-9">
                                            <SelectValue className={"text-muted-foreground text-sm"}>
                                                {
                                                    selectedRecord?.labels?.length > 0 ? (
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (selectedRecord.labels || []).map((x, i) => {
                                                                const findObj = labelList.find((y) => y.id == x);
                                                                return (
                                                                    <Badge key={i}
                                                                        variant={"outline"}
                                                                        style={{
                                                                            color: findObj?.colorCode,
                                                                            borderColor: findObj?.colorCode,
                                                                            textTransform: "capitalize"
                                                                        }}
                                                                        className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-normal text-[${findObj?.colorCode}] border-[${findObj?.colorCode}] capitalize`}
                                                                    ><span className={"max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{findObj?.name}</span></Badge>
                                                                )
                                                            })
                                                        }
                                                    </div>) : (
                                                        <span className="text-muted-foreground">Select Label</span>
                                                    )
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (labelList || []).map((x, i) => {
                                                        return (
                                                            <SelectItem className={"p-2"} key={i} value={x.id}>
                                                                <div className={"flex gap-1"}>
                                                                    <div onClick={() => onChangeLabel(x.id)}
                                                                         className="checkbox-icon">
                                                                        {selectedRecord?.labels?.includes(x.id) ?
                                                                            <Check size={18}/> :
                                                                            <div className={"h-[18px] w-[18px]"}/>}
                                                                    </div>
                                                                    <div className={"flex items-center gap-2"}>
                                                                        <Circle fill={x.colorCode}
                                                                                stroke={x.colorCode}
                                                                                className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                                        <span className={"max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.name}</span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"w-full space-y-1.5"}>
                                    <Label className={"font-medium"}>Assign to</Label>
                                    <Select onValueChange={handleValueChange} value={[]}>
                                    {/*<Select onValueChange={handleValueChange} value={selectedRecord?.assignToId?.length > 0 ? selectedRecord.assignToId[0] : undefined}>*/}
                                        <SelectTrigger className={"h-9"}>
                                            <SelectValue className={"text-muted-foreground text-sm"}>
                                                {
                                                    selectedRecord?.assignToId ? (
                                                        <div className={"flex gap-[2px]"}>
                                                            {(() => {
                                                                const findObj = memberList.find((y) => y.userId == selectedRecord.assignToId);
                                                                return findObj ? (
                                                                    <div
                                                                        className={`${
                                                                            theme === "dark" ? "text-card bg-accent-foreground" : "bg-muted-foreground/30"
                                                                        } text-sm flex gap-[2px] items-center rounded py-0 px-2`}
                                                                    >
                                                                        {findObj?.firstName ? findObj.firstName : ''}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-muted-foreground">Select Assign To</span>
                                                                );
                                                            })()}
                                                        </div>) : (<span className="text-muted-foreground">Select Assign To</span>)
                                                }
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(memberList || []).map((x, i) => (
                                                    <SelectItem className={"p-2"} key={i} value={x.userId.toString()}>
                                                        <div className={"flex gap-2"}>
                                                            <div onClick={() => handleValueChange(x.userId.toString())} className="checkbox-icon">
                                                                {selectedRecord?.assignToId == x.userId ? (
                                                                    <Check size={18} />
                                                                ) : (
                                                                    <div className={"h-[18px] w-[18px]"} />
                                                                )}
                                                            </div>
                                                            <span>{x.firstName ? x.firstName : ''} {x.lastName ? x.lastName : ''}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"w-full space-y-1.5"}>
                                    <Label className={"font-medium after:ml-0.5 after:content-['*'] after:text-destructive"}>Category</Label>
                                    <Select
                                        value={selectedRecord && selectedRecord?.categoryId && selectedRecord?.categoryId?.toString()}
                                        // value={selectedRecord?.categoryId?.toString() || "null"}
                                        onValueChange={onChangeCategory}>
                                        <SelectTrigger className="h-9">
                                            {selectedRecord?.categoryId ? (
                                                <SelectValue>
                                                    {categoriesList.find(x => x.id.toString() === selectedRecord.categoryId.toString())?.name}
                                                </SelectValue>
                                            ) : (
                                                <span className="text-muted-foreground">Select a category</span>
                                            )}
                                            {/*<SelectValue className={"text-muted-foreground text-sm"}>*/}
                                            {/*    {selectedRecord?.categoryId === null || selectedRecord?.categoryId === "null"*/}
                                            {/*        ? "None"*/}
                                            {/*        : categoriesList.find(x => x.id.toString() === selectedRecord?.categoryId?.toString())?.name || "Select a category"}*/}
                                            {/*</SelectValue>*/}
                                            {/*<SelectValue className={"text-muted-foreground text-sm"}>*/}
                                            {/*    {selectedRecord?.categoryId && selectedRecord?.categoryId !== "null"*/}
                                            {/*        ? categoriesList.find((x) => x.id.toString() === selectedRecord?.categoryId?.toString())?.name || "Select a category"*/}
                                            {/*        : "None"}*/}
                                            {/*</SelectValue>*/}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={null}>None</SelectItem>
                                                {
                                                    (categoriesList || []).map((x, i) => {
                                                        return (
                                                            <SelectItem key={i}
                                                                        value={x.id.toString()}>{x.title}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {formError.categoryId && <span className="text-sm text-red-500">{formError.categoryId}</span>}
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-4 items-stretch h-full">
                                <div className="space-y-1.5 h-full">
                                    <Label className={"font-medium"}>Featured Image</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1 items-stretch">
                                        {selectedRecord?.image ? (
                                            <div className="h-full">
                                                {selectedRecord?.image && (
                                                    <div className="w-[282px] h-[128px] relative border p-[5px]">
                                                        <img
                                                            className="upload-img h-full"
                                                            src={selectedRecord.image.name ? URL.createObjectURL(selectedRecord.image) : `${DO_SPACES_ENDPOINT}/${selectedRecord.image}`}
                                                            alt=""
                                                        />
                                                        <CircleX
                                                            size={20}
                                                            className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2 z-10"
                                                            onClick={() =>
                                                                onDeleteImg('deleteImage', selectedRecord.image.name ? '' : selectedRecord.image)
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full">
                                                <input
                                                    id="pictureInput"
                                                    type="file"
                                                    className="hidden"
                                                    accept={"image/*"}
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor="pictureInput"
                                                    className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                                >
                                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    {formError.image && <div className="text-xs text-red-500">{formError.image}</div>}
                                </div>
                                <div className="flex flex-col gap-[18px] w-full h-full">
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label htmlFor="date" className={"font-medium"}>Published at</Label>
                                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant="outline"
                                                    className={"justify-between hover:bg-card text-left font-normal d-flex text-muted-foreground hover:text-muted-foreground bg-card"}
                                                >
                                                    {/*{moment(selectedRecord?.publishedAt).format("LL")}*/}
                                                    {selectedRecord.publishedAt
                                                        ? moment(selectedRecord.publishedAt).format("LL")
                                                        : "Select Date"}
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown"
                                                    showOutsideDays={false}
                                                    selected={selectedRecord?.publishedAt ? new Date(selectedRecord?.publishedAt) : new Date()}
                                                    onSelect={(date) => onDateChange("publishedAt", date)}
                                                    startMonth={new Date(2024, 0)}
                                                    endMonth={new Date(2050, 12)}
                                                    hideNavigation
                                                    defaultMonth={
                                                        selectedRecord.publishedAt
                                                            ? new Date(selectedRecord.publishedAt)
                                                            : new Date()
                                                    }
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="expire_date"
                                                checked={selectedRecord?.expiredBoolean === 1}
                                                onCheckedChange={(checked) => commonToggle("expiredBoolean", checked ? 1 : 0)}
                                            />
                                            <label htmlFor="expire_date" className={`text-sm font-medium ${selectedRecord?.expiredBoolean === 1 ? "after:ml-0.5 after:content-['*'] after:text-destructive" : ""}`}>Expire At</label>
                                        </div>
                                        {selectedRecord?.expiredBoolean === 1 && (
                                            <div className="grid w-full gap-2 basis-1/2">
                                                <Popover open={popoverOpenExpired} onOpenChange={setPopoverOpenExpired}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date"
                                                            variant="outline"
                                                            className={"justify-between hover:bg-card text-left font-normal d-flex text-muted-foreground hover:text-muted-foreground bg-card"}
                                                        >
                                                            {/*{moment(selectedRecord?.expiredAt).format("LL")}*/}
                                                            {selectedRecord?.expiredAt
                                                                ? moment(selectedRecord.expiredAt).format("LL")
                                                                : "Select Expiration Date"}
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            showOutsideDays={false}
                                                            captionLayout="dropdown"
                                                            // selected={selectedRecord?.expiredAt}
                                                            selected={selectedRecord?.expiredAt ? new Date(selectedRecord.expiredAt) : null}
                                                            onSelect={(date) => onDateChange("expiredAt", date)}
                                                            // startMonth={new Date(2024, 0)}
                                                            // endMonth={new Date(2050, 12)}

                                                            // startMonth={selectedRecord?.publishedAt ? new Date(selectedRecord.publishedAt) : new Date()}
                                                            // fromDate={selectedRecord?.publishedAt ? new Date(selectedRecord.publishedAt) : null}

                                                            endMonth={new Date(2050, 12)}
                                                            startMonth={publishDate || new Date()}
                                                            disabled={isDateDisabled}
                                                            hideNavigation
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {formError.expiredAt && <span className="text-sm text-destructive">{formError.expiredAt}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className={"px-3 py-4 lg:p-6 gap-4"}>
                    <Button
                        variant={"outline "}
                        disabled={isLoad === 'bottom'}
                        onClick={() => updatePost("bottom")}
                        className={`bg-primary w-[101px] font-medium ${theme === "dark" ? "text-card-foreground" : "text-card"}`}
                    >
                        {isLoad === 'bottom' ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update Post"}
                    </Button>
                    <Button onClick={handleOnCreateCancel} variant={"outline "}
                            className={`border border-primary text-sm font-medium ${theme === "dark" ? "" : "text-primary"}`}>Cancel</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UpdateAnnouncement;