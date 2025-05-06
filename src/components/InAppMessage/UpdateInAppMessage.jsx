import React, {useEffect, useState, Fragment} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {Button} from "../ui/button";
import {BarChart, Loader2} from "lucide-react";
import {apiService, baseUrl, extractImageFilename, isEmpty} from "../../utils/constent";
import {Card} from "../ui/card";
import {useSelector} from "react-redux";
import moment from "moment";
import Post from "./Post";
import Banners from "./Banners";
import Surveys from "./Surveys";
import Checklist from "./Checklist";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator} from "../ui/breadcrumb";
import SidebarInAppMessage from "./SidebarInAppMessage";
import {useToast} from "../ui/use-toast";
import {Skeleton} from "../ui/skeleton";

const initialState = {
    projectId: null,
    title: "In app message",
    type: 1,
    bodyText: null,
    from: null,
    replyTo: null,
    bgColor: "#EEE4FF",
    textColor: "#000000",
    iconColor: "#FD6B65",
    btnColor: "#7c3aed",
    btnTextColor: "#000000",
    delay: 1,
    startAt: moment().toISOString(),
    endAt: null,
    position: "top",
    alignment: "center",
    isCloseButton: false,
    replyType: 1,
    isOpen: 0,
    showSender: false,
    actionType: 0,
    actionText: null,
    actionUrl: null,
    isRedirect: false,
    isBannerCloseButton: false,
    bannerStyle: null,
    reactions: [],
    status: 1,
    steps: [],
    checklistTitle: null,
    checklistDescription: null,
    checklists: []
}

const reactionPost = [
    {
        id: "",
        emoji: "👌",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44c.png",
        isActive: true,
    },
    {
        id: "",
        emoji: "🙏",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f64f.png",
        isActive: true
    },
    {
        id: "",
        emoji: "👍",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
        isActive: true
    },
    {
        id: "",
        emoji: "😀",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f600.png",
        isActive: true
    },
    {
        id: "",
        emoji: "❤️",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/2764-fe0f.png",
        isActive: true
    }
];

const reactionBanner = [
    {
        id: "",
        emoji: "👍",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44d.png",
        isActive: true
    },
    {
        id: "",
        emoji: "👎",
        emojiUrl: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f44e.png",
        isActive: true
    },
];

const stepBoj = {
    questionType: 1,
    text: "How likely are you to recommend us to family and friends?",
    placeholderText: "",
    startNumber: "1",
    endNumber: "5",
    startLabel: "Not likely",
    endLabel: "Very likely",
    isAnswerRequired: true,
    step: 1,
    options: [],
    reactions: [],
    stepId: "",
    isActive: true
}

const checkListObj = {
    title: "",
    description: [{type: "paragraph", data: {text: ""}}],
    actionType: 0,
    actionText: "Open",
    actionUrl: "",
    isRedirect: false,
    isActive: true,
    checklistId: ""
}

const initialStateError = {
    startAt: undefined,
    endAt: undefined,
    from: "",
    actionUrl: "",
    actionText: "",
}

const UpdateInAppMessage = () => {
    const {toast} = useToast()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const getPageNo = searchParams.get("pageNo") || 1;
    const {id, type} = useParams()
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [inAppMsgSetting, setInAppMsgSetting] = useState(initialState);
    const [selectedStepIndex, setSelectedStepIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const [saving, setSaving] = useState('');
    const [formError, setFormError] = useState(initialStateError);

    const renderContent = (type) => {
        switch (type) {
            case "1":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div key={i} className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )
                            })}
                    </Fragment>
                    : <Post inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}
                            isLoading={isLoading}/>;
            case "2":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div key={i} className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )
                            })}
                    </Fragment>
                    : <Banners inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}
                               isLoading={isLoading}/>;
            case "3":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div key={i} className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )
                            })}
                    </Fragment>
                    : <Surveys inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}
                               isLoading={isLoading} selectedStepIndex={selectedStepIndex}
                               setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep}
                               setSelectedStep={setSelectedStep}/>;
            case "4":
                return isLoading ? <Fragment>
                        {
                            [...Array(14)].map((_, i) => {
                                return (
                                    <div key={i} className={"px-2 py-[10px] md:px-3"}>
                                        <Skeleton className={"rounded-md w-full h-4"}/>
                                    </div>
                                )
                            })}
                    </Fragment>
                    : <Checklist inAppMsgSetting={inAppMsgSetting} setInAppMsgSetting={setInAppMsgSetting}
                                 isLoading={isLoading} selectedStepIndex={selectedStepIndex}
                                 setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep}
                                 setSelectedStep={setSelectedStep}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (id === "new") {
            setInAppMsgSetting(prevState => ({
                ...prevState,
                title: `${type === "1" ? "Post" : type === "2" ? "Banner" : type === "3" ? "Survey" : "Checklist"} in app message`,
                reactions: type === "1" ? reactionPost : type === "2" ? reactionBanner : [],
                bodyText: type === "1" ? {blocks: [{type: "paragraph", data: {text: "Hey"}}]} : null,
                textColor: type === "4" ? "#FFFFFF" : "#000000",
                steps: type === "3" ? [stepBoj] : [],
                checklists: type === "4" ? [checkListObj] : [],
            }));
            setSelectedStep(type === "3" ? stepBoj : type === "4" ? checkListObj : {})
        }
    }, [])

    useEffect(() => {
        if (id !== "new" && projectDetailsReducer.id) {
            getSingleInAppMessages();
        }
    }, [projectDetailsReducer.id, getPageNo]);

    const getSingleInAppMessages = async () => {
        setIsLoading(true)
        const data = await apiService.getSingleInAppMessage(id)
        setIsLoading(false);
        if (data.success) {
            const payload = {
                ...data.data.data,
                bodyText: data.data.data.bodyText,
            }
            setInAppMsgSetting(payload);
            if (type === "3") {
                setSelectedStep(payload.steps[0])
            } else if (type === "4") {
                setSelectedStep(payload.checklists[0])
            }
        }
    }

    const formValidate = (name, value, context = {}) => {
        const trimmedValue = typeof value === "string" ? value.trim() : String(value || "").trim();
        switch (name) {
            case "from":
                // if (inAppMsgSetting.showSender && !value) {
                if (context.showSender && !trimmedValue) {
                    return "Sender is required.";
                }
                return "";
            case "startAt":
                if (!trimmedValue) {
                    return "Start Date is required.";
                }
                return "";
            case "actionUrl":
                // if ((type === "2") && selectedStep?.actionType === 1) {
                //     if (isEmpty(value)) {
                //         return "Action URL is required.";
                //     }
                //     // if (trimmedValue) {
                //     //     const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
                //     //     if (!urlPattern.test(trimmedValue)) {
                //     //         return "Please enter a valid URL.";
                //     //     }
                //     // }
                // }
                if (context.actionType === 1) {
                    if (isEmpty(trimmedValue)) {
                        return "Action URL is required.";
                    }
                    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
                    if (!urlPattern.test(trimmedValue)) {
                        return "Please enter a valid URL.";
                    }
                }
                return "";
            case "actionText":
                if (context.actionType === 1 && isEmpty(trimmedValue)) {
                    return "Action Text is required.";
                }
                return "";
            default:
                return "";
        }
    };

    const handleMessageqq = async (typeFunc, load) => {
        if (type == "3") {
            const activeSteps = inAppMsgSetting.steps.filter((x) => x.isActive && x.questionType !== 8);
            if (activeSteps.length <= 0) {
                toast({variant: "destructive", description: "Add minimum 1 step"});
                return;
            }
            for (const step of activeSteps) {
                if (step.questionType === 5) {
                    if (!step.options || step.options.length === 0) {
                        toast({variant: "destructive", description: "At least one option is required."});
                        return;
                    }
                    const hasEmptyTitle = step.options.some(opt => !opt.title?.trim());
                    if (hasEmptyTitle) {
                        toast({variant: "destructive", description: "Option cannot be empty."});
                        return;
                    }
                }
            }
        }

        if (type === "4") {
            const activeChecklists = inAppMsgSetting.checklists.filter(x => x.isActive);
            for (const checklist of activeChecklists) {
                if (checklist.actionType === 1) {
                    const error = formValidate("actionUrl", checklist.actionUrl);
                    if (error) {
                        toast({variant: "destructive", description: error});
                        return;
                    }
                }
            }
        }

        let validationErrors = {};
        Object.keys(inAppMsgSetting).forEach(name => {
            const error = formValidate(name, inAppMsgSetting[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }

        if (inAppMsgSetting?.bodyText?.blocks) {
            inAppMsgSetting.bodyText.blocks = inAppMsgSetting.bodyText.blocks.map(block => {
                if (block.type === 'image' && block.data?.file?.url) {
                    return {
                        ...block,
                        data: {
                            ...block.data,
                            file: {
                                ...block.data.file,
                                url: extractImageFilename(block.data.file.url)
                            }
                        }
                    };
                }
                return block;
            });
        }

        if (Array.isArray(inAppMsgSetting.checklists)) {
            inAppMsgSetting.checklists = inAppMsgSetting.checklists.map(cl => {
                if (Array.isArray(cl?.description)) {
                    const updatedDescription = cl.description.map(block => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            return {
                                ...block,
                                data: {
                                    ...block.data,
                                    file: {
                                        ...block.data.file,
                                        url: extractImageFilename(block.data.file.url)
                                    }
                                }
                            };
                        }
                        return block;
                    });

                    return {
                        ...cl,
                        description: updatedDescription
                    };
                }
                return cl;
            });
        }

        const startAt = inAppMsgSetting?.startAt
            ? moment(inAppMsgSetting.startAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.endAt && moment(inAppMsgSetting.endAt).isValid()
            ? moment(inAppMsgSetting.endAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const payload = {
            ...inAppMsgSetting,
            startAt,
            endAt,
            type,
            projectId: projectDetailsReducer.id,
        };

        setSaving(load);
        let data;
        if (typeFunc === 'create') {
            data = await apiService.createInAppMessage(payload);
        } else if (typeFunc === 'update') {
            data = await apiService.updateInAppMessage(payload, inAppMsgSetting.id);
        }

        setSaving('');
        if (data?.success) {
            toast({description: data.message});
            if (typeFunc === 'create' && id === 'new') {
                navigate(`${baseUrl}/app-message`);
            }
        } else {
            toast({variant: "destructive", description: data?.error?.message});
        }
    };

    const handleMessage = async (typeFunc, load) => {
        let validationErrors = {};

        // Validate top-level fields
        Object.keys(initialStateError).forEach(name => {
            const context = {
                showSender: inAppMsgSetting.showSender,
                actionType: inAppMsgSetting.actionType
            };
            const error = formValidate(name, inAppMsgSetting[name], context);
            if (error) {
                validationErrors[name] = error;
            }
        });

        // For Banner type (type="2")
        if (type === "2") {
            if (inAppMsgSetting.actionType === 1) {
                const textError = formValidate("actionText", inAppMsgSetting.actionText, {
                    actionType: inAppMsgSetting.actionType
                });
                if (textError) {
                    validationErrors.actionText = textError;
                }

                const urlError = formValidate("actionUrl", inAppMsgSetting.actionUrl, {
                    actionType: inAppMsgSetting.actionType
                });
                if (urlError) {
                    validationErrors.actionUrl = urlError;
                }
            }
        }

        // Validate surveys (type === "3")
        if (type === "3") {
            const activeSteps = inAppMsgSetting.steps.filter((x) => x.isActive && x.questionType !== 8);
            if (activeSteps.length <= 0) {
                toast({ variant: "destructive", description: "Add minimum 1 step" });
                return;
            }
            for (const step of activeSteps) {
                if (step.questionType === 5) {
                    if (!step.options || step.options.length === 0) {
                        toast({ variant: "destructive", description: "At least one option is required." });
                        return;
                    }
                    const hasEmptyTitle = step.options.some(opt => !opt.title?.trim());
                    if (hasEmptyTitle) {
                        toast({ variant: "destructive", description: "Option cannot be empty." });
                        return;
                    }
                }
                // Validate actionUrl for each step if actionType is 1
                if (step.actionType === 1) {
                    const error = formValidate("actionUrl", step.actionUrl, { actionType: step.actionType });
                    if (error) {
                        validationErrors[`step_${step.stepId}_actionUrl`] = error;
                    }
                }
            }
        }

        // Validate checklists (type === "4")
        if (type === "4") {
            const activeChecklists = inAppMsgSetting.checklists.filter(x => x.isActive);
            for (const checklist of activeChecklists) {
                if (checklist.actionType === 1) {
                    const textError = formValidate("actionText", checklist.actionText, { actionType: checklist.actionType });
                    if (textError) {
                        validationErrors[`checklist_${checklist.checklistId}_actionText`] = textError;
                    }
                    const error = formValidate("actionUrl", checklist.actionUrl, { actionType: checklist.actionType });
                    if (error) {
                        validationErrors[`checklist_${checklist.checklistId}_actionUrl`] = error;
                    }
                }
            }
        }

        // Display all validation errors
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            Object.values(validationErrors).forEach(error => {
                toast({ variant: "destructive", description: error });
            });
            return;
        }

        // Process bodyText images
        if (inAppMsgSetting?.bodyText?.blocks) {
            inAppMsgSetting.bodyText.blocks = inAppMsgSetting.bodyText.blocks.map(block => {
                if (block.type === 'image' && block.data?.file?.url) {
                    return {
                        ...block,
                        data: {
                            ...block.data,
                            file: {
                                ...block.data.file,
                                url: extractImageFilename(block.data.file.url)
                            }
                        }
                    };
                }
                return block;
            });
        }

        // Process checklist description images
        if (Array.isArray(inAppMsgSetting.checklists)) {
            inAppMsgSetting.checklists = inAppMsgSetting.checklists.map(cl => {
                if (Array.isArray(cl?.description)) {
                    const updatedDescription = cl.description.map(block => {
                        if (block.type === 'image' && block.data?.file?.url) {
                            return {
                                ...block,
                                data: {
                                    ...block.data,
                                    file: {
                                        ...block.data.file,
                                        url: extractImageFilename(block.data.file.url)
                                    }
                                }
                            };
                        }
                        return block;
                    });
                    return {
                        ...cl,
                        description: updatedDescription
                    };
                }
                return cl;
            });
        }

        const startAt = inAppMsgSetting?.startAt
            ? moment(inAppMsgSetting.startAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const endAt = inAppMsgSetting?.endAt && moment(inAppMsgSetting.endAt).isValid()
            ? moment(inAppMsgSetting.endAt).format('YYYY-MM-DD HH:mm:ss')
            : null;

        const payload = {
            ...inAppMsgSetting,
            startAt,
            endAt,
            type,
            projectId: projectDetailsReducer.id,
        };

        setSaving(load);
        let data;
        if (typeFunc === 'create') {
            data = await apiService.createInAppMessage(payload);
        } else if (typeFunc === 'update') {
            data = await apiService.updateInAppMessage(payload, inAppMsgSetting.id);
        }

        setSaving('');
        if (data?.success) {
            toast({ description: data.message });
            if (typeFunc === 'create' && id === 'new') {
                navigate(`${baseUrl}/app-message`);
            }
        } else {
            toast({ variant: "destructive", description: data?.error?.message });
        }
    };

    const handleCancel = () => {
        setInAppMsgSetting(inAppMsgSetting);
        if (id === "new") {
            navigate(`${baseUrl}/app-message/type`)
        } else {
            navigate(`${baseUrl}/app-message?pageNo=${getPageNo}`)
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
                                    <span
                                        onClick={handleCancel}>
                                        {type === '1' && 'Post'}
                                        {type === '2' && 'Banners'}
                                        {type === '3' && 'Surveys'}
                                        {type === '4' && 'Checklist'}
                                    </span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem className={"cursor-pointer"}>
                                <BreadcrumbPage
                                    className={`w-full ${inAppMsgSetting?.title?.length > 30 ? "max-w-[200px] truncate" : ""}`}>{isLoading && id !== 'new' ? null : inAppMsgSetting?.title}</BreadcrumbPage>
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
                    <Button className={`w-[111px] font-medium hover:bg-primary`}
                            onClick={id === "new" ? () => handleMessage("create", 'createdByTop') : () => handleMessage('update','updatedByTop')}>
                        {(saving === 'createdByTop' || saving === 'updatedByTop') ? <Loader2 size={16} className={"animate-spin"}/> : "Save Changes"}
                    </Button>
                    <Button variant={"ghost hover-none"} className={"font-medium border border-primary text-primary"}
                            onClick={handleCancel}>Cancel</Button>
                </div>
            </div>
            <div className={"flex flex-wrap md:flex-nowrap h-[calc(100%_-_85px)] overflow-y-auto"}>
                <div className={"w-full md:max-w-[407px] w-full border-r h-auto md:h-full overflow-y-auto"}>
                    <SidebarInAppMessage id={id} type={type} inAppMsgSetting={inAppMsgSetting}
                                         setInAppMsgSetting={setInAppMsgSetting} selectedStepIndex={selectedStepIndex}
                                         setSelectedStepIndex={setSelectedStepIndex} selectedStep={selectedStep}
                                         setSelectedStep={setSelectedStep} formValidate={formValidate} saving={saving}
                                         formError={formError} setFormError={setFormError} handleMessage={handleMessage}
                    />
                </div>
                <div className={"bg-muted w-full h-[100vh] md:h-full overflow-y-auto"}>
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
                            (allStatusAndTypes?.setting?.isBranding === 1) &&
                            <h6 className="text-sm font-medium text-end mt-1 mr-2">Powered by {" "}<a
                                className="text-primary" href="https://quickhunt.app" target="_blank">quickhunt</a></h6>
                        }
                    </Card>
                </div>
            </div>
        </Fragment>
    );
};

export default UpdateInAppMessage;