import React, {useState, useEffect} from 'react';
import {ApiService} from "../../utils/ApiService";
import {useSelector} from "react-redux";
import {useToast} from "../ui/use-toast";
import {useTheme} from "../theme-provider";
import CommCreateSheet from "../Comman/CommCreateSheet";

const initialState = {
    title: "",
    images: [],
    topic: [],
    project_id: "",
    description: "",
    board: ""
}

const initialStateError = {
    title: "",
    description: "",
    board: ""

}

const CreateRoadmapIdea = ({isOpen, onOpen, onClose, closeCreateIdea, selectedRoadmap, roadmapList, setRoadmapList,}) => {
    const {theme} = useTheme()
    let apiSerVice = new ApiService();
    const { toast } = useToast()
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const [ideaDetail, setIdeaDetail] = useState(initialState);
    const [formError, setFormError] = useState(initialStateError);
    const [topicLists, setTopicLists] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(projectDetailsReducer.id){
            setTopicLists(allStatusAndTypes.topics)
            setIdeaDetail({...initialState, board: allStatusAndTypes?.boards[0]?.id})
        }
    }, [projectDetailsReducer.id, allStatusAndTypes]);

    const handleChange = (id) => {
        const clone = [...ideaDetail.topic];
        const index = clone.indexOf(id);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            clone.push(id);
        }
        setIdeaDetail({ ...ideaDetail, topic: clone });
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
        formData.append('slug_url', ideaDetail.title ? ideaDetail.title.replace(/ /g,"-").replace(/\?/g, "-") :"");
        formData.append('description', ideaDetail.description);
        formData.append('project_id', projectDetailsReducer.id);
        formData.append('board', ideaDetail.board);
        formData.append('topic', ideaDetail.topic.join());
        formData.append('roadmap_id', selectedRoadmap && selectedRoadmap ? selectedRoadmap : "");
        const data = await apiSerVice.createIdea(formData)
        if(data.status === 200){
            let cloneRoadmap = [...roadmapList.columns];
            // cloneRoadmap.push(data.data);
            const roadmapIndex = cloneRoadmap.findIndex((x) => x.id === selectedRoadmap);
            if(roadmapIndex !== -1) {
                const cloneIdea = [...cloneRoadmap[roadmapIndex].ideas];
                cloneIdea.unshift(data.data);
                cloneRoadmap[roadmapIndex] = {...cloneRoadmap[roadmapIndex], ideas: cloneIdea, cards: cloneIdea}
            }
            setIsLoading(false)
            setIdeaDetail(initialState)
            setRoadmapList({columns: cloneRoadmap});
            // closeCreateIdea()
            onClose()
            toast({description: data.message})
        } else {
            setIsLoading(false)
            toast({description: data.message,variant: "destructive" })
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
            case "board":
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