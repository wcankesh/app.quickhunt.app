import React, { useEffect, useState} from 'react';
import {Sheet, SheetContent, SheetHeader,} from "../ui/sheet";
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

const initialState = {
    post_description:'',
    post_slug_url:'',
    post_title: '',
    post_save_as_draft: 0,
    post_published_at: moment(new Date()),
    post_assign_to: [],
    post_pin_to_top: 0,
    post_override_url_boolean: 0,
    post_override_url: '',
    post_expired_boolean: 0,
    post_expired_datetime: undefined,
    post_override_thumbnail_boolean: 0,
    post_override_thumbnail: '',
    post_nodify_customer: 0,
    post_browser: '',
    post_ip_address: '',
    category_id: '',
    labels: [],
    image:'',
};
const initialStateError = {
    post_title: "",
    post_description: "",
}

const CreateAnnouncementsLogSheet = ({isOpen, onOpen, onClose,callBack,selectedRecord}) => {
    const [previewImage,setPreviewImage] = useState("");
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const userDetailsReducer = useSelector(state => state.userDetailsReducer);
    const [changeLogDetails, setChangeLogDetails] = useState(initialState);
    const [labelList, setLabelList] = useState([]);
    const [convertedContent, setConvertedContent] = useState(null);
    const [memberList, setMemberList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])
    const [isSave, setIsSave] = useState(false)
    const [formError, setFormError] = useState(initialStateError);
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const {theme} = useTheme();
    let apiService = new ApiService();

    console.log(labelList,"labelList");

    useEffect(()=>{
        if(selectedRecord?.post_slug_url){
            getSinglePosts();
        }
        setLabelList(allStatusAndTypes.labels);
        setMemberList(allStatusAndTypes.members);
        setCategoriesList(allStatusAndTypes.categories);
    },[])
    console.log(changeLogDetails.post_assign_to,"changeLogDetails.post_assign_to");

    const getSinglePosts = async () => {
        const data = await apiService.getSinglePosts(selectedRecord?.post_slug_url)
        if(data.status === 200){
            setChangeLogDetails({
                ...data.data,
                image: data.data.feature_image,
                post_assign_to: data.data.post_assign_to !== null ? data.data.post_assign_to.split(',') : [],
                post_published_at: data.data.post_published_at ? moment(data.data.post_published_at).format('YYYY-MM-DD') : moment(new Date()),
                post_expired_datetime: data.data.post_expired_datetime ? moment(data.data.post_expired_datetime).format('YYYY-MM-DD') : undefined,
                category_id: data.data.category_id == "0" ? "" : data.data.category_id,
            })
            setConvertedContent(data.data.post_description);
            setPreviewImage(data.data.feature_image);
        } else {

        }
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
            setChangeLogDetails({...changeLogDetails, [event.target.name]: event.target.value, post_slug_url: event.target.value.replace(/ /g,"-").replace(/\?/g, "-")})
        } else if(event.target.name === "post_slug_url"){

            setChangeLogDetails({...changeLogDetails, post_slug_url: event.target.value.replace(/ /g,"-").replace(/\?/g, "-")})
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
            setChangeLogDetails({...changeLogDetails,[name]: date});
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
        formData.append("post_title",changeLogDetails.post_title);
        formData.append("post_assign_to",changeLogDetails.post_assign_to.join());
        formData.append("post_slug_url",changeLogDetails.post_slug_url ? changeLogDetails.post_slug_url : changeLogDetails.post_title.replace(/ /g,"-").replace(/\?/g, "-"));
        formData.append("post_published_at",moment(changeLogDetails.post_published_at).format("YYYY-MM-DD"));
        formData.append("post_save_as_draft",changeLogDetails.post_save_as_draft );
        formData.append("post_pin_to_top",changeLogDetails.post_pin_to_top );
        formData.append("post_override_url_boolean",changeLogDetails.post_override_url_boolean );
        formData.append("post_override_url",changeLogDetails.post_override_url );
        formData.append("post_expired_boolean",changeLogDetails.post_expired_boolean );
        formData.append("post_expired_datetime",changeLogDetails.post_expired_boolean === 1 ? moment(changeLogDetails.post_expired_datetime).format("YYYY-MM-DD") : "" );
        formData.append("post_override_thumbnail_boolean",changeLogDetails.post_override_thumbnail_boolean);
        formData.append("post_override_thumbnail",changeLogDetails.post_override_thumbnail );
        formData.append("post_nodify_customer",changeLogDetails.post_nodify_customer );
        formData.append("post_browser",changeLogDetails.post_browser );
        formData.append("post_ip_address",changeLogDetails.post_ip_address );
        formData.append("category_id",changeLogDetails.category_id);
        for (var i = 0; i < changeLogDetails.labels.length; i++) {
            formData.append('labels[]', changeLogDetails.labels[i]);
        }
        formData.append("post_description", changeLogDetails.post_description);
        formData.append("image", changeLogDetails.image);
        const data = await apiService.createPosts(formData);
        if(data.status === 200){
            setChangeLogDetails(initialState)
            setConvertedContent(null)
            setIsSave(false)
            toast({
                title: "Announcement created successfully",
            });
        } else {
            setIsSave(false)
        }
        callBack(changeLogDetails, "isCreate");
        onClose();
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
        formData.append("post_title",changeLogDetails.post_title);
        formData.append("post_assign_to",changeLogDetails.post_assign_to.join());
        formData.append("post_slug_url",changeLogDetails.post_slug_url ? changeLogDetails.post_slug_url : changeLogDetails.post_title.replace(/ /g,"-").replace(/\?/g, "-"));
        formData.append("post_published_at",moment(changeLogDetails.post_published_at).format("YYYY-MM-DD") );
        formData.append("post_save_as_draft",changeLogDetails.post_save_as_draft );
        formData.append("post_pin_to_top",changeLogDetails.post_pin_to_top);
        formData.append("post_override_url_boolean",changeLogDetails.post_override_url_boolean);
        formData.append("post_override_url",changeLogDetails.post_override_url);
        formData.append("post_expired_boolean",changeLogDetails.post_expired_boolean);
        formData.append("post_expired_datetime",changeLogDetails.post_expired_boolean === 1 ? moment(changeLogDetails.post_expired_datetime).format("YYYY-MM-DD") : "");
        formData.append("post_override_thumbnail_boolean",changeLogDetails.post_override_thumbnail_boolean);
        formData.append("post_override_thumbnail",changeLogDetails.post_override_thumbnail);
        formData.append("post_nodify_customer",changeLogDetails.post_nodify_customer);
        formData.append("post_browser",changeLogDetails.post_browser);
        formData.append("post_ip_address",changeLogDetails.post_ip_address)
        formData.append("category_id",changeLogDetails.category_id)
        for (var i = 0; i < changeLogDetails.labels.length; i++) {
            formData.append('labels[]', changeLogDetails.labels[i]);
        }
        formData.append("post_description", changeLogDetails.post_description);
        formData.append("image", changeLogDetails.image);
        const data = await apiService.updatePosts(formData, changeLogDetails.id)
        if(data.status === 200){
          //  message.success("Post update successfully")
            setChangeLogDetails(initialState)
            setConvertedContent(null)
            setIsSave(false)
            toast({
                title: "Announcement updated successfully",
            });

        } else {
            setIsSave(false)
            toast({
                title: "Uh oh! Something went wrong.",
                variant: "destructive"
            });
        }
        // callBack({}, "isUpdate");
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
        console.log("delete",index);
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
            <SheetContent className={"pt-[24px] p-0 overflow-y-scroll lg:max-w-[663px] md:max-w-[720px] sm:max-w-[520px]"}>
                <SheetHeader className={"px-8 py-6 flex flex-row justify-between items-center"}>
                    <h5 className={"text-xl font-medium leading-5"}>{ selectedRecord?.post_slug_url ? "Update Announcement" :"Create New Announcements"}</h5>
                    <div className={"flex items-center gap-6"}>
                        <Button className={"h-5 w-5 p-0"} onClick={() => onChangeText({target:{name: "post_pin_to_top", value: changeLogDetails.post_pin_to_top === 1 ? 0 : 1}}) } variant={"ghost"} >{changeLogDetails.post_pin_to_top === 1 ? <Pin fill={"bg-card-foreground"} className={"h-4 w-4"}  size={18}/> : <Pin className={"h-4 w-4"}  size={18}/>}</Button>
                        <Button className={"h-5 w-5 p-0"} onClick={onClose}  variant={"ghost"}><X size={18} className={"h-5 w-5"}/></Button>
                    </div>
                </SheetHeader>
                <Separator className={"mb-6"}/>
                <div className={"px-8"}>
                    <div className={"flex flex-col gap-6"}>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input type="text" id="title" className={"h-9"} name={"post_title"} value={changeLogDetails.post_title} onChange={onChangeText}/>
                            {formError.post_title && <span className="text-sm text-red-500">{formError.post_title}</span>}
                        </div>
                        <div className="grid w-full gap-2">
                            <Label className={"text-[14px] text=[#0F172A]"} htmlFor="link">Permalink / Slug</Label>
                            <Input type="text" className={"h-9"} id="link" name={"post_slug_url"} value={changeLogDetails.post_slug_url} onChange={onChangeText}/>
                            <p className={"text-[14px] font-normal leading-5"}>This release will be available at {changeLogDetails.fullDomain ? <a
                                href={`${changeLogDetails.fullDomain}/${changeLogDetails.post_slug_url}`}
                                target={"_blank"}
                                className={"text-violet-600 text-[14px]"}>{`${changeLogDetails.fullDomain}/${changeLogDetails.post_slug_url}`}</a> : ""}</p>
                        </div>
                        <div className="grid w-full gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea className={`min-h-[100px]`} type="text" id="description" placeholder={"Start writing..."} name={"post_description"} value={changeLogDetails.post_description} onChange={onChangeText}/>
                            {formError.post_description && <span className="text-sm text-red-500">{formError.post_description}</span>}
                        </div>
                    </div>
                </div>
                <Separator className={"my-6"}/>
                <div className={"flex flex-col gap-4"}>
                    <div className={"px-8 flex flex-row gap-4 items-start"}>
                        <div className="grid w-full gap-2 basis-1/2">
                            <Label htmlFor="label">Label</Label>
                            <Select   value={selectedLabels} onValueChange={onChangeLabel}>
                                <SelectTrigger className="h-9">
                                    <SelectValue className={"text-muted-foreground text-sm"} placeholder="Nothing selected">
                                        <div className={"flex gap-[2px]"}>
                                            {
                                                (changeLogDetails.labels || []).slice(0,2).map((x)=>{
                                                    const findObj = labelList.find((y) => y.id == x);
                                                    return(
                                                        <Badge variant={"outline"} style={{
                                                            color: findObj.label_color_code,
                                                            borderColor: findObj.label_color_code,
                                                            textTransform: "capitalize"
                                                        }}
                                                               className={`h-[20px] py-0 px-2 text-xs rounded-[5px]  font-medium text-[${findObj.label_color_code}] border-[${findObj.label_color_code}] capitalize`}>{findObj.label_name}</Badge>
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
                                                        <SelectItem key={i} value={x.id.toString()}>
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
                        <div className="grid w-full gap-2 basis-1/2">
                            <Label htmlFor="label">Assign to</Label>
                            <Select value={selectedValues} onValueChange={handleValueChange}>
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
                                    <SelectGroup>
                                        {(memberList || []).map((x, i) => (
                                            <SelectItem className={""} key={i} value={x.user_id.toString()}>
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
                    <div className={"px-8 flex flex-row gap-4 items-start"}>
                        <div className={"grid w-full gap-2 basis-1/2"}>
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
                        <div className="grid w-full gap-2 basis-1/2">
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
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                <Separator className={"my-6"}/>
                <div className={"px-8"}>
                    <h5 className={"mb-3 text-[14px] font-medium leading-5"}>Featured Image</h5>
                    <div className={"flex  gap-4 "}>
                        <div className="flex basis-1/2 items-center justify-center">
                                <label
                                    htmlFor="upload_image"
                                    className="flex w-[282px] h-[128px] py-0 justify-center items-center flex-shrink-0 border-dashed border-[1px] border-gray-300 rounded cursor-pointer"
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
                        <div className={"flex basis-1/2 flex-col gap-[18px]"}>
                            <div className={"flex gap-6"}>
                                <Switch disabled={userDetailsReducer.plan == 0} checked={changeLogDetails.post_nodify_customer ===  1} onCheckedChange={(checked)=>onChangeText({target:{name: "post_nodify_customer", value: checked === true ? 1 : 0}})} />
                                <p className={"text-[14px] non-italic font-medium"}>Notify Customers</p>
                            </div>
                            <div className={"flex gap-6"}>
                                <Switch checked={changeLogDetails.post_save_as_draft ===  1} onCheckedChange={(checked)=>onChangeText({target:{name: "post_save_as_draft", value: checked === true ? 1 : 0}})} />
                                <p className={"text-[14px] non-italic font-medium"}>Save as Draft</p>
                            </div>
                            <div className={"flex gap-6"}>
                                <Switch disabled={userDetailsReducer.plan == 0} checked={changeLogDetails.post_expired_boolean ===  1} onCheckedChange={(checked)=>onChangeText({target:{name: "post_expired_boolean", value: checked === true ? 1 : 0}})} />
                                <p className={"text-[14px] non-italic font-medium"}>Expire At</p>
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
                                                {moment(changeLogDetails.post_expired_datetime).format("LL")}
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={changeLogDetails.post_expired_datetime}
                                                onSelect={(date) => onDateChange("post_expired_datetime", date)}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div> : ""
                            }

                        </div>
                    </div>
                </div>
                <Separator className={"my-6"}/>
                <div className={"pt-2 pb-8 px-8 flex flex-row gap-4 flex-wrap"}>
                    <Button variant={"outline "} disabled={isSave}  onClick={selectedRecord?.post_slug_url ? updatePost : createPosts} className={"bg-violet-600 text-[#fff]"}>
                        { isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : selectedRecord?.post_slug_url ? "Update Post" : "Publish Post"}
                    </Button>
                    <Button onClick={onClose} variant={"outline "}
                            className={"rounded-md border border-violet-600 text-violet-600 text-[14px] font-semibold"}>Cancel</Button>
                </div>
            </SheetContent>
        </Sheet>

    );
};

export default CreateAnnouncementsLogSheet;