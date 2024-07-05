import React, {useRef, useState, Fragment, useEffect} from 'react';
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {useNavigate} from "react-router";
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {baseUrl, urlParams} from "../../utils/constent";
import moment from "moment";
import {X} from "lucide-react";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import {useTheme} from "../theme-provider";
import {Sheet, SheetContent, SheetHeader,} from "../ui/sheet";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Textarea} from "../ui/textarea";
import {Switch} from "../ui/switch";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "../ui/tabs";
import {Card} from "../ui/card";
import {useToast} from "../ui/use-toast";

const initialState = {
    title: "",
    images: [],
    topic: [],
    project_id: "",
    description: null,
}

const initialStateError = {
    title: "",
    description: null,

}

const CreateIdea = ({
                        isOpen,
                        onOpen,
                        onClose,
                        isCreateIdea,
                        setIsCreateIdea,
                        ideasList,
                        setIdeasList,
                        isRoadmap,
                        selectedRoadmap,
                        setNoStatus,
                        roadmapList,
                        setRoadmapList,
                        isNoStatus,
                        setIsNoStatus,
                        setSelectedIdea,
                        selectedIdea
                    }) => {
    const { theme } = useTheme()
    let navigate = useNavigate();
    let apiSerVice = new ApiService();
    const { toast } = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const editor = useRef(null);
    const [ideaDetail, setIdeaDetail] = useState(initialState);
    const [topicLists, setTopicLists] = useState([]);
    const [description, setDescription] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [formError, setFormError] = useState(initialStateError);
    const [roadmapStatus, setRoadmapStatus] = useState([]);
    const [isLoadingSidebar, setIsLoadingSidebar] = useState('');
    const [isEditIdea, setIsEditIdea] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleStatusChange = (event) => {setSelectedStatus(event.target.value);};

    const handleRemoveImage = () => {setSelectedFile(null);setImagePreview(null);};

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        setTopicLists(allStatusAndTypes.topics)
        setRoadmapStatus(allStatusAndTypes.roadmap_status)
    }, [projectDetailsReducer.id, allStatusAndTypes]);

    const handleUpdate = (event) => {
        const { value } = event.target;

        setDescription(value);
        setIdeaDetail(ideaDetail => ({...ideaDetail, description: value}));

        setFormError(formError => ({
            ...formError,
            description: formValidate("description", value)
        }));
    };

    const handleChange = (tag, checked) => {
        const clone = [...ideaDetail.topic];
        const nextSelectedTags = checked ? [...clone, tag] : clone.filter(t => t !== tag);
        setIdeaDetail({...ideaDetail, topic:nextSelectedTags})
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const beforeUpload = (file, files) => {
        setIdeaDetail({...ideaDetail, images: [...ideaDetail.images, ...files]})
    }

    const onChangeText = (event) => {
        setIdeaDetail(ideaDetail => ({...ideaDetail, [event.target.name]:event.target.value}))
        setFormError(formError => ({
            ...formError,
            [event.target.name]: formValidate(event.target.name, event.target.value)
        }));
    }

    const onCreateIdea = async () => {
        let validationErrors = {};
        Object.keys(ideaDetail).forEach(name => {
            const error = formValidate(name, ideaDetail[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        setIsLoading(true)
        let formData = new FormData();
        formData.append('title', ideaDetail.title);
        formData.append('slug_url', ideaDetail.title ? ideaDetail.title.replace(/ /g,"-").replace(/\?/g, "-") :"");
        formData.append('description', description);
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('topic', ideaDetail.topic.join());
        formData.append('roadmap_id', selectedRoadmap && selectedRoadmap.id ? selectedRoadmap.id : "");
        formData.append('images[]', selectedFile);
        const data = await apiSerVice.createIdea(formData)
        if(data.status === 200){
            const clone = [...ideasList];
            const newArray = [data.data].concat(clone)
            setIdeasList(newArray);
            if(isRoadmap){
                const cloneRoadmap = [...roadmapList]
                const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                if(roadmapIndex !== -1){
                    cloneRoadmap[roadmapIndex].ideas = newArray
                    setRoadmapList(cloneRoadmap);

                }
                if(isNoStatus){
                    setNoStatus(newArray)
                }
            }
            setIsLoading(false)
            setIsCreateIdea(false)
            if(isNoStatus) {
                setIsNoStatus(false)
            }
            toast({description: "Idea create successfully"})
        } else {
            setIsLoading(false)
            toast({description: data.error})
        }
    }

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                if (!value || value.trim() === "") {
                    return "Title is required";
                } else {
                    return "";
                }
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onDeleteIdeaImage = (index) => {
        const clone = [...ideaDetail.images];
        clone.splice(index, 1);
        setIdeaDetail({...ideaDetail, images: clone})
    }

    const onChangeStatus = async (name,value) => {
        setIsLoadingSidebar(name);
        setSelectedIdea({...selectedIdea, [name]: value})
        let formData = new FormData();
        formData.append(name, value);
        const data = await apiSerVice.updateIdea(formData, selectedIdea.id)
        if (data.status === 200) {
            let clone = [...ideasList];
            let index = clone.findIndex((x) => x.id === selectedIdea.id);
            if (index !== -1) {
                if (name === "pin_to_top" && value == 1) {
                    clone.splice(index, 1)
                    clone.unshift(data.data)
                } else {
                    clone[index] = {...data.data,};
                }
                if (isRoadmap) {
                    const cloneRoadmap = [...roadmapList]
                    const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap.id);
                    if (name === "roadmap_id") {
                        if (isNoStatus) {
                            let ideaIndex = clone.findIndex((x) => x.id === selectedIdea.id);
                            if (ideaIndex !== -1) {
                                let ideaObj = clone[ideaIndex]
                                const roadmapIndexChange = cloneRoadmap.findIndex((x) => x.id == value);
                                const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndexChange].ideas]
                                cloneRoadmapIdeas.push(ideaObj)
                                cloneRoadmap[roadmapIndexChange].ideas = cloneRoadmapIdeas
                                clone.splice(ideaIndex, 1)
                                setRoadmapList(cloneRoadmap);
                                setNoStatus(clone);
                            }
                        } else {
                            if (roadmapIndex !== -1) {
                                let cloneIdea = [...cloneRoadmap[roadmapIndex].ideas];
                                let ideaIndex = cloneIdea.findIndex((x) => x.id === selectedIdea.id);
                                if (ideaIndex !== -1) {
                                    let ideaObj = cloneIdea[ideaIndex]
                                    const roadmapIndexChange = cloneRoadmap.findIndex((x) => x.id == value);
                                    const cloneRoadmapIdeas = [...cloneRoadmap[roadmapIndexChange].ideas]
                                    cloneRoadmapIdeas.push(ideaObj);
                                    cloneIdea.splice(ideaIndex, 1);
                                    cloneRoadmap[roadmapIndexChange].ideas = cloneRoadmapIdeas
                                    cloneRoadmap[roadmapIndex].ideas = cloneIdea
                                    setRoadmapList(cloneRoadmap);
                                }
                            }
                        }
                    } else {
                        if (roadmapIndex !== -1) {
                            cloneRoadmap[roadmapIndex].ideas = clone
                            setRoadmapList(cloneRoadmap);
                        }
                    }
                }
            }
            setSelectedIdea({...data.data,})
            setIdeasList(clone);
            setIsLoading(false)
            setIsEditIdea(false)
            setIsLoadingSidebar('');
            toast({description: "Idea Update successfully"})
        } else {
            setIsLoading(false)
            setIsLoadingSidebar('');
            toast({variant: "destructive", description: data.error})
        }
    }

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen} isCreateIdea={isCreateIdea}>
                <SheetContent className={"lg:max-w-[1101px] md:max-w-[720px] sm:max-w-[520px] p-0"}>
                    <SheetHeader className={"px-[32px] py-[22px] border-b"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <h2 className={"text-xl font-medium"}>Tell us your Idea!</h2>
                            <X onClick={onClose} className={"cursor-pointer"}/>
                        </div>
                    </SheetHeader>
                    <div className={"lg:flex md:block overflow-auto h-[100vh]"}>
                        <div className={`basis-[440px] ${theme === "dark" ? "" : "bg-muted"} border-r overflow-auto pb-[100px]`}>
                            <div className={"border-b py-4 pl-8 pr-6 flex flex-col gap-3"}>
                                <div className={"flex flex-col gap-1"}>
                                    <h3 className={"text-sm font-medium"}>Status</h3>
                                    <p className={"text-muted-foreground text-xs font-normal"}>Apply a status to Manage this idea on roadmap.</p>
                                </div>
                                <div className={"flex flex-col "}>
                                    <RadioGroup
                                        // defaultValue={selectedStatus}
                                        // onValueChange={(value) => onChangeStatus('roadmap_id', value)}
                                        // value={selectedIdea.id}
                                        // onValueChange={(e) => console.log(e)}
                                    >
                                        {
                                            (roadmapStatus || []).map((x, i) => {
                                                return (
                                                    <div key={i} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={x.id} id={x.id}/>
                                                        <Label className={"text-secondary-foreground text-sm font-normal"} htmlFor={x.id}>{x.title}</Label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={"border-b"}>
                                <div className="py-4 pl-8 pr-6 w-full items-center gap-1.5">
                                    <Label htmlFor="picture">Featured image</Label>
                                    <div className="w-[282px] h-[128px] relative">

                                        {selectedFile ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                                                <Button
                                                    variant="outline"
                                                    onClick={handleRemoveImage}
                                                    className={`${theme === "light" ? "text-card" : ""} w-[129px] px-4 py-2 absolute top-[50%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] border-0 flex justify-center items-center bg-primary hover:bg-primary hover:text-card text-sm font-semibold`}
                                                >
                                                    Change image
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    id="pictureInput"
                                                    type="file"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <label
                                                    htmlFor="pictureInput"
                                                    className="border-dashed w-full h-full py-[52px] inset-0 flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                                                >
                                                    <h4 className={"text-sm font-semibold"}>Upload Image</h4>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={"py-4 pl-8 pr-6 flex flex-col gap-[26px]"}>
                                <div className={"flex flex-wrap gap-1 justify-between"}>
                                    <div className={"flex flex-col gap-1"}>
                                        <h4 className={"text-sm font-medium"}>Mark as bug</h4>
                                        <p className={"text-muted-foreground text-xs font-normal"}>Hides Idea from your users</p>
                                    </div>
                                    <Button
                                        variant={"outline"}
                                        className={`hover:bg-muted w-[132px] ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm font-semibold`}
                                        // onClick={() => onChangeStatus({name: "is_active",value: selectedIdea.is_active === 1 ? 0 : 1})}
                                    >
                                        {/*{selectedIdea.is_active === 0 ? "Convert to Idea": "Mark as bug"}*/}
                                    </Button>
                                </div>
                                <div className={"flex flex-wrap gap-1 justify-between"}>
                                    <div className={"flex flex-col gap-1"}>
                                        <h4 className={"text-sm font-medium"}>Archive</h4>
                                        <p className={"text-muted-foreground text-xs font-normal"}>Remove Idea from Board and Roadmap</p>
                                    </div>
                                    <Button
                                        variant={"outline"}
                                        className={`w-[100px] hover:bg-muted ${theme === "dark" ? "" : "border-card-foreground text-muted-foreground"} text-sm font-semibold`}
                                        // onClick={() => onChangeStatus({name: "is_archive",value: selectedIdea.is_archive === 1 ? 0 : 1})}
                                    >
                                        {/*{selectedIdea.is_archive === 1 ? "Unarchive" : "Archive"}*/}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={"basis-[661px] overflow-auto"}>
                            <div className={"pb-100px"}>
                                <div className={"py-6 px-8 flex flex-col gap-6 border-b"}>
                                    <div className="items-center gap-1.5">
                                        <Label htmlFor="text">Title</Label>
                                        <Input type="text" id="text" placeholder="" value={ideaDetail.title} name={"title"} onChange={onChangeText} />
                                        {
                                            formError.title && <span className="text-red-500 text-sm">{formError.title}</span>
                                        }
                                    </div>
                                    <div className="gap-1.5">
                                        <Label htmlFor="message">Description</Label>
                                        <Textarea placeholder="Start writing..." id="message"
                                                  value={description}
                                                  onChange={handleUpdate}
                                        />
                                        {formError.description && <span className="text-red-500 text-sm">{formError.description}</span>}
                                    </div>
                                </div>
                                <div className={"py-6 px-8 border-b"}>
                                    <Label>Choose Topics for this Idea (optional)</Label>
                                    <Select>
                                        <SelectTrigger className="">
                                            <SelectValue placeholder="Select topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    (topicLists || []).map((x, i) => {
                                                        return (
                                                            <SelectItem key={i} value={x.id}>{x.title}</SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={"p-8 flex gap-6"}>
                                    <Button className={"py-2 px-6 text-sm font-semibold"} onClick={onCreateIdea}>Create Idea</Button>
                                    <Button variant={"outline hover:bg-transparent"} className={"border border-primary py-2 px-6 text-sm font-semibold"} onClick={onClose}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default CreateIdea;