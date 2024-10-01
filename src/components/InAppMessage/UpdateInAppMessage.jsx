import React, {useEffect, useState, Fragment} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../ui/button";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import {ArrowLeft, ArrowRight, Loader2, Plus, RotateCcw} from "lucide-react";
import {useTheme} from "../theme-provider";
import {baseUrl} from "../../utils/constent";
import {Card} from "../ui/card";
import {useSelector} from "react-redux";
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import Post from "./Post";
import Banners from "./Banners";
import Surveys from "./Surveys";
import Checklist from "./Checklist";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import SidebarInAppMessage from "./SidebarInAppMessage";
import {useToast} from "../ui/use-toast";

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1,
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#EEE4FF",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1,
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top",
    alignment: "center",
    is_close_button: true,
    reply_type: 1,
    show_sender: true,
    action_type: 0,
    action_text: "",
    action_url: "",
    is_redirect: "",
    is_banner_close_button: false,
    banner_style: "",
    reactions: [],
    status: 1,
    steps:[],
    checklist_title: "",
    checklist_description : "",
    checklists: []
}

const reactionPost = [
    {
        "id": "",
        "emoji": "👌",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44c.png",
        is_active: 1,
    },
    {
        "id": "",
        "emoji": "🙏",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f64f.png",
        is_active: 1
    },
    {
        "id": "",
        "emoji": "👍",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
        is_active: 1
    },
    {
        "id": "",
        "emoji": "😀",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f600.png",
        is_active: 1
    },
    {
        "id": "",
        "emoji": "❤️",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png",
        is_active: 1
    }
];

const reactionBanner = [
    {
        "id": "",
        "emoji": "👍",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
        is_active: 1
    },{
        "id": "",
        emoji: "👎",
        "emoji_url": "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44e.png",
        is_active: 1
    },

];

const stepBoj = {
    question_type: 1,
    text: "How likely are you to recommend us to family and friends?",
    placeholder_text: "",
    start_number: "1",
    end_number: "5",
    start_label: "Not likely",
    end_label: "Very likely",
    is_answer_required: "",
    step: 1,
    options: [],
    reactions: [],
    step_id: "",
    is_active: 1
}

const checkListObj =  {
    title: "",
    description: [{type: "paragraph", data: {text: ""}}],
    action_type: 0,
    action_text: "Open",
    action_url: "",
    is_redirect: 0,
    is_active: 1,
    checklist_id: ""
}

