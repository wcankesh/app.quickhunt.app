import React, {useEffect, useState, Fragment} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetTitle,} from "../ui/sheet";
import {CalendarIcon, Check, Circle, Pin, X, Loader2} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "../ui/select";
import moment from "moment";
import {useSelector} from "react-redux";
import {useTheme} from "../theme-provider";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Calendar} from "../ui/calendar";
import {toast} from "../ui/use-toast";
import {Badge} from "../ui/badge";
import ReactQuillEditor from "../Comman/ReactQuillEditor";
import {Checkbox} from "../ui/checkbox";
import {ImageUploader} from "../Comman/CommentEditor";
import {apiService} from "../../utils/constent";

const initialState = {
    description: '',
    slug: '',
    title: '',
    publishedAt: moment(new Date()),
    assignToId: [],
    pinTop: 0,
    expiredBoolean: 0,
    expiredAt: undefined,
    categoryId: "",
    labelId: [],
    image: '',
};
const initialStateError = {
    title: "",
    description: "",
    slug: "",
    categoryId: ""
}

const CreateAnnouncement = ({isOpen, onOpen, onClose, getAllPosts, announcementList}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const {theme} = useTheme();

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
                assignToId: [userDetailsReducer.id.toString()],
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
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required.";
                } else {
                    return "";
                }
            case "slug":
                if (!value || value.trim() === "") {
                    return "Permalink / Slug is required.";
                } else {
                    return "";
                }
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
            case "expiredAt":
                if (changeLogDetails.expiredBoolean === 1 && (!value || value === undefined)) {
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
        let updatedDetails = {...changeLogDetails};

        if (name === "title") {
            const trimmedValue = value.trimStart();
            const slug = trimmedValue
                .replace(/[^a-z0-9\s]/gi, '')
                .replace(/\s+/g, '-')
                .toLowerCase();

            updatedDetails = {
                ...updatedDetails,
                title: trimmedValue,
                // Only update slug if it matches the previous auto-generated slug
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

        setChangeLogDetails(updatedDetails);
        setFormError(prev => ({
            ...prev,
            [name]: formValidate(name, updatedDetails[name])
        }));
    };

    const onChangeTextqq = (event) => {
        const {name, value} = event.target;
        let updatedDetails = {...changeLogDetails};
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
                setFormError((formError) => ({
                    ...formError,
                    slug: '',
                    [name]: formValidate(name, value),
                }));
            } else {
                updatedDetails = {
                    ...updatedDetails,
                    title: value,
                };
                setFormError((formError) => ({
                    ...formError,
                    [name]: formValidate(name, value),
                }));
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
    };

    const onChangeCategory = (selectedItems) => {
        const categoryId = selectedItems === "null" ? null : selectedItems;
        setChangeLogDetails({...changeLogDetails, categoryId});
    }

    const commonToggle = (name, value) => {
        setChangeLogDetails({...changeLogDetails, [name]: value})
        if (name === "expiredBoolean") {
            setFormError((formError) => ({
                ...formError,
                expiredAt: formValidate("expiredAt", changeLogDetails.expiredAt)
            }));
        }
    }

    const onDateChange = (name, date) => {
        if (date) {
            const formattedDate = new Date(date);
            let obj = { ...changeLogDetails, [name]: formattedDate };
            if (name === "publishedAt") {
                if (formattedDate > new Date()) {
                    obj = { ...obj, status: 2 };
                } else {
                    obj = { ...obj, status: 1 };
                }
            }
            setChangeLogDetails(obj);
            setFormError((formError) => ({
                ...formError,
                expiredAt: formValidate("expiredAt", formattedDate)
            }));
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
        const expiredAtError = formValidate("expiredAt", changeLogDetails.expiredAt);
        if (expiredAtError) {
            validationErrors.expiredAt = expiredAtError;
        }
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        const isSlugTaken = (announcementList || []).some(x => x.slug === changeLogDetails.slug);
        if (isSlugTaken) {
            toast({description: "The post slug url has already been taken.", variant: "destructive",});
            return;
        }

        if (
            changeLogDetails.expiredBoolean === 1 &&
            !changeLogDetails.expiredAt
        ) {
            changeLogDetails.expiredBoolean = 0;
        }

        setIsSave(true)
        let formData = new FormData();
        formData.append("projectId", projectDetailsReducer.id);
        if (changeLogDetails.title && changeLogDetails.title.length > 250) {
            validationErrors['title'] = "Post title cannot be longer than 250 characters.";
        }
        Object.keys(changeLogDetails).map((x) => {
            if (x !== "labelId") {
                if (x === "assignToId") {
                    formData.append(x, changeLogDetails[x].join());
                } else if (x === "slug") {
                    formData.append("slug", changeLogDetails.slug ? changeLogDetails.slug : changeLogDetails.title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                } else if (x === "publishedAt") {
                    formData.append("publishedAt", moment(changeLogDetails.publishedAt).format("YYYY-MM-DD"));
                } else if (x === "expiredAt") {
                    formData.append("expiredAt", changeLogDetails.expiredBoolean === 1 ? moment(changeLogDetails.expiredAt).format("YYYY-MM-DD") : "");
                } else if (x === "deleteImage" && changeLogDetails?.image?.name) {

                } else if (x === "categoryId") {
                    formData.append("categoryId", "");
                } else {
                    formData.append(x, changeLogDetails[x]);
                }
            }
        })
        for (let i = 0; i < changeLogDetails.labelId.length; i++) {
            formData.append('labelId[]', changeLogDetails.labelId[i]);
        }
        const data = await apiService.createPosts(formData);
        if (data.success) {
            setChangeLogDetails(initialState)
            setIsSave(false)
            await getAllPosts()
            toast({description: data.message,});
        } else {
            setIsSave(false);
            toast({variant: "destructive", description: data.error.message,});
        }
        if (Object.keys(validationErrors).length === 0) {
            onClose("", data.data.data);
        }
    }

    const handleValueChange = (value) => {
        setChangeLogDetails({...changeLogDetails, assignToId: [value]});
    };

    const onChangeLabel = (value) => {
        const clone = [...changeLogDetails.labelId]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setChangeLogDetails({...changeLogDetails, labelId: clone});
    }

    const deleteAssignTo = (e, index) => {e.stopPropagation();}

    const publishDate = changeLogDetails?.publishedAt ? new Date(changeLogDetails.publishedAt) : null;
    const isDateDisabled = (date) => {
        return publishDate && date < publishDate;
    };

    const commInput = [
        {
            title: "Title",
            name: "title",
        },
        {
            title: "Permalink / Slug",
            name: "slug",
        },
    ]

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"pt-6 p-0 lg:max-w-[663px] md:max-w-[720px] sm:max-w-[520px]"}>
                <SheetHeader className={`px-3 py-4 lg:px-8 lg:py-[20px] flex flex-row justify-between items-center border-b space-y-0`}>
                    <SheetTitle className={"text-lg md:text-xl font-medium"}>Create New Announcements</SheetTitle>
                    <div className={"flex items-center gap-6 m-0"}>
                        <Button className={"h-6 w-6 p-0"}
                                onClick={() => commonToggle("pinTop", changeLogDetails.pinTop === 1 ? 0 : 1)}
                                variant={"ghost hover:bg-none"}>{changeLogDetails.pinTop === 1 ?
                            <Pin size={15} className={`${theme === "dark" ? "fill-card-foreground" : "fill-card-foreground"}`}/> : <Pin size={15}/>}
                        </Button>
                        <span className={"max-w-6"}><X onClick={() => onClose(null, null, false)} className={"cursor-pointer"}/></span>
                    </div>
                </SheetHeader>
                <div className={"h-[calc(100vh_-_61px)] overflow-y-auto"}>
                    <div className={"px-3 py-6 lg:px-8 border-b"}>
                        <div className={"flex flex-col gap-6"}>
                            {
                                commInput.map((x, i) => (
                                    <Fragment key={i}>
                                        <div className="w-full flex flex-col gap-2">
                                            <Label htmlFor="title" className={"font-medium after:ml-0.5 after:content-['*'] after:text-destructive"}>{x.title}</Label>
                                            <Input type="text" id={x.name} className={"h-9"} name={x.name} placeholder={`${x.name === "title" ? "Enter your title..." : "Enter your slug url..."}`}
                                                   value={changeLogDetails[x.name]} onChange={onChangeText}/>
                                            {
                                                (x.name === "slug") &&
                                                <p className={"text-sm font-normal text-muted-foreground break-words"}>This
                                                    release will
                                                    be available at {projectDetailsReducer.domain ? <a
                                                        href={`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${changeLogDetails.slug?.toLowerCase()}`}
                                                        target={"_blank"}
                                                        className={"text-primary max-w-[593px] w-full break-words text-sm"}>{`https://${projectDetailsReducer.domain?.toLowerCase()}/announcements/${changeLogDetails[x.name]?.toLowerCase()}`}</a> : ""}</p>
                                            }
                                            {formError[x.name] &&
                                            <span className="text-sm text-destructive">{formError[x.name]}</span>}
                                        </div>
                                    </Fragment>
                                ))
                            }
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="description" className={"font-medium after:ml-0.5 after:content-['*'] after:text-destructive"}>Description</Label>
                                <ReactQuillEditor className={"min-h-[145px] h-full"} value={changeLogDetails.description} onChange={onChangeText}
                                                  name={"description"}/>
                                {formError.description && <span className="text-sm text-destructive">{formError.description}</span>}
                            </div>
                        </div>
                    </div>
                    <div className={"px-3 py-6 lg:px-8 flex flex-col gap-4 border-b"}>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className="flex flex-col w-full gap-2 md:max-w-[288px]">
                                <Label htmlFor="label" className={"font-medium"}>Label</Label>
                                <Select value={[]} onValueChange={onChangeLabel}>
                                    <SelectTrigger className="h-9">
                                        <SelectValue className={"text-muted-foreground text-sm"}>
                                            {
                                                changeLogDetails?.labelId?.length > 0 ? (
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (changeLogDetails.labelId || []).map((x, i) => {
                                                                const findObj = labelList.find((y) => y.id == x);
                                                                return (
                                                                    <Badge key={i} variant={"outline"} style={{
                                                                        color: findObj?.colorCode,
                                                                        borderColor: findObj?.colorCode,
                                                                        textTransform: "capitalize"
                                                                    }}
                                                                           className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-normal text-[${findObj?.colorCode}] border-[${findObj?.colorCode}] capitalize`}>
                                                                        <span className={"max-w-[100px] truncate text-ellipsis overflow-hidden whitespace-nowrap"}>{findObj?.name}</span></Badge>
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
                                                                    {changeLogDetails.labelId.includes(x.id.toString()) ?
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
                            <div className="flex flex-col w-full gap-2 md:max-w-[288px]">
                                <Label htmlFor="label" className={"font-medium"}>Assign to</Label>
                                <Select onValueChange={handleValueChange} value={[]}>
                                    <SelectTrigger className={"h-9"}>
                                        <SelectValue className={"text-muted-foreground text-sm"}>
                                            {
                                                changeLogDetails?.assignToId?.length > 0 ? (
                                                    <div className={"flex gap-[2px]"}>
                                                        {
                                                            (changeLogDetails.assignToId || []).slice(0, 2).map((x, index) => {
                                                                const findObj = memberList.find((y,) => y.userId == x);
                                                                return (
                                                                    <div key={index}
                                                                         className={`${theme === "dark" ? "text-card bg-accent-foreground" : "bg-muted-foreground/30"} text-sm flex gap-[2px] items-center rounded py-0 px-2`}
                                                                         onClick={(e) => deleteAssignTo(e, index)}>
                                                                        {findObj?.firstName ? findObj?.firstName : ''}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        {(changeLogDetails.assignToId || []).length > 2}
                                                    </div>) : (<span className="text-muted-foreground">Select Assign To</span>)
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {(memberList || []).map((x, i) => (
                                                <SelectItem className={"p-2"} key={i} value={x.userId?.toString()}>
                                                    <div className={"flex gap-2"}>
                                                        <div onClick={() => handleValueChange(x.userId.toString())}
                                                             className="checkbox-icon">
                                                            {changeLogDetails.assignToId?.includes(x.userId.toString()) ?
                                                                <Check size={18}/> :
                                                                <div className={"h-[18px] w-[18px]"}/>}
                                                        </div>
                                                        <span>{x.firstName ? x.firstName : ''} {x.lastName ? x.lastName : ''}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                            <div className={"flex flex-col w-full gap-2 md:max-w-[288px]"}>
                                <Label htmlFor="label" className={"font-medium"}>Category</Label>
                                <Select
                                    value={changeLogDetails && changeLogDetails.categoryId && changeLogDetails.categoryId.toString()}
                                    onValueChange={onChangeCategory}>
                                    <SelectTrigger className="h-9">
                                        {changeLogDetails?.categoryId ? (
                                            <SelectValue>
                                                {categoriesList.find(x => x.id.toString() === changeLogDetails.categoryId.toString())?.name}
                                            </SelectValue>
                                        ) : (
                                            <span className="text-muted-foreground">Select a category</span>
                                        )}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                (categoriesList || []).map((x, i) => {
                                                    return (
                                                        <SelectItem key={i} value={x.id.toString()}>{x.title}</SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full gap-2 md:max-w-[288px]">
                                <Label htmlFor="date" className={"font-medium"}>Published at</Label>
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={"justify-between hover:bg-card text-left font-normal d-flex px-3 h-9 text-muted-foreground hover:text-muted-foreground bg-card"}
                                        >
                                            {changeLogDetails.publishedAt
                                                ? moment(changeLogDetails.publishedAt).format("LL")
                                                : "Select Date"}
                                            <CalendarIcon className="mr-2 h-4 w-4"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                        <Calendar className={"pointer-events-auto"}
                                            mode="single"
                                            captionLayout="dropdown"
                                            showOutsideDays={false}
                                            selected={changeLogDetails.publishedAt ? new Date(changeLogDetails.publishedAt) : new Date()}
                                            onSelect={(date) => onDateChange("publishedAt", date)}
                                            startMonth={new Date(2024, 0)}
                                            endMonth={new Date(2050, 12)}
                                            hideNavigation
                                              defaultMonth={
                                                  changeLogDetails.publishedAt
                                                      ? new Date(changeLogDetails.publishedAt)
                                                      : new Date()
                                              }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className={"flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                        <div className={"flex flex-col gap-2 w-full md:max-w-[288px]"}>
                            <div className={"flex items-center gap-3"}>
                                <Checkbox id={"expire_date"}
                                          checked={changeLogDetails.expiredBoolean === 1}
                                          onCheckedChange={(checked) => commonToggle("expiredBoolean",checked === true ? 1 : 0)}/>
                                <label htmlFor={"expire_date"} className={`text-sm font-medium ${changeLogDetails.expiredBoolean === 1 ? "after:ml-0.5 after:content-['*'] after:text-destructive" : ""}`}>Expire At</label>
                            </div>

                            {
                                changeLogDetails.expiredBoolean === 1 ?
                                    <div className="grid w-full gap-2 basis-1/2">
                                        <Popover open={popoverOpenExpired} onOpenChange={setPopoverOpenExpired}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={"justify-between hover:bg-card text-left font-normal d-flex text-muted-foreground hover:text-muted-foreground bg-card"}
                                                >
                                                    {/*{moment(changeLogDetails.expiredAt).format("LL")}*/}
                                                    {changeLogDetails?.expiredAt
                                                        ? moment(changeLogDetails.expiredAt).format("LL")
                                                        : "Select Expiration Date"}
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                                                <Calendar className={"pointer-events-auto"}
                                                          mode="single"
                                                          showOutsideDays={false}
                                                          captionLayout="dropdown"
                                                          selected={changeLogDetails?.expiredAt ? new Date(changeLogDetails.expiredAt) : null}
                                                          onSelect={(date) => onDateChange("expiredAt", date)}
                                                          endMonth={new Date(2050, 12)}
                                                          startMonth={publishDate || new Date()}
                                                          disabled={isDateDisabled}
                                                          hideNavigation
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        {formError.expiredAt && <span className="text-sm text-destructive">{formError.expiredAt}</span>}
                                    </div> : ""
                            }
                        </div>
                        </div>
                    </div>
                    <div className={"px-3 lg:px-8 flex flex-wrap items-center gap-4 md:flex-nowrap border-b py-6"}>
                        <div className={"space-y-1.5"}>
                            <Label className={"font-medium"}>Featured Image</Label>
                            <div className="w-[282px] h-[128px] flex gap-1">
                                <ImageUploader
                                    stateDetails={changeLogDetails}
                                    onDeleteImg={onDeleteImg}
                                    handleFileChange={handleFileChange}
                                />
                            </div>
                            {formError.image && <div className={"text-xs text-destructive"}>{formError.image}</div>}
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
                        <Button onClick={() => onClose(null, null, false)} variant={"outline"}
                                className={`border border-primary text-sm font-medium ${theme === "dark" ? "" : "text-primary"}`}>Cancel</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncement;