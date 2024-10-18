import React, {useEffect, useState, Fragment} from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Badge} from "../ui/badge";
import {CalendarIcon, Check, Circle, CircleX, Loader2, Pin, Upload, X} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Button} from "../ui/button";
import {cn} from "../../lib/utils";
import moment from "moment";
import {Calendar} from "../ui/calendar";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useTheme} from "../theme-provider";
import {ApiService} from "../../utils/ApiService";
import {toast} from "../ui/use-toast";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import {baseUrl} from "../../utils/constent";
import {Checkbox} from "../ui/checkbox";
import {Card, CardContent, CardFooter} from "../ui/card";

const initialStateError = {
    post_title: "",
    post_description: "",
    post_slug_url: "",
}

const UpdateAnnouncement = () => {
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;

    const { id } = useParams();
    const {theme} = useTheme();
    let apiService = new ApiService();
    const navigate = useNavigate();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [selectedRecord, setSelectedRecord] = useState({});
    const [labelList, setLabelList] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [isLoad, setIsLoad] = useState('')
    const [formError, setFormError] = useState(initialStateError);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverOpenExpired, setPopoverOpenExpired] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            // if (selectedRecord?.post_slug_url) {
            //     getSinglePosts();
            // } else {
            //     setSelectedRecord({
            //         ...selectedRecord,
            //         post_assign_to: [userDetailsReducer.id.toString()],
            //     });
            // }
            getSinglePosts();
            setLabelList(allStatusAndTypes.labels);
            setMemberList(allStatusAndTypes.members);
            setCategoriesList(allStatusAndTypes.categories);
        }
    }, [projectDetailsReducer.id, allStatusAndTypes, userDetailsReducer.id, getPageNo])

    const getSinglePosts = async () => {
        const data = await apiService.getSinglePosts(id);
        if (data.status === 200) {
            setSelectedRecord({
                ...data.data,
                image: data.data?.feature_image,
                post_assign_to: data.data?.post_assign_to !== null ? data.data?.post_assign_to?.split(',') : [],
                post_published_at: data.data?.post_published_at ? moment(data.data?.post_published_at).format('YYYY-MM-DD') : moment(new Date()),
                post_expired_at: data.data?.post_expired_at ? moment(data.data?.post_expired_at).format('YYYY-MM-DD') : undefined,
                category_id: data.data?.category_id,
                labels: data.data?.labels || [],
            });
        }
        // setPreviewImage(selectedRecord.feature_image);
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
            case "post_title":
                if (!value || value.trim() === "") {
                    return "Title is required.";
                } else {
                    return "";
                }
            case "post_slug_url":
                if (!value || value.trim() === "") {
                    return "Permalink / Slug is required.";
                } else {
                    return "";
                }
            case "post_description":
                if (!value || value.trim() === "") {
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
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        const {name, value} = event.target;
        let updatedDetails = {...selectedRecord};
        if (name === "post_title") {
            const slug = value
                .replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            if (updatedDetails.post_title.replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase() === updatedDetails.post_slug_url) {
                updatedDetails = {
                    ...updatedDetails,
                    post_title: value,
                    post_slug_url: slug
                };
            } else {
                updatedDetails = {
                    ...updatedDetails,
                    post_title: value,
                };
            }

        } else if (name === "post_slug_url") {
            const slug = value
                .replace(/[^a-z0-9\s-]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            updatedDetails = {
                ...updatedDetails,
                post_slug_url: slug
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
        setSelectedRecord({...selectedRecord, category_id: selectedItems === null ? "" : selectedItems})
    }

    const commonToggle = (name, value) => {
        setSelectedRecord({...selectedRecord, [name]: value})
    }

    const onDateChange = (name, date) => {
        if (date) {
            let obj = {...selectedRecord, [name]: date};
            if (name === "post_published_at") {
                if (date > new Date()) {
                    obj = {...obj, post_status: 2}
                } else {
                    obj = {...obj, post_status: 1}
                }
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
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsLoad(loader)
        let formData = new FormData();
        formData.append("post_project_id", projectDetailsReducer.id);
        Object.keys(selectedRecord).map((x) => {
            if (x !== "labels") {
                if (x === "post_assign_to") {
                    formData.append(x, selectedRecord[x]);
                } else if (x === "post_slug_url") {
                    formData.append("post_slug_url", selectedRecord?.post_slug_url ? selectedRecord?.post_slug_url : selectedRecord?.post_title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                } else if (x === "post_published_at") {
                    formData.append("post_published_at", moment(selectedRecord?.post_published_at).format("YYYY-MM-DD"));
                } else if (x === "post_expired_at") {
                    formData.append("post_expired_at", selectedRecord?.post_expired_boolean === 1 ? moment(selectedRecord?.post_expired_at).format("YYYY-MM-DD") : "");
                } else if (x === "delete_image" && selectedRecord?.image?.name) {

                } else if (x === "category_id" && (selectedRecord[x] === null || selectedRecord[x] === "null")) {
                    formData.append("category_id", "");
                } else {
                    formData.append(x, selectedRecord[x]);
                }
            }

        })

        for (let i = 0; i < selectedRecord?.labels?.length; i++) {
            formData.append('labels[]', selectedRecord?.labels[i]);
        }

        const data = await apiService.updatePosts(formData, selectedRecord?.id)
        if (data.status === 200) {
            setSelectedRecord(selectedRecord)
            setIsLoad('')
            toast({
                description: data.message,
            });

        } else {
            setIsLoad('')
            toast({
                description: data.message,
                variant: "destructive"
            });
        }
    }

    const handleValueChange = (value) => {
        // const clone = [...changeLogDetails.post_assign_to]
        // const index = clone.indexOf(value);
        // if (index > -1) {
        //     clone.splice(index, 1);
        // } else {
        //     clone.push(value);
        // }
        setSelectedRecord({...selectedRecord, post_assign_to: [value]});
    };

    const onChangeLabel = (value) => {
        const clone = [...selectedRecord.labels]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setSelectedRecord({...selectedRecord, labels: clone});
    }

    const deleteAssignTo = (e, index) => {e.stopPropagation();}

    return (
        <div className={"container xl:max-w-[1200px] lg:max-w-[992px] md:max-w-[768px] sm:max-w-[639px] pt-8 pb-5 px-3 md:px-4"}>
            <div className={"flex justify-between items-center gap-2"}>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbLink onClick={() => navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`)}>
                                Announcement
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className={"cursor-pointer"}>
                            <BreadcrumbPage>{selectedRecord.post_title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className={"flex items-center gap-4"}>
                    <Button variant={"outline"}
                            className={`w-9 h-9 p-1`}
                            onClick={() => commonToggle("post_pin_to_top", selectedRecord.post_pin_to_top === 1 ? 0 : 1)}
                    >
                        {
                            selectedRecord.post_pin_to_top === 1 ?
                                <Pin size={18} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/> :
                                <Pin size={18}/>
                        }
                    </Button>
                    <Button
                        size={"sm"}
                        variant={"outline "}
                        disabled={isLoad === 'head'}
                        onClick={() => updatePost('head')}
                        className={`bg-primary w-[115px] font-medium hidden md:flex justify-center items-center ${theme === "dark" ? "text-card-foreground" : "text-card"}`}
                    >
                        {isLoad === 'head' ? <Loader2
                            className="h-4 w-4 animate-spin"/> : "Update Post"}
                    </Button>
                    <Button size={"sm"} onClick={() => navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`)} variant={"outline "}
                            className={`text-sm font-medium border border-primary hidden md:block ${theme === "dark" ? "" : "text-primary"}`}>Cancel</Button>

                </div>
            </div>
            <Card className={"mt-4"}>
                <CardContent className={"p-0"}>
                    <div className={"p-2 sm:p-3 lg:p-6 border-b"}>
                        <div className={"flex gap-4"}>
                            <div className="w-full flex flex-col gap-4">
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="title" className={"font-normal"}>Title</Label>
                                    <Input type="text" id="title" className={"h-9"} name={"post_title"}
                                           value={selectedRecord.post_title} onChange={onChangeText}/>
                                    {formError.post_title &&
                                    <span className="text-sm text-red-500">{formError.post_title}</span>}
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="link" className={"font-normal"}>Permalink / Slug</Label>
                                    <Input type="text" className={"h-9"} id="link" name={"post_slug_url"}
                                           value={selectedRecord.post_slug_url} onChange={onChangeText}/>
                                    <p className={"text-sm font-normal text-muted-foreground break-words"}>This release will
                                        be available at {projectDetailsReducer.domain ? <a
                                            href={`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${selectedRecord.post_slug_url?.toLowerCase()}`}
                                            target={"_blank"}
                                            className={"text-primary max-w-[593px] w-full break-words text-sm"}>{`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${selectedRecord.post_slug_url?.toLowerCase()}`}</a> : ""}</p>
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <Label htmlFor="description" className={"font-normal"}>Description</Label>
                                    <ReactQuillEditor className={"min-h-[145px] h-full"} value={selectedRecord.post_description} onChange={onChangeText}
                                                      name={"post_description"}/>
                                    {formError.post_description &&
                                    <span className="text-sm text-red-500">{formError.post_description}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"p-2 sm:p-3 lg:p-6 flex flex-col gap-4 border-b"}>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className="w-full flex flex-col gap-4">
                                <div className={"w-full space-y-1.5"}>
                                    <Label className={"font-normal"}>Label</Label>
                                    <Select value={[]} onValueChange={onChangeLabel}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue className={"text-muted-foreground text-sm"}
                                                         placeholder="Nothing selected">
                                                <div className={"flex gap-[2px]"}>
                                                    {
                                                        (selectedRecord.labels || []).map((x) => {
                                                            const findObj = labelList.find((y) => y.id == x);
                                                            return (
                                                                <Badge variant={"outline"} style={{
                                                                    color: findObj?.label_color_code,
                                                                    borderColor: findObj?.label_color_code,
                                                                    textTransform: "capitalize"
                                                                }}
                                                                       className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-normal text-[${findObj?.label_color_code}] border-[${findObj?.label_color_code}] capitalize`}>{findObj?.label_name}</Badge>
                                                            )
                                                        })
                                                    }
                                                </div>
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
                                                                        <Circle fill={x.label_color_code}
                                                                                stroke={x.label_color_code}
                                                                                className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                                        {x.label_name}
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
                                    <Label className={"font-normal"}>Assign to</Label>
                                    <Select onValueChange={handleValueChange} value={[]}>
                                        <SelectTrigger className={"h-9"}>
                                            <SelectValue className={"text-muted-foreground text-sm"}
                                                         placeholder="Assign to">
                                                <div className={"flex gap-[2px]"}>
                                                    {
                                                        Array.isArray(selectedRecord?.post_assign_to) && (selectedRecord?.post_assign_to || []).map((x, index) => {
                                                            const findObj = memberList.find((y,) => y.user_id == x);
                                                            return (
                                                                <div key={index}
                                                                     className={`${theme === "dark" ? "text-card bg-accent-foreground" : "bg-muted-foreground/30"} text-sm flex gap-[2px] items-center rounded py-0 px-2`}
                                                                     onClick={(e) => deleteAssignTo(e, index)}>
                                                                    {findObj?.user_first_name ? findObj?.user_first_name : ''}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {(memberList || []).map((x, i) => (
                                                    <SelectItem className={"p-2"} key={i} value={x.user_id}>
                                                        <div className={"flex gap-2"}>
                                                            <div onClick={() => handleValueChange(x.user_id)}
                                                                 className="checkbox-icon">
                                                                {selectedRecord?.post_assign_to?.includes(x.user_id) ?
                                                                    <Check size={18}/> :
                                                                    <div className={"h-[18px] w-[18px]"}/>}
                                                            </div>
                                                            <span>{x.user_first_name ? x.user_first_name : ''} {x.user_last_name ? x.user_last_name : ''}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}

                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"w-full space-y-1.5"}>
                                    <Label className={"font-normal"}>Category</Label>
                                    <Select
                                        value={selectedRecord && selectedRecord?.category_id && selectedRecord?.category_id?.toString()}
                                        onValueChange={onChangeCategory}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value={null}>None</SelectItem>
                                                {
                                                    (categoriesList || []).map((x, i) => {
                                                        return (
                                                            <SelectItem key={i}
                                                                        value={x.id.toString()}>{x.name}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-4 items-stretch h-full">
                                <div className="space-y-1.5 h-full">
                                    <Label className={"font-normal"}>Featured Image</Label>
                                    <div className="w-[282px] h-[128px] flex gap-1 items-stretch">
                                        {selectedRecord?.image ? (
                                            <div className="h-full">
                                                {selectedRecord?.image.name ? (
                                                    <div className="w-[282px] h-[128px] relative border p-[5px]">
                                                        <img
                                                            className="upload-img h-full"
                                                            src={URL.createObjectURL(selectedRecord?.image)}
                                                            alt=""
                                                        />
                                                        <CircleX
                                                            size={20}
                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2 z-10`}
                                                            onClick={() => onDeleteImg('delete_image', selectedRecord?.image?.name ? "" : selectedRecord?.image?.replace("https://code.quickhunt.app/public/storage/post/", ""))}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-[282px] h-[128px] relative border p-[5px]">
                                                        <img className="upload-img h-full" src={selectedRecord?.image} alt="" />
                                                        <CircleX
                                                            size={20}
                                                            className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-0 left-full transform -translate-x-1/2 -translate-y-1/2 z-10`}
                                                            onClick={() => onDeleteImg('delete_image', selectedRecord?.image?.name ? "" : selectedRecord?.image?.replace("https://code.quickhunt.app/public/storage/post/", ""))}
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
                                                    accept={".jpg,.jpeg"}
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
                                        <Label htmlFor="date" className={"font-normal"}>Published at</Label>
                                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant="outline"
                                                    className={cn("justify-between text-left font-normal d-flex", "text-muted-foreground")}
                                                >
                                                    {moment(selectedRecord?.post_published_at).format("LL")}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    captionLayout="dropdown"
                                                    showOutsideDays={false}
                                                    selected={selectedRecord?.post_published_at ? new Date(selectedRecord?.post_published_at) : new Date()}
                                                    onSelect={(date) => onDateChange("post_published_at", date)}
                                                    startMonth={new Date(2024, 0)}
                                                    endMonth={new Date(2050, 12)}
                                                    hideNavigation
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="expire_date"
                                                checked={selectedRecord?.post_expired_boolean === 1}
                                                onCheckedChange={(checked) => commonToggle("post_expired_boolean", checked ? 1 : 0)}
                                            />
                                            <label htmlFor="expire_date" className="text-sm font-normal">Expire At</label>
                                        </div>
                                        {selectedRecord?.post_expired_boolean === 1 && (
                                            <div className="grid w-full gap-2 basis-1/2">
                                                <Popover open={popoverOpenExpired} onOpenChange={setPopoverOpenExpired}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="date"
                                                            variant="outline"
                                                            className={cn("justify-between text-left font-normal d-flex", "text-muted-foreground")}
                                                        >
                                                            {moment(selectedRecord?.post_expired_at).format("LL")}
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            showOutsideDays={false}
                                                            captionLayout="dropdown"
                                                            selected={selectedRecord?.post_expired_at}
                                                            onSelect={(date) => onDateChange("post_expired_at", date)}
                                                            startMonth={new Date(2024, 0)}
                                                            endMonth={new Date(2050, 12)}
                                                            hideNavigation
                                                        />
                                                    </PopoverContent>
                                                </Popover>
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
                        className={` bg-primary ${theme === "dark" ? "text-card-foreground" : "text-card"} w-[115px] font-medium`}
                    >
                        {isLoad === 'bottom' ? <Loader2
                            className="h-4 w-4 animate-spin"/> : "Update Post"}
                    </Button>
                    <Button onClick={() => navigate(`${baseUrl}/announcements?pageNo=${getPageNo}`)} variant={"outline "}
                            className={`border border-primary ${theme === "dark" ? "" : "text-primary"} text-sm font-medium`}>Cancel</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UpdateAnnouncement;