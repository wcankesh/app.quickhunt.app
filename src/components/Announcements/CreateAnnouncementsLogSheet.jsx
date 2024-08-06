import React, { useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader, SheetOverlay,} from "../ui/sheet";
import {Separator} from "../ui/separator";
import {CalendarIcon, Check, Circle, Pin, X, Loader2} from "lucide-react";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
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
 //post_status: 1=Publish/active,2=Scheduled/unpublished,3=Draft,4=Expired
const initialState = {
    post_description:'',
    post_slug_url:'',
    post_title: '',
    post_published_at: moment(new Date()),
    post_assign_to: [],
    post_pin_to_top: 0,
    post_expired_boolean: 0,
    post_expired_at: undefined,
    post_browser: '',
    post_ip_address: '',
    category_id: '',
    labels: [],
    image:'',
};
const initialStateError = {
    post_title: "",
    post_description: "",
    post_slug_url: "",
}

const CreateAnnouncementsLogSheet = ({isOpen, onOpen, onClose,selectedRecord}) => {
    const [previewImage,setPreviewImage] = useState("");
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [changeLogDetails, setChangeLogDetails] = useState(initialState);
    const [labelList, setLabelList] = useState([]);
    const [memberList, setMemberList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [isSave, setIsSave] = useState(false)
    const [formError, setFormError] = useState(initialStateError);
    const {theme} = useTheme();
    let apiService = new ApiService();
    useEffect(()=>{
        if(selectedRecord?.post_slug_url){
             getSinglePosts();
        }
        setLabelList(allStatusAndTypes.labels);
        setMemberList(allStatusAndTypes.members);
        setCategoriesList(allStatusAndTypes.categories);
    },[projectDetailsReducer.id,allStatusAndTypes])

    const getSinglePosts = () => {
        const labelId = selectedRecord.labels.map(x => x?.id?.toString());
        setChangeLogDetails({
            ...selectedRecord,
            image: selectedRecord.feature_image,
            post_assign_to: selectedRecord.post_assign_to !== null ? selectedRecord.post_assign_to.split(',') : [],
            post_published_at: selectedRecord.post_published_at ? moment(selectedRecord.post_published_at).format('YYYY-MM-DD') : moment(new Date()),
            post_expired_at: selectedRecord.post_expired_at ? moment(selectedRecord.post_expired_at).format('YYYY-MM-DD') : undefined,
            category_id: selectedRecord.category_id == "0" ? "" : selectedRecord.category_id,
            labels: labelId
        });
        setPreviewImage(selectedRecord.feature_image);
    }

    const handleFileChange = (file) => {
        setChangeLogDetails({...changeLogDetails, image : file.target.files[0]});
        setPreviewImage(URL.createObjectURL(file.target.files[0]));
    };

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
            default: {
                return "";
            }
        }
    };

    const onChangeText = (event) => {
        if(event.target.name === "post_title"){
            setChangeLogDetails({...changeLogDetails, [event.target.name]: event.target.value, post_slug_url: event.target.value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase()})
        } else if(event.target.name === "post_slug_url"){
            setChangeLogDetails({...changeLogDetails, post_slug_url: event.target.value.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase()})
        }else {
            setChangeLogDetails({...changeLogDetails, [event.target.name]: event.target.value})
        }

        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }
    const onChangeCategory = (selectedItems ) =>{
        setChangeLogDetails({...changeLogDetails, category_id: selectedItems})
    }

    const onDateChange = (name, date) => {
        if (date) {
            let obj = {...changeLogDetails,[name]: date};
            if(name === "post_published_at"){
                if(date > new Date()){
                    obj = {...obj, post_status: 2}
                }
            }
            setChangeLogDetails(obj);
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
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true)
        let formData = new FormData();
        formData.append("post_project_id",projectDetailsReducer.id);
        Object.keys(changeLogDetails).map((x) => {
            if(x !== "labels"){
                if(x === "post_assign_to"){
                    formData.append(x ,changeLogDetails[x].join());
                } else if(x === "post_slug_url"){
                    formData.append("post_slug_url",changeLogDetails.post_slug_url ? changeLogDetails.post_slug_url : changeLogDetails.post_title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                } else if(x === "post_published_at"){
                    formData.append("post_published_at",moment(changeLogDetails.post_published_at).format("YYYY-MM-DD") );
                } else if(x === "post_expired_at"){
                    formData.append("post_expired_at",changeLogDetails.post_expired_boolean === 1 ? moment(changeLogDetails.post_expired_at).format("YYYY-MM-DD") : "");
                } else {
                    formData.append(x,changeLogDetails[x]);
                }
            }
        })
        for (var i = 0; i < changeLogDetails.labels.length; i++) {
            formData.append('labels[]', changeLogDetails.labels[i]);
        }
        const data = await apiService.createPosts(formData);
        if(data.status === 200){
            setChangeLogDetails(initialState)
            setIsSave(false)
            toast({
                description: "Announcement created successfully",
            });
        } else {
            setIsSave(false);
            toast({
                description: data.message,
                variant: "destructive",
            });
        }
        onClose("",data.data);
    }

    const updatePost = async () => {
        let validationErrors = {};
        Object.keys(changeLogDetails).forEach(name => {
            const error = formValidate(name, changeLogDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        setIsSave(true)
        let formData = new FormData();
        formData.append("post_project_id",projectDetailsReducer.id);
        Object.keys(changeLogDetails).map((x) => {
            if(x !== "labels"){
                if(x === "post_assign_to"){
                    formData.append(x ,changeLogDetails[x].join());
                } else if(x === "post_slug_url"){
                    formData.append("post_slug_url",changeLogDetails.post_slug_url ? changeLogDetails.post_slug_url : changeLogDetails.post_title.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').replace(/\//g, "-").toLowerCase());
                } else if(x === "post_published_at"){
                    formData.append("post_published_at",moment(changeLogDetails.post_published_at).format("YYYY-MM-DD") );
                } else if(x === "post_expired_at"){
                    formData.append("post_expired_at",changeLogDetails.post_expired_boolean === 1 ? moment(changeLogDetails.post_expired_at).format("YYYY-MM-DD") : "");
                } else {
                    formData.append(x,changeLogDetails[x]);
                }
            }

        })

        for (var i = 0; i < changeLogDetails.labels.length; i++) {
            formData.append('labels[]', changeLogDetails.labels[i]);
        }

        const data = await apiService.updatePosts(formData, changeLogDetails.id)
        if(data.status === 200){
          //  message.success("Post update successfully")
            setChangeLogDetails(initialState)
            setIsSave(false)
            toast({
                description: "Announcement updated successfully",
            });

        } else {
            setIsSave(false)
            toast({
                description: data.message,
                variant: "destructive"
            });
        }
        onClose(data.data);
    }

    const handleValueChange = (value) => {
        const clone = [...changeLogDetails.post_assign_to]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setChangeLogDetails({...changeLogDetails,post_assign_to: clone});
    };

    const onChangeLabel = (value) => {
        const clone = [...changeLogDetails.labels]
        const index = clone.indexOf(value);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(value);
        }
        setChangeLogDetails({...changeLogDetails,labels: clone});
    }

    const deleteAssignTo = (e,index)=> {
        e.stopPropagation();
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetOverlay className={"inset-0"} />
            <SheetContent className={"pt-6 p-0 lg:max-w-[663px] md:max-w-[720px] sm:max-w-[520px]"}>
                    <SheetHeader className={`px-3 py-4 lg:px-8 lg:py-6 flex flex-row justify-between items-center sticky top-0 z-10 border-b`}>
                        <h5 className={"text-sm md:text-xl font-medium"}>{ selectedRecord?.post_slug_url ? "Update Announcement" :"Create New Announcements"}</h5>
                        <div className={"flex items-center gap-6 m-0"}>
                            <Button className={"h-5 w-5 p-0"} onClick={() => onChangeText({target:{name: "post_pin_to_top", value: changeLogDetails.post_pin_to_top === 1 ? 0 : 1}}) } variant={"ghost"} >{changeLogDetails.post_pin_to_top === 1 ? <Pin fill={"bg-card-foreground"} className={"h-4 w-4"}  size={18}/> : <Pin className={"h-4 w-4"}  size={18}/>}</Button>
                            <Button className={"h-5 w-5 p-0"} onClick={onClose}  variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                        </div>
                    </SheetHeader>
                <div className={"side-sheet-height overflow-y-auto"}>
                <div className={"px-3 lg:px-8 border-b py-6"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" className={"h-9"} name={"post_title"} value={changeLogDetails.post_title} onChange={onChangeText}/>
                            {formError.post_title && <span className="text-sm text-red-500">{formError.post_title}</span>}
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="link">Permalink / Slug</Label>
                            <Input type="text" className={"h-9"} id="link" name={"post_slug_url"} value={changeLogDetails.post_slug_url} onChange={onChangeText}/>
                            <p className={"text-sm font-normal text-muted-foreground"}>This release will be available at {projectDetailsReducer.domain ? <a
                                href={`https://${projectDetailsReducer.domain}/announcements/${changeLogDetails.post_slug_url}`}
                                target={"_blank"}
                                className={"text-primary text-sm"}>{`https://${projectDetailsReducer.domain}/announcements/${changeLogDetails.post_slug_url}`}</a> : ""}</p>
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea className={`min-h-[100px]`} type="text" id="description" placeholder={"Start writing..."} name={"post_description"} value={changeLogDetails.post_description} onChange={onChangeText}/>
                            {formError.post_description && <span className="text-sm text-red-500">{formError.post_description}</span>}
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col gap-4 border-b py-6"}>
                    <div className={"px-3 lg:px-8 flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                        <div className="grid w-full gap-2 md:basis-1/2">
                            <Label htmlFor="label">Label</Label>
                            <Select  value={[]} onValueChange={onChangeLabel}>
                                <SelectTrigger className="h-9">
                                    <SelectValue className={"text-muted-foreground text-sm"} placeholder="Nothing selected">
                                        <div className={"flex gap-[2px]"}>
                                            {
                                                (changeLogDetails.labels || []).slice(0,2).map((x)=>{
                                                    const findObj = labelList.find((y) => y.id == x);
                                                    return(
                                                        <Badge variant={"outline"} style={{
                                                            color: findObj?.label_color_code,
                                                            borderColor: findObj?.label_color_code,
                                                            textTransform: "capitalize"
                                                        }}
                                                               className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${findObj?.label_color_code}] border-[${findObj?.label_color_code}] capitalize`}>{findObj?.label_name}</Badge>
                                                    )
                                                })
                                            }
                                            {(changeLogDetails.labels || []).length > 2 && <div>...</div>}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            (labelList || []).map((x, i) => {
                                                return (
                                                        <SelectItem className={"p-2"} key={i} value={x.id.toString()}>
                                                            <div className={"flex gap-1"}>
                                                                <div onClick={() => onChangeLabel(x.id.toString())} className="checkbox-icon">
                                                                    {changeLogDetails.labels.includes(x.id.toString()) ? <Check size={18} />: <div className={"h-[18px] w-[18px]"}></div>}
                                                                </div>
                                                                <div className={"flex items-center gap-2"}>
                                                                    <Circle fill={x.label_color_code} stroke={x.label_color_code} className={`${theme === "dark" ? "" : "text-muted-foreground"} w-[10px] h-[10px]`}/>
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
                        <div className="grid w-full gap-2 md:basis-1/2">
                            <Label htmlFor="label">Assign to</Label>
                            <Select onValueChange={handleValueChange} value={[]}>
                                <SelectTrigger className={"h-9"}>
                                    <SelectValue className={"text-muted-foreground text-sm"} placeholder="Assign to">
                                        <div className={"flex gap-[2px]"}>
                                            {
                                                (changeLogDetails.post_assign_to || []).slice(0,2).map((x,index)=>{
                                                    const findObj = memberList.find((y,) => y.user_id == x);
                                                    return(
                                                        <div key={index} className={"text-sm flex gap-[2px] bg-slate-300 items-center rounded py-0 px-2"} onClick={(e)=>deleteAssignTo(e,index)}>
                                                            {findObj.user_first_name ? findObj.user_first_name : ''}
                                                        </div>
                                                    )
                                                })
                                            }
                                            {(changeLogDetails.post_assign_to || []).length > 2 && <div>...</div>}
                                        </div>
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup >
                                        {(memberList || []).map((x, i) => (
                                            <SelectItem className={"p-2"} key={i} value={x.user_id.toString()}>
                                                <div className={"flex gap-2"}>
                                                    <div onClick={() => handleValueChange(x.user_id.toString())} className="checkbox-icon">
                                                        {changeLogDetails.post_assign_to.includes(x.user_id.toString()) ? <Check size={18} />: <div className={"h-[18px] w-[18px]"}></div>}
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
                    <div className={"px-3 lg:px-8 flex flex-wrap md:flex-nowrap gap-4 items-start"}>
                        <div className={"grid w-full gap-2 md:basis-1/2"}>
                            <Label htmlFor="label">Category</Label>
                            <Select value={changeLogDetails && changeLogDetails.category_id && changeLogDetails.category_id.toString()} onValueChange={onChangeCategory}>
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Category"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
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
                            <Label htmlFor="date">Published at</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn("justify-between text-left font-normal d-flex", "text-muted-foreground")}
                                    >
                                        {moment(changeLogDetails.post_published_at).format("LL")}
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={changeLogDetails.post_published_at}
                                        onSelect={(date) => onDateChange("post_published_at", date)}
                                        captionLayout="dropdown-buttons" fromYear={2024} toYear={2050}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <div className={"px-3 lg:px-8 flex flex-wrap items-center gap-4 md:flex-nowrap border-b py-6"}>
                    <div className={"space-y-3"}>
                        <h5 className={"text-sm font-medium"}>Featured Image</h5>
                        <div>
                            <label
                                htmlFor="upload_image"
                                className="flex w-[250px] md:w-[282px] h-[128px] py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
                            >
                                {previewImage ? <img className={"h-[70px] w-[70px] rounded-md object-cover"} src={previewImage} alt={"not_found"} /> : <span className="text-center text-muted-foreground font-semibold text-[14px]">Upload Image</span>}
                                <input
                                    id="upload_image"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>
                        <div className={"flex flex-col gap-[18px]"}>
                            <div className={"announce-create-switch flex gap-6"}>
                                <Switch className={"w-[38px] h-[20px]"}  checked={changeLogDetails.post_expired_boolean ===  1} onCheckedChange={(checked)=>onChangeText({target:{name: "post_expired_boolean", value: checked === true ? 1 : 0}})} />
                                <p className={"text-sm text-muted-foreground font-medium"}>Expire At</p>
                            </div>

                            {
                                changeLogDetails.post_expired_boolean ===  1 ?  <div className="grid w-full gap-2 basis-1/2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="date"
                                                variant={"outline"}
                                                className={cn("justify-between text-left font-normal d-flex", "text-muted-foreground")}
                                            >
                                                {moment(changeLogDetails.post_expired_at).format("LL")}
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={changeLogDetails.post_expired_at}
                                                onSelect={(date) => onDateChange("post_expired_at", date)}
                                                captionLayout="dropdown-buttons" fromYear={2024} toYear={2050}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div> : ""
                            }

                        </div>
                </div>
                <div className={"p-3 lg:p-8 flex flex-row gap-4"}>
                    <Button
                        variant={"outline "}
                        disabled={isSave}
                        onClick={selectedRecord?.post_slug_url ? updatePost : createPosts}
                        className={` bg-primary ${theme === "dark" ? "text-card-foreground" : "text-card"} font-semibold`}
                    >
                        { isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : selectedRecord?.post_slug_url ? "Update Post" : "Publish Post"}
                    </Button>
                    <Button onClick={onClose} variant={"outline "}
                            className={"border border-primary text-primary text-sm font-semibold"}>Cancel</Button>
                </div>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncementsLogSheet;