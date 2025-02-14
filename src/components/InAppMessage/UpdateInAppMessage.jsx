import React, {useEffect, useState, Fragment} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Button} from "../ui/button";
import {BarChart, Loader2} from "lucide-react";
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
import {Skeleton} from "../ui/skeleton";

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
    btn_text_color: "#000000",
    delay: 1,
    start_at: moment().toISOString(),
    // end_at: moment().add(1, 'hour').toISOString(),
    end_at: '',
    position: "top",
    alignment: "center",
    is_close_button: false,
    reply_type: 1,
    is_open: 0,
    show_sender: false,
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
    is_answer_required: false,
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
    const location = useLocation();
    const UrlParams = new URLSearchParams(location.search);
    const getPageNo = UrlParams.get("pageNo") || 1;
    let apiSerVice = new ApiService();
    const {id, type} = useParams()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [isSave, setIsSave] = useState(false);

    const renderContent = (type) => {
        switch (type) {
            case "1":
                return isLoading ? <Fragment>
                    {
                        [...Array(14)].map((_, i) => {
                            return (
                                <div className={"px-2 py-[10px] md:px-3"}>
                                    <Skeleton className={"rounded-md w-full h-4"}/>
                                </div>
                            )})}
                </Fragment>
                    : <Post inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading}  />;
            case "2":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )})}
                    </Fragment>
                    : <Banners inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} />;
            case "3":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )})}
                    </Fragment>
                    : <Surveys inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>;
            case "4":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )})}
                    </Fragment>
                    : <Checklist inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>;
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
                // body_text: type === "1" ? { blocks: [{type: "paragraph", data: {text: "Hey"}}]} : "",
                body_text: type === "1"
                    ? JSON.stringify({
                        blocks: [{ type: "paragraph", data: { text: "Hey" } }]
                    })
                    : "",
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
    }, [projectDetailsReducer.id, getPageNo]);

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
        const startAt = inAppMsgSetting?.start_at
            ? moment(inAppMsgSetting.start_at).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.end_at && moment(inAppMsgSetting.end_at).isValid()
            ? moment(inAppMsgSetting.end_at).format('YYYY-MM-DD HH:mm:ss')
            : null;
        const payload = {
            ...inAppMsgSetting,
            start_at: startAt,
            end_at: endAt,
            project_id: projectDetailsReducer.id,
            type: type
        }
        const data = await apiSerVice.createInAppMessage(payload);

        if (data.status === 200) {
            toast({description: data.message})
            if (id === "new") {
                navigate(`${baseUrl}/app-message`)
            }
        } else {
            toast({variant: "destructive", description: data.message})
            // setIsSave(false);
        }
        setIsSave(false);
    }

    const onUpdateMessage = async () => {
        setIsSave(true)
        const startAt = inAppMsgSetting?.start_at
            ? moment(inAppMsgSetting.start_at).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.end_at && moment(inAppMsgSetting.end_at).isValid()
            ? moment(inAppMsgSetting.end_at).format('YYYY-MM-DD HH:mm:ss')
            : null;
        const payload = {
            ...inAppMsgSetting,
            start_at: startAt,
            end_at: endAt,
            type: type,
            body_text: type === "1" ? typeof(inAppMsgSetting.body_text) === "string" ? inAppMsgSetting.body_text : JSON.stringify(inAppMsgSetting.body_text) : inAppMsgSetting.body_text
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
            navigate(`${baseUrl}/app-message/type`)
        } else {
            navigate(`${baseUrl}/app-message`)
        }
    }

    return (
        <Fragment>
            <div className={"p-4 md:py-6 md:px-4 border-b flex items-center justify-between flex-wrap gap-2"}>
                <Breadcrumb>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbLink>
                                    <span onClick={id === 'new' ? () => navigate(`${baseUrl}/app-message/type`) : () => navigate(`${baseUrl}/app-message?pageNo=${getPageNo}`)}>
                                        {type === '1' && 'Post'}
                                        {type === '2' && 'Banners'}
                                        {type === '3' && 'Surveys'}
                                        {type === '4' && 'Checklist'}
                                    </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbPage className={`w-full ${inAppMsgSetting?.title?.length > 30 ? "max-w-[200px] truncate" : ""}`}>{isLoading && id !== 'new' ? null : inAppMsgSetting?.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </Breadcrumb>
                <div className={"flex items-center gap-2"}>
                    {
                        (id !== "new") ?
                            <Button
                                variant="outline" className={"w-9 h-9"} size="icon"
                                onClick={() => navigate(`${baseUrl}/app-message/${inAppMsgSetting.type}/analytic/${inAppMsgSetting.id}`)}
                            >
                                <BarChart size={16}/>
                            </Button>
                            : ""
                    }
                    <Button className={`w-[111px] font-medium hover:bg-primary`} onClick={id === "new" ? createMessage : onUpdateMessage}>
                        {isSave ? <Loader2 size={16} className={"animate-spin"}/> : "Save Changes"}
                    </Button>
                    <Button variant={"ghost hover-none"} className={"font-medium border border-primary text-primary"} onClick={handleCancel}>Cancel</Button>
                </div>
            </div>
            <div className={"flex h-[calc(100%_-_85px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    <SidebarInAppMessage id={id} type={type} inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} selectedStepIndex={selectedStepIndex} setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep} setSelectedStep={setSelectedStep}/>
                </div>
                <div className={"bg-muted w-full h-full hidden md:block overflow-y-auto"}>
                    <Card className={`my-6 mx-4 rounded-md px-4 pt-6 pb-8 h-[calc(100%_-_48px)] `}>
                        <Card className={`rounded-md border-b h-full ${isLoading ? "overflow-hidden" : ''}`}>
                            <div className={"p-4 flex gap-2 border-b"}>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                            </div>
                            {renderContent(type)}
                        </Card>
                        {
                            (allStatusAndTypes?.setting?.is_branding === 1) &&
                                <h6 className="text-sm font-medium text-end mt-1 mr-2">Powered by <a className="text-primary" href="https://quickhunt.app" target="_blank">quickhunt</a></h6>
                        }
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInAppMessage;