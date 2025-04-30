import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import CommCreateSheet from "../Comman/CommCreateSheet";
import {apiService} from "../../utils/constent";

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

const CreateRoadmapIdea = ({
                               isOpen,
                               onOpen,
                               onClose,
                               closeCreateIdea,
                               selectedRoadmap,
                               roadmapList,
                               setRoadmapList,
                           }) => {
    const {toast} = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [ideaDetail, setIdeaDetail] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [topicLists, setTopicLists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (projectDetailsReducer.id) {
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
        setIdeaDetail({...ideaDetail, topicId: clone});
    };

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
        formData.append('slugUrl', ideaDetail.title ? ideaDetail.title.replace(/ /g, "-").replace(/\?/g, "-") : "");
        formData.append('description', ideaDetail.description);
        formData.append('projectId', projectDetailsReducer.id);
        formData.append('boardId', ideaDetail.boardId);
        ideaDetail.topicId.forEach(id => {
            formData.append('topicId[]', id);
        });
        formData.append('roadmapStatusId', selectedRoadmap && selectedRoadmap ? selectedRoadmap : "");
        const data = await apiService.createIdea(formData)
        setIsLoading(false)
        if (data.success) {
            let cloneRoadmap = [...roadmapList.columns];
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap);
            if (roadmapIndex !== -1) {
                const cloneIdea = [...cloneRoadmap[roadmapIndex].ideas];
                cloneIdea.unshift(data.data);
                cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdea, cards: cloneIdea}
            }
            setIdeaDetail(initialState)
            setRoadmapList({columns: cloneRoadmap});
            onClose()
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

export default CreateRoadmapIdea;