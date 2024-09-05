import React, {useEffect, useState, Fragment} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../ui/button";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,} from "../ui/dropdown-menu";
import {ArrowLeft, ArrowRight, Plus, RotateCcw} from "lucide-react";
import {useTheme} from "../theme-provider";
import {baseUrl} from "../../utils/constent";
import {Card} from "../ui/card";
import {useSelector} from "react-redux";
import moment from "moment";
import {ApiService} from "../../utils/ApiService";
import {useToast} from "../ui/use-toast";
import Post from "./Post";
import Banners from "./Banners";
import Surveys from "./Surveys";
import Checklist from "./Checklist";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import SidebarInAppMessage from "./SidebarInAppMessage";



import {DropdownMenuGroup} from "@radix-ui/react-dropdown-menu";

const initialState = {
    project_id: "2",
    title: "In app message",
    type: 1, //1=post,2=banner,3=survey,4=checklist
    body_text: "",
    from: "",
    reply_to: "",
    bg_color: "#EEE4FF",
    text_color: "#000000",
    icon_color: "#FD6B65",
    btn_color: "#7c3aed",
    delay: 1, //time in seconds
    start_at: moment().toISOString(),
    end_at: moment().add(1, 'hour').toISOString(),
    position: "top", //top/bottom
    alignment: "center", //left/right
    is_close_button: true, //true/false
    reply_type: 1, //1=Text,2=Reaction
    question_type: 1, //1=Net Promoter Score,2=Numeric Scale,3=Star rating scale,4=Emoji rating scale,5=Drop Down / List,6=Questions
    start_number: 1,
    end_number: 10,
    start_label: "",
    end_label: "",
    placeholder_text: "",
    options: [''],
    show_sender: true, //boolean
    action_type: 0, //1=Open URL,2=Ask for Reaction,3=Collect visitor email
    action_text: "",
    action_url: "",
    is_redirect: "", //boolean
    is_banner_close_button: false, //boolean
    banner_style: "", //1=Inline,2=Floating,3=Top,4=Bottom
    reactions: [],
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

const UpdateInAppMessage = () => {
    const navigate = useNavigate();
    let apiSerVice = new ApiService();

    const {id, type} = useParams()
    const {theme} = useTheme();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [messageType, setMessageType] = useState(Number(type) || 1);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [openItem,setOpenItem]=useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [addSteps, setAddSteps] = useState([]);
    const [selectedQuestionTypes, setSelectedQuestionTypes] = useState(1);

    const renderContent = (type) => {
        switch (type) {
            case 1:
                return <Post inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading}/>;
            case 2:
                return <Banners inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading} />;
            case 3:
                return <Surveys inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading}/>;
            case 4:
                return <Checklist inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting} isLoading={isLoading}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            document.body.style.pointerEvents = 'auto';
        }, 500)
    },[]);

    useEffect(() => {
        if (id === "new") {
            setInAppMsgSetting(prevState => ({
                ...prevState,
                title: `${type === "1" ? "Post": type === "2" ? "Banner" : type === "3" ? "Survey" : "Checklist"} in app message`,
                reactions: type === "1" ? reactionPost : type === "2" ? reactionBanner : [],
                body_text: type === "1" ? {blocks: [
                        {
                            type: "paragraph",
                            data: {
                                text:
                                    "Hey"
                            }
                        },
                    ]} : "",
            }));
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
                options: data.data.options ?? [''],
                body_text: type === "1" ? JSON.parse(data.data.body_text) : data.data.body_text
            }
            setInAppMsgSetting(payload);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    const handleAddStep = () => {
        setAddSteps( [...addSteps, `Step ${addSteps.length + 1}`]);
    };

    const questionTypeOptions = [
        { label: "Net Promoter Score", value: 1 },
        { label: "Numeric Scale", value: 2 },
        { label: "Star Rating Scale", value: 3 },
        { label: "Emoji Rating Scale", value: 4 },
        { label: "Drop Down / List", value: 5 },
    ];

    const handleSelectQuestionType = (value) => {
        setInAppMsgSetting({ ...inAppMsgSetting, question_type: value });
        setSelectedQuestionTypes(value);
    };

    return (
        // <div className={"xl:container-2 xl:w-[1100px] container overflow-y-auto"}>
        <Fragment>
            <div className={"py-6 px-4 border-b flex items-center justify-between"}>
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
            </div>
            <div className={"flex h-[calc(100%_-_69px)] overflow-y-auto"}>
                <div className={"max-w-[407px] w-full border-r h-full overflow-y-auto"}>
                    <SidebarInAppMessage id={id} messageType={messageType} inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}/>
                </div>
                <div className={"bg-muted w-full h-full overflow-y-auto"}>

                    {(messageType === 3 || messageType === 4) ? (
                        <div className={"my-6 mx-4 flex justify-center gap-4"}>
                            {addSteps.map((step, index) => (
                                <div key={index} className="my-2">
                                    <Button size={"sm"} className={"hover:bg-primary"}>{step}</Button>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <Card className={"my-6 mx-4 rounded-md px-4 pt-6 pb-16"}>
                        <Card className={"rounded-md border-b"}>
                            <div className={"p-4 flex gap-2 border-b"}>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                                <div className={"w-3 h-3 rounded-full border border-inherit"}/>
                            </div>
                            <div className={"p-2"}>
                                <div className="flex items-center space-x-3">
                                    <ArrowLeft className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                    <ArrowRight className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>
                                    <RotateCcw className={`${theme === "dark" ? "" : "text-[#CBD5E1]"}`}/>

                                    <div className="flex-grow border border-inherit h-8 rounded-2xl"/>
                                    <div className={"h-7 w-7 rounded-full border border-inherit"}/>
                                </div>
                            </div>
                            {renderContent(messageType)}
                        </Card>
                    </Card>
                    {(messageType === 3 || messageType === 4) ? (
                        <div className={"flex justify-center"}>
                            {/*<Button className={"flex gap-[6px] font-semibold"} onClick={handleAddStep}>*/}
                            {/*    <Plus size={16} strokeWidth={3}/>*/}
                            {/*    Add Steps*/}
                            {/*</Button>*/}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className={"flex gap-[6px] font-semibold"} onClick={handleAddStep}>
                                        <Plus size={16} strokeWidth={3}/>
                                        Add Steps
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuGroup>
                                        {
                                            (messageType === 3) && <Fragment>
                                                {questionTypeOptions.map(option => (
                                                    <DropdownMenuCheckboxItem
                                                        key={option.value}
                                                        // checked={selectedQuestionTypes.includes(option.value)}
                                                        checked={selectedQuestionTypes === option.value}
                                                        onCheckedChange={() => handleSelectQuestionType(option.value)}
                                                    >
                                                        {option.label}
                                                    </DropdownMenuCheckboxItem>
                                                ))}
                                            </Fragment>
                                        }
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : null}
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInAppMessage;