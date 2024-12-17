import React, {useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay,} from "../ui/sheet";
import {CalendarIcon, Check, Circle, Pin, X, Loader2, CircleX, Upload} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "../ui/select";
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {useTheme} from "../theme-provider";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {cn} from "../../lib/utils";
import {Calendar} from "../ui/calendar";
import {toast} from "../ui/use-toast";
import {Badge} from "../ui/badge";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {Checkbox} from "../ui/checkbox";

const initialState = {
    post_description: '',
    post_slug_url: '',
    post_title: '',
    post_published_at: moment(new Date()),
    post_assign_to: [],
    post_pin_to_top: 0,
    post_expired_boolean: 0,
    post_expired_at: undefined,
    post_browser: '',
    post_ip_address: '',
    category_id: "",
    labels: [],
    image: '',
};
const initialStateError = {
    post_title: "",
    post_description: "",
    post_slug_url: "",
}

const CreateAnnouncement = ({isOpen, onOpen, onClose, selectedRecord, getAllPosts, announcementList}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const {theme} = useTheme();
    let apiService = new ApiService();

    const [changeLogDetails, setChangeLogDetails] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [labelList, setLabelList] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [isSave, setIsSave] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverOpenExpired, setPopoverOpenExpired] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
            setChangeLogDetails({
                ...changeLogDetails,
                post_assign_to: [userDetailsReducer.id.toString()],
            });
            setLabelList(allStatusAndTypes.labels);
            setMemberList(allStatusAndTypes.members);
            setCategoriesList(allStatusAndTypes.categories);
        }
    }, [projectDetailsReducer.id, allStatusAndTypes, userDetailsReducer.id])

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
                setChangeLogDetails({
                    ...changeLogDetails,
                    image: selectedFile
                });
            }
        }
    };

    const onDeleteImg = async (name, value) => {
        if (changeLogDetails && changeLogDetails?.image && changeLogDetails.image?.name) {
            setChangeLogDetails({...changeLogDetails, image: ""})
        } else {
            setChangeLogDetails({...changeLogDetails, [name]: value, image: ""})
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
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        const {name, value} = event.target;
        let updatedDetails = {...changeLogDetails};
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
                setFormError((formError) => ({
                    ...formError,
                    post_slug_url: '',
                    [name]: formValidate(name, value),
                }));
            } else {
                updatedDetails = {
                    ...updatedDetails,
                    post_title: value,
                };
                setFormError((formError) => ({
                    ...formError,
                    [name]: formValidate(name, value),
                }));
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
            setFormError((formError) => ({
                ...formError,
                [name]: formValidate(name, value),
            }));
        } else {
            updatedDetails[name] = value;
            setFormError((formError) => ({
                ...formError,
                [name]: formValidate(name, value),
            }));
        }
        setChangeLogDetails(updatedDetails);
        // setFormError((formError) => ({
        //     ...formError,
        //     [name]: formValidate(name, value)
        // }));
    };

    const onChangeCategory = (selectedItems) => {
        setChangeLogDetails({...changeLogDetails, category_id: selectedItems === null ? "" : selectedItems})
    }

    const commonToggle = (name, value) => {
        setChangeLogDetails({...changeLogDetails, [name]: value})
    }

    // const onDateChange = (name, date) => {
    //     if (date) {
    //         let obj = {...changeLogDetails, [name]: date};
    //         if (name === "post_published_at") {
    //             if (date > new Date()) {
    //                 obj = {...obj, post_status: 2}
    //             } else {
    //                 obj = {...obj, post_status: 1}
    //             }
    //         }
    //         setChangeLogDetails(obj);
    //         setPopoverOpen(false);
    //         setPopoverOpenExpired(false);
    //     }
    // };

    const onDateChange = (name, date) => {
        if (date) {
            const formattedDate = new Date(date); // Ensure it's a valid Date object
            let obj = { ...changeLogDetails, [name]: formattedDate };

            if (name === "post_published_at") {
                if (formattedDate > new Date()) {
                    obj = { ...obj, post_status: 2 }; // Future date
                } else {
                    obj = { ...obj, post_status: 1 }; // Past or current date
                }
            }

            setChangeLogDetails(obj);
            setPopoverOpen(false);
            setPopoverOpenExpired(false);
        }
    };

    const createPosts = async () => {
        let validationErrors = {};
        Object.keys(changeLogDetails).forEach(name => {
            const error = formValidate(name, changeLogDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        const imageError = formValidate('image', changeLogDetails.image);
        if (imageError) {
            validationErrors['image'] = imageError;
        }
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        const isSlugTaken = (announcementList || []).some(x => x.post_slug_url === changeLogDetails.post_slug_url);
        if (isSlugTaken) {
            toast({
                description: "The post slug url has already been taken.",
                variant: "destructive",
            });
            return;
        }

        if (
            changeLogDetails.post_expired_boolean === 1 &&
            !changeLogDetails.post_expired_at
        ) {
            changeLogDetails.post_expired_boolean = 0;
        }

        setIsSave(true)
        let formData = new FormData();
        formData.append("post_project_id", projectDetailsReducer.id);
        if (changeLogDetails.post_title && changeLogDetails.post_title.length > 250) {
            validationErrors['post_title'] = "Post title cannot be longer than 250 characters.";
        }
        Object.keys(changeLogDetails).map((x) => {
            if (x !== "labels") {
                if (x === "post_assign_to") {
                    formData.append(x, changeLogDetails[x].join());
                } else if (x === "post_slug_url") {
                    formData.append("post_slug_url", changeLogDetails.post_slug_url ? changeLogDetails.post_slug_url : changeLogDetails.post_title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                } else if (x === "post_published_at") {
                    formData.append("post_published_at", moment(changeLogDetails.post_published_at).format("YYYY-MM-DD"));
                } else if (x === "post_expired_at") {
                    formData.append("post_expired_at", changeLogDetails.post_expired_boolean === 1 ? moment(changeLogDetails.post_expired_at).format("YYYY-MM-DD") : "");
                } else if (x === "delete_image" && changeLogDetails?.image?.name) {

                } else if (x === "category_id" && (changeLogDetails[x] === null || changeLogDetails[x] === "null")) {
                    formData.append("category_id", "");
                } else {
                    formData.append(x, changeLogDetails[x]);
                }
            }
        })
        for (let i = 0; i < changeLogDetails.labels.length; i++) {
            formData.append('labels[]', changeLogDetails.labels[i]);
        }
        const data = await apiService.createPosts(formData);
        if (data.status === 200) {
            setChangeLogDetails(initialState)
            setIsSave(false)
            await getAllPosts()
            toast({description: data.message,});
        } else {
            setIsSave(false);
            toast({variant: "destructive", description: data.message,});
        }
        if (Object.keys(validationErrors).length === 0) {
            onClose("", data.data);
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
        setChangeLogDetails({...changeLogDetails, post_assign_to: [value]});
    };

    const onChangeLabel = (value) => {
        const clone = [...changeLogDetails.labels]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setChangeLogDetails({...changeLogDetails, labels: clone});
    }

    const deleteAssignTo = (e, index) => {e.stopPropagation();}

    const publishDate = changeLogDetails?.post_published_at ? new Date(changeLogDetails.post_published_at) : null;
    const isDateDisabled = (date) => {
        return publishDate && date < publishDate;
    };

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            {/*<SheetOverlay className={"inset-0"}/>*/}
            <SheetContent className={"pt-6 p-0 lg:max-w-[663px] md:max-w-[720px] sm:max-w-[520px]"}>
                <SheetHeader
                    className={`px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b`}>
                    <h5 className={"text-sm md:text-xl font-normal"}>Create New Announcements</h5>
                    <div className={"flex items-center gap-6 m-0"}>
                        <Button className={"h-5 w-5 p-0"}
                                onClick={() => commonToggle("post_pin_to_top", changeLogDetails.post_pin_to_top === 1 ? 0 : 1)}
                                variant={"ghost hover:bg-none"}>{changeLogDetails.post_pin_to_top === 1 ?
                            <Pin size={15} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/> : <Pin size={15}/>}
                        </Button>
                        <X onClick={onClose} size={18} className={"cursor-pointer"}/>
                    </div>
                </SheetHeader>
                <div className={"h-[calc(100vh_-_120px)] lg:h-[calc(100vh_-_69px)] overflow-y-auto"}>
                    <div className={"px-3 py-6 lg:px-8 border-b"}>
                        <div className={"flex flex-col gap-6"}>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="title" className={"font-normal"}>Title</Label>
                                <Input type="text" id="title" className={"h-9"} name={"post_title"}
                                       value={changeLogDetails.post_title} onChange={onChangeText}/>
                                {formError.post_title &&
                                <span className="text-sm text-destructive">{formError.post_title}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="link" className={"font-normal"}>Permalink / Slug</Label>
                                <Input type="text" className={"h-9"} id="link" name={"post_slug_url"}
                                       value={changeLogDetails.post_slug_url} onChange={onChangeText}/>
                                <p className={"text-sm font-normal text-muted-foreground break-words"}>This release will
                                    be available at {projectDetailsReducer.domain ? <a
                                        href={`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${changeLogDetails.post_slug_url?.toLowerCase()}`}
                                        target={"_blank"}
                                        className={"text-primary max-w-[593px] w-full break-words text-sm"}>{`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${changeLogDetails.post_slug_url?.toLowerCase()}`}</a> : ""}</p>
                                {formError.post_slug_url && <span className="text-sm text-destructive">{formError.post_slug_url}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="description" className={"font-normal"}>Description</Label>
                                <ReactQuillEditor className={"min-h-[145px] h-full"} value={changeLogDetails.post_description} onChange={onChangeText}
                                                  name={"post_description"}/>
                                {formError.post_description && <span className="text-sm text-destructive">{formError.post_description}</span>}
                            </div>
                        </div>
                    </div>
                    <div className={"px-3 py-6 lg:px-8 flex flex-col gap-4 border-b"}>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className="grid w-full gap-2 md:basis-1/2">
                                <Label htmlFor="label" className={"font-normal"}>Label</Label>
                                <Select value={[]} onValueChange={onChangeLabel}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue className={"text-muted-foreground text-sm"}>
                                            {
                                                changeLogDetails?.labels?.length > 0 ? (
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (changeLogDetails.labels || []).map((x) => {
                                                                const findObj = labelList.find((y) => y.id == x);
                                                                return (
                                                                    <Badge variant={"outline"} style={{
                                                                        color: findObj?.label_color_code,
                                                                        borderColor: findObj?.label_color_code,
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                           className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-normal text-[${findObj?.label_color_code}] border-[${findObj?.label_color_code}] capitalize`}>
                                                                        <span className={"max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{findObj?.label_name}</span></Badge>
                                                                )
                                                            })
                                                        }
                                                    </div>) : (<span className="text-muted-foreground">Select Label</span>)
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                (labelList || []).map((x, i) => {
                                                    return (
                                                        <SelectItem className={"p-2"} key={i} value={x.id.toString()}>
                                                            <div className={"flex gap-1"}>
                                                                <div onClick={() => onChangeLabel(x.id.toString())}
                                                                     className="checkbox-icon">
                                                                    {changeLogDetails.labels.includes(x.id.toString()) ?
                                                                        <Check size={18}/> :
                                                                        <div className={"h-[18px] w-[18px]"}/>}
                                                                </div>
                                                                <div className={"flex items-center gap-2"}>
                                                                    <Circle fill={x.label_color_code}
                                                                            stroke={x.label_color_code}
                                                                            className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
                                                                    <span className={"max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{x.label_name}</span>
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
                            <div className="grid w-full gap-2 md:basis-1/2">
                                <Label htmlFor="label" className={"font-normal"}>Assign to</Label>
                                <Select onValueChange={handleValueChange} value={[]}>
                                    <SelectTrigger className={"h-9"}>
                                        <SelectValue className={"text-muted-foreground text-sm"}>
                                            {
                                                changeLogDetails?.post_assign_to?.length > 0 ? (
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (changeLogDetails.post_assign_to || []).slice(0, 2).map((x, index) => {
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
                                                        {(changeLogDetails.post_assign_to || []).length > 2 &&
                                                        <div>...</div>}
                                                    </div>) : (<span className="text-muted-foreground">Select Assign To</span>)
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {(memberList || []).map((x, i) => (
                                                <SelectItem className={"p-2"} key={i} value={x.user_id.toString()}>
                                                    <div className={"flex gap-2"}>
                                                        <div onClick={() => handleValueChange(x.user_id.toString())}
                                                             className="checkbox-icon">
                                                            {changeLogDetails.post_assign_to?.includes(x.user_id.toString()) ?
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
                        </div>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className={"grid w-full gap-2 md:basis-1/2"}>
                                <Label htmlFor="label" className={"font-normal"}>Category</Label>
                                <Select
                                    value={changeLogDetails && changeLogDetails.category_id && changeLogDetails.category_id.toString()}
                                    onValueChange={onChangeCategory}>
                                    <SelectTrigger className="h-9">
                                        {changeLogDetails?.category_id ? (
                                            <SelectValue>
                                                {categoriesList.find(x => x.id.toString() === changeLogDetails.category_id.toString())?.name}
                                            </SelectValue>
                                        ) : (
                                            <span className="text-muted-foreground">Select a category</span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value={null}>None</SelectItem>
                                            {
                                                (categoriesList || []).map((x, i) => {
                                                    return (
                                                        <SelectItem key={i} value={x.id.toString()}>{x.name}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid w-full gap-2 md:basis-1/2">
                                <Label htmlFor="date" className={"font-normal"}>Published at</Label>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={"justify-between hover:bg-card text-left font-normal d-flex px-3 h-9 text-muted-foreground hover:text-muted-foreground bg-card"}
                                        >
                                            {/*{moment(changeLogDetails.post_published_at).format("LL")}*/}
                                            {changeLogDetails.post_published_at
                                                ? moment(changeLogDetails.post_published_at).format("LL")
                                                : "Select Date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                        <Calendar className={"pointer-events-auto"}
                                            mode="single"
                                            captionLayout="dropdown"
                                            showOutsideDays={false}
                                            selected={changeLogDetails.post_published_at ? new Date(changeLogDetails.post_published_at) : new Date()}
                                            onSelect={(date) => onDateChange("post_published_at", date)}
                                            startMonth={new Date(2024, 0)}
                                            endMonth={new Date(2050, 12)}
                                            hideNavigation
                                              defaultMonth={
                                                  changeLogDetails.post_published_at
                                                      ? new Date(changeLogDetails.post_published_at)
                                                      : new Date()
                                              }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <div className={"px-3 lg:px-8 flex flex-wrap items-center gap-4 md:flex-nowrap border-b py-6"}>
                        <div className={"space-y-1.5"}>
                            <Label className={"font-normal"}>Featured Image</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                {
                                    changeLogDetails?.image ?
                                        <div>
                                            {changeLogDetails && changeLogDetails.image && changeLogDetails.image.name ?
                                                <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                    <img
                                                        className={"upload-img"}
                                                        src={changeLogDetails && changeLogDetails.image && changeLogDetails.image.name ? URL.createObjectURL(changeLogDetails.image) : changeLogDetails.image}
                                                        alt=""
                                                    />
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImg('delete_image', changeLogDetails && changeLogDetails?.image && changeLogDetails.image?.name ? "" : changeLogDetails.image.replace("https://code.quickhunt.app/public/storage/post/", ""))}
                                                    />
                                                </div> :
                                                <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                                    <img className={"upload-img"} src={changeLogDetails.image}
                                                         alt=""/>
                                                    <CircleX
                                                        size={20}
                                                        className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                        onClick={() => onDeleteImg('delete_image', changeLogDetails && changeLogDetails?.image && changeLogDetails.image?.name ? "" : changeLogDetails.image.replace("https://code.quickhunt.app/public/storage/post/", ""))}
                                                    />
                                                </div>
                                            }
                                        </div> :
                                        <div>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                accept={"images/*"}
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                            </label>
                                        </div>
                                }
                            </div>
                            {formError.image && <div className={"text-xs text-destructive"}>{formError.image}</div>}
                        </div>
                        <div className={"flex flex-col gap-[18px] w-full"}>
                            <div className={"flex items-center gap-3"}>
                                <Checkbox id={"expire_date"}
                                        checked={changeLogDetails.post_expired_boolean === 1}
                                        onCheckedChange={(checked) => commonToggle("post_expired_boolean",checked === true ? 1 : 0)}/>
                                <label htmlFor={"expire_date"} className={"text-sm text-muted-foreground font-normal"}>Expire At</label>
                            </div>

                            {
                                changeLogDetails.post_expired_boolean === 1 ?
                                    <div className="grid w-full gap-2 basis-1/2">
                                        <Popover open={popoverOpenExpired} onOpenChange={setPopoverOpenExpired}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={"justify-between hover:bg-card text-left font-normal d-flex text-muted-foreground hover:text-muted-foreground bg-card"}
                                                >
                                                    {/*{moment(changeLogDetails.post_expired_at).format("LL")}*/}
                                                    {changeLogDetails?.post_expired_at
                                                        ? moment(changeLogDetails.post_expired_at).format("LL")
                                                        : "Select Expiration Date"}
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                                <Calendar className={"pointer-events-auto"}
                                                    mode="single"
                                                    showOutsideDays={false}
                                                    captionLayout="dropdown"
                                                    // selected={changeLogDetails.post_expired_at}
                                                    selected={changeLogDetails?.post_expired_at ? new Date(changeLogDetails.post_expired_at) : null}
                                                    onSelect={(date) => onDateChange("post_expired_at", date)}
                                                    // startMonth={new Date(2024, 0)}
                                                    // endMonth={new Date(2050, 12)}

                                                    endMonth={new Date(2050, 12)}
                                                    startMonth={publishDate || new Date()}
                                                    disabled={isDateDisabled}
                                                    hideNavigation
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div> : ""
                            }
                        </div>
                    </div>
                    <div className={"p-3 lg:p-8 sm:pb-0 flex flex-row gap-4"}>
                        <Button
                            variant={"outline "}
                            disabled={isSave}
                            onClick={createPosts}
                            className={`bg-primary w-[101px] font-medium ${theme === "dark" ? "text-card-foreground" : "text-card"}`}
                        >
                            {isSave ? <Loader2 className=" h-4 w-4 animate-spin"/> : "Publish Post"}
                        </Button>
                        <Button onClick={onClose} variant={"outline"}
                                className={`border border-primary text-sm font-medium ${theme === "dark" ? "" : "text-primary"}`}>Cancel</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncement;