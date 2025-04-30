import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import {apiService, baseUrl} from "../../utils/constent";
import {useNavigate} from "react-router";
import CommCreateSheet from "../Comman/CommCreateSheet";
import {inboxMarkReadAction} from "../../redux/action/InboxMarkReadAction";

const initialState = {
    title: "",
    images: [],
    topicId: [],
    projectId: "",
    description: "",
    boardId: ""
}

const initialStateError = {
    title: "",
    description: "",
    boardId: ""
}

const CreateIdea = ({isOpen, onOpen, onClose, closeCreateIdea, setIdeasList, ideasList, getAllIdea, pageNo}) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const dispatch = useDispatch();
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const inboxMarkReadReducer = useSelector(state => state.inboxMarkRead);

    const [ideaDetail, setIdeaDetail] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            setTopicLists(allStatusAndTypes.topics)
            setIdeaDetail({...initialState, boardId: allStatusAndTypes?.boards[0]?.id})
        }
    }, [projectDetailsReducer.id, allStatusAndTypes]);

    const handleChange = (id) => {
        const clone = [...ideaDetail.topicId];
        const index = clone.indexOf(id);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(id);
        }
        setIdeaDetail({ ...ideaDetail, topicId: clone });
    };

    const convertToSlug = (Text) => {
        return Text.toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
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
        formData.append('slugUrl', convertToSlug(ideaDetail?.title || ''));
        formData.append('description', ideaDetail.description);
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('boardId', ideaDetail.boardId);
        ideaDetail.topicId.forEach(id => {
            formData.append('topicId[]', id);
        });
        const data = await apiService.createIdea(formData)
        setIsLoading(false)
        if(data.success){
            const clone = [...ideasList];
            clone.push(data.data)
            setIdeasList(clone);
            setIdeaDetail(initialState)
            const cloneInbox = [...inboxMarkReadReducer];
            cloneInbox.push({...data.data, isRead: 1})
            dispatch(inboxMarkReadAction(cloneInbox));
            await getAllIdea()
            closeCreateIdea()
            navigate(`${baseUrl}/ideas?pageNo=${pageNo}`);
            toast({description: data.message})
        } else {
            toast({description: data?.error?.message, variant: "destructive"})
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
            case "boardId":
                if (!value || value.toString().trim() === "") {
                    return "Board is required";
                } else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const onCancel = () => {
        setIdeaDetail(initialState);
        setFormError(initialStateError);
        onClose();
        navigate(`${baseUrl}/ideas?pageNo=${pageNo}`);
    }

    return (
        <div>
            <CommCreateSheet
                isOpen={isOpen}
                onOpen={onOpen}
                onCancel={onCancel}
                ideaDetail={ideaDetail}
                setIdeaDetail={setIdeaDetail}
                handleChange={handleChange}
                topicLists={topicLists}
                allStatusAndTypes={allStatusAndTypes}
                formError={formError}
                isLoading={isLoading}
                onCreateIdea={onCreateIdea}
            />
        </div>
    );
};

export default CreateIdea;