const UpdateInAppMessage = () => {
    const {toast} = useToast()
    const navigate = useNavigate();
    let apiSerVice = new ApiService();
    const {id, type} = useParams()
    const {theme} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isSave, setIsSave] = useState(false);

    const renderContent = (type) => {
        switch (type) {
            case "1":
                return <Post inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading}  />;
            case "2":
                return <Banners inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} />;
            case "3":
                return <Surveys inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>;
            case "4":
                return <Checklist inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (id === "new") {
            setInAppMsgSetting(prevState => ({
                ...prevState,
                title: `${type === "1" ? "Post": type === "2" ? "Banner" : type === "3" ? "Survey" : "Checklist"} in app message`,
                reactions: type === "1" ? reactionPost : type === "2" ? reactionBanner : [],
                body_text: type === "1" ? { blocks: [{type: "paragraph", data: {text: "Hey"}}]} : "",
                text_color: type === "4" ? "#FFFFFF" : "#000000",
                steps: type === "3" ?  [stepBoj] : [],
                checklists: type === "4" ? [
                    checkListObj
                ] : [],
            }));
            setSelectedStep(type === "3" ? stepBoj : type === "4" ? checkListObj : {})
            setIsSave(false)
        }

    }, [])

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessages();
        }
    }, [projectDetailsReducer.id]);

    const getSingleInAppMessages = async () => {
        setIsLoading(true)
        const data = await apiSerVice.getSingleInAppMessage(id)
        if (data.status === 200) {
            const payload = {
                ...data.data,
                body_text: type === "1" ? JSON.parse(data.data.body_text) : data.data.body_text,
            }
            setInAppMsgSetting(payload);
            if(type === "3"){
                setSelectedStep(payload.steps[0])
            } else if(type === "4"){
                setSelectedStep(payload.checklists[0])
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const createMessage = async () => {
        if(inAppMsgSetting.type == "3"){
            if(inAppMsgSetting.steps.filter((x) => x.is_active === 1 && x.question_type !== 8).length <= 0){
                toast({variant: "destructive", description: "Add minimum 1 step"})
                return
            }
        }
        setIsSave(true)
        const payload = {
            ...inAppMsgSetting,
            start_at: moment(inAppMsgSetting?.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(inAppMsgSetting?.end_at).format('YYYY-MM-DD HH:mm:ss'),
            project_id: projectDetailsReducer.id,
            type: type
        }
        console.log(payload)
        const data = await apiSerVice.createInAppMessage(payload);

        if (data.status === 200) {
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/in-app-message`)
            }
        } else {
            toast({variant: "destructive", description: data.message})
            // setIsSave(false);
        }
        setIsSave(false);
    }

    const onUpdateMessage = async () => {
        setIsSave(true)
        const payload = {
            ...inAppMsgSetting,
            start_at: moment(inAppMsgSetting?.start_at).format('YYYY-MM-DD HH:mm:ss'),
            end_at: moment(inAppMsgSetting?.end_at).format('YYYY-MM-DD HH:mm:ss'),
            type: type
        }
        const data = await apiSerVice.updateInAppMessage(payload, inAppMsgSetting.id)

        if (data.status === 200) {
            toast({description: data.message})
        } else {
            toast({variant: "destructive", description: data.message})
            // setIsLoading(false)
        }
        setIsSave(false)
    }

    const handleCancel = () => {
        setInAppMsgSetting(inAppMsgSetting);
        if (id === "new") {
            navigate(`${baseUrl}/in-app-message/type`)
        } else {
            navigate(`${baseUrl}/in-app-message`)
        }
    }

    return (
        <Fragment>
            <div className={"py-6 px-4 border-b flex items-center justify-between flex-wrap"}>
                <Breadcrumb>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbLink>
                                    <span onClick={id === 'new' ? () => navigate(`${baseUrl}/in-app-message/type`) : () => navigate(`${baseUrl}/in-app-message`)}>
                                        {type === '1' && 'Post'}
                                        {type === '2' && 'Banners'}
                                        {type === '3' && 'Surveys'}
                                        {type === '4' && 'Checklist'}
                                    </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbPage>{inAppMsgSetting.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Breadcrumb>
                <div className={"flex items-center gap-2"}>
                    <Button size={"sm"} className={`w-[125px] font-medium hover:bg-primary`} onClick={id === "new" ? createMessage : onUpdateMessage}>
                        {isSave ? <Loader2 size={16} className={"animate-spin"}/> : "Save Changes"}
                    </Button>
                    <Button size={"sm"} variant={"ghost hover-none"} className={"font-medium border border-primary"} onClick={handleCancel}>Cancel</Button>
                </div>
            </div>
            <div className={"flex h-[calc(100%_-_85px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    <SidebarInAppMessage id={id} type={type} inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>
                </div>
                <div className={"bg-muted w-full h-full"}>
                    <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-8 h-[calc(100%_-_48px)]"}>
                        <Card className={"rounded-md border-b h-full"}>
                            <div className={"p-4 flex gap-2 border-b"}>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                            </div>
                            <div className={"p-2 border-b"}>
                                <div className="flex items-center space-x-3">
                                    <ArrowLeft className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                    <ArrowRight className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                    <RotateCcw className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>

                                    <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                                    <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                                </div>
                            </div>
                            {renderContent(type)}
                        </Card>
                    </Card>

                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInAppMessage;