import React, { Fragment, useState,useEffect, } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Loader2, Menu, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {useSelector,useDispatch} from "react-redux";
import {ApiService} from "../../../utils/ApiService";
import {toast} from "../../ui/use-toast";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import EmptyData from "../../Comman/EmptyData";
import randomColor from 'randomcolor';
import DeleteDialog from "../../Comman/DeleteDialog";

const initialStatus = {
    title: '',
    colorCode: '',
};

const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: []
}

const Statuses = () => {
    const {theme} = useTheme();
    const dispatch = useDispatch();
    let apiService = new ApiService();
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);

    const [labelError, setLabelError] = useState(initialStatus);
    const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
    const [statusList,setStatusList]=useState([]);
    const [isEdit,setIsEdit]= useState(null);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteIndex,setDeleteIndex] =useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);

    useEffect(() => {
        if(allStatusAndTypes.roadmapStatus){
            getAllRoadmapStatus();
        }
    }, [allStatusAndTypes.roadmapStatus]);

    const getAllRoadmapStatus = () => {
        setStatusList(allStatusAndTypes.roadmapStatus);
    }

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const cleanedValue = name === "title" ? value.trimStart() : value;
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], [name]: cleanedValue };
        setStatusList(updatedColors);
        setLabelError({
            ...labelError,
            [name]: validation(name, cleanedValue)
        });
    };

    const onBlur = (event) => {
        const {name, value} = event.target;
        setLabelError({
            ...labelError,
            [name]: validation(name, value)
        });
    };

    const validation = (name, value) => {
        switch (name) {
            case "title":
                if(!value || value.trim() === "") {
                    return "Status name is required."
                } else {
                    return "";
                }
            default: {
                return  "";
            }
        }
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], colorCode: newColor.clr };
        setStatusList(updatedColors);
    };

    const handleShowInput = () => {
        const clone = [...statusList];
        clone.push({title: '', colorCode: randomColor(),});
        setIsEdit(clone.length - 1);
        setStatusList(clone);
        setLabelError(initialStatus);
    };

    const handleAddNewStatus = async (newStatus, index) => {
        let validationErrors = {};
        Object.keys(newStatus).forEach(name => {
            const error = validation(name, newStatus[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setLabelError(validationErrors);
            return;
        }

        setIsSave(true)
        const payload = {
            projectId: `${projectDetailsReducer.id}`,
            title: newStatus.title,
            colorCode: newStatus.colorCode,
        }
        const data = await apiService.createSettingsStatus(payload)
        if (data.success) {
            let clone = [...statusList];
            clone[index] = {...data.data};
            setStatusList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmapStatus: clone}))
            setIsSave(false);
            setIsEdit(null);

            toast({
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data?.error?.message,
                variant: "destructive",
            })
        }
    };

    const handleSaveStatus = async (index) => {
        const updatedColors = [...statusList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.title || labelToSave.title.trim() === "") {
            setLabelError({
                ...labelError,
                title: "Status name is required."
            });
            return;
        }
        setLabelError({
            ...labelError,
            title: ""
        });

        setIsSave(true)
        const payload = {
            projectId: `${projectDetailsReducer.id}`,
            title: labelToSave.title,
            colorCode: labelToSave.colorCode,
        }
        const data = await apiService.updateSettingsStatus(payload, labelToSave.id)
        if (data.success) {
            let clone = [...statusList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmapStatus: clone}))
            }
            setIsSave(false)
            toast({
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data?.error.message,
                variant: "destructive"
            })
        }

        updatedColors[index] = { ...labelToSave };
        setStatusList(updatedColors);
        setIsEdit(null);
    };

    const handleDeleteStatus = (id,index) => {
        setDeleteId(id);
        setDeleteIndex(index);
        setOpenDelete(true);
        setStatusList(allStatusAndTypes.roadmapStatus);
        setIsEdit(null);
    };

    const onEdit = (index) => {
        setLabelError(initialStatus);
        const clone = [...statusList]
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setStatusList(clone)
        }else if (isEdit !== index){
            setStatusList(allStatusAndTypes?.roadmapStatus);
            setIsEdit(index);
        }
        else {
            setIsEdit(index)
        }
    }

    const onEditCancel = () => {
        setIsEdit(null)
        setStatusList(allStatusAndTypes.roadmapStatus)
    }

    const onDragStart = (event) => {
        const initialPosition = Number(event.currentTarget.dataset.position);
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: initialPosition,
            isDragging: true,
            originalOrder: statusList
        });
        event.dataTransfer.setData("text/html", '');
    }

    const onDragOver = (event) => {
        event.preventDefault();
        let newList = dragAndDrop.originalOrder;
        const draggedFrom = dragAndDrop.draggedFrom;
        const draggedTo = Number(event.currentTarget.dataset.position);
        const itemDragged = newList[draggedFrom];
        const remainingItems = newList.filter((item, index) => index !== draggedFrom);

        newList = [
            ...remainingItems.slice(0, draggedTo),
            itemDragged,
            ...remainingItems.slice(draggedTo)
        ];

        if (draggedTo !== dragAndDrop.draggedTo) {
            setDragAndDrop({
                ...dragAndDrop,
                updatedOrder: newList,
                draggedTo: draggedTo
            })
        }

    }

    const onDrop = async (event) => {
        const clone = [];
        const rank = [];
        dragAndDrop.updatedOrder.map((x, i) => {
            clone.push({...x, rank: i, })
            rank.push({rank:i, id:x.id})
        });
        const payload = {
            ranks:rank
        }
        setStatusList(clone);
        dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmapStatus: clone}));
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        });
        const data = await apiService.roadmapSettingsStatusRank(payload)
        if (data.success) {
            toast({
                description:data.message
            })
        } else {
            toast({
                description:data?.error.message,
                variant: "destructive"
            })
        }

    }

    const onDragLeave = () => {
        setDragAndDrop({
            ...dragAndDrop,
            draggedTo: null
        });
    }

    const deleteParticularRow = async () => {
        if (deleteId) {
            setIsDeleteLoading(true);
            const data = await apiService.onDeleteSettingsStatus(deleteId)
            if (data.success) {
                const clone = [...statusList];
                clone.splice(deleteIndex, 1)
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmapStatus: clone}))
                toast({
                    description:data.message
                })
            }else {
                toast({
                    description:data?.error.message,
                    variant: "destructive"
                });
            }
            setOpenDelete(false);
            setIsDeleteLoading(false);
        }
    }

    return (
        <Fragment>
            {
                openDelete &&
                <DeleteDialog
                    title={"You really want to delete this Status?"}
                    isOpen={openDelete}
                    onOpenChange={() => setOpenDelete(false)}
                    onDelete={deleteParticularRow}
                    isDeleteLoading={isDeleteLoading}
                    deleteRecord={deleteId}
                />
            }
            <Card>
                <CardHeader className="flex flex-row flex-wrap gap-y-2 justify-between items-center border-b p-4 sm:px-5 sm:py-4">
                    <div>
                        <CardTitle className="text-xl lg:text-2xl font-medium">Statuses</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground p-0">
                            Track ideas on your roadmap with statuses.
                        </CardDescription>
                    </div>
                    <Button
                        disabled={isEdit !== null}
                        className={"gap-2 font-medium hover:bg-primary m-0"}
                        onClick={handleShowInput}
                    >
                        <Plus strokeWidth={3} size={18} />New Status
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className={"grid grid-cols-1 overflow-auto sm:overflow-visible whitespace-nowrap"}>
                        <Table>
                        <TableHeader className={"dark:bg-transparent bg-muted"}>
                            <TableRow>
                                {
                                    ["","Status Name","Status Color","Action"].map((x,i)=>{
                                        return(
                                            <TableHead key={i} className={`px-2 py-[10px] md:px-3 font-medium text-card-foreground dark:text-muted-foreground ${i === 0 ? "w-[48px]" : i === 1 ? "w-2/5" : i === 2 ? "w-2/5" : i === 3 ? "w-2/5" : ""}`}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                statusList.length > 0 ? <Fragment>
                                {(statusList || []).map((x, i) => (
                                    <TableRow
                                        id={i}
                                        key={i}
                                        position={i}
                                        data-position={i}
                                        draggable={!isEdit}
                                        onDragStart={onDragStart}
                                        onDragOver={isEdit ? null : onDragOver}
                                        onDrop={onDrop}
                                        onDragLeave={onDragLeave}
                                    >
                                        <TableCell className={`px-[12px] py-[10px]`}><Menu className={"cursor-grab"} size={16}/></TableCell>
                                        {
                                            isEdit === i ?
                                                <Fragment>
                                                    <TableCell className={"px-[12px] py-[10px]"}>
                                                        <Input
                                                            className={"bg-card h-9"}
                                                            type="title"
                                                            value={x.title}
                                                            name={"title"}
                                                            onBlur={onBlur}
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            placeholder={"Enter Status Name"}
                                                        />
                                                        {
                                                            labelError.title ?
                                                                <div className="grid gap-2 mt-[4px]">
                                                                    <span className="text-red-500 text-sm">{labelError.title}</span>
                                                                </div> : ""
                                                        }
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-medium text-xs px-[12px] py-[10px] align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex items-center"}>
                                                            <ColorInput name={"clr"} value={x.colorCode} onChange={(color) => onChangeColorColor(color, i)}/>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={`px-[12px] py-[10px] align-top ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex items-center gap-2"}>
                                                            <Fragment>
                                                                {
                                                                    x.id ? <Button
                                                                        variant="outline hover:bg-transparent"
                                                                        className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                        onClick={() => handleSaveStatus(i)}
                                                                    >
                                                                        {isSave ? <Loader2 className="h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                    </Button> : <Button
                                                                        className="text-sm font-medium h-[30px] w-[93px] hover:bg-primary"
                                                                        onClick={() => handleAddNewStatus(x, i)}
                                                                    >
                                                                        {isSave ? <Loader2 className={"h-4 w-4 animate-spin"}/> : "Add Status"}
                                                                    </Button>
                                                                }

                                                                <Button
                                                                    variant="outline hover:bg-transparent"
                                                                    className="p-1 border w-[30px] h-[30px]"
                                                                    onClick={() =>  x.id ? onEditCancel() : onEdit(null)}
                                                                >
                                                                    <X size={16}/>
                                                                </Button>
                                                            </Fragment>
                                                        </div>
                                                    </TableCell>
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    <TableCell className={`px-2 py-[10px] md:px-3 font-medium text-xs max-w-[140px] truncate text-ellipsis overflow-hidden whitespace-nowrap ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={`font-medium text-xs px-[12px] py-[10px] ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex items-center gap-1"}>
                                                            <Square size={16} strokeWidth={1} fill={x.colorCode} stroke={x.colorCode}/>
                                                            <p>{x.colorCode}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className={`flex gap-2 px-[12px] py-[10px] ${theme === "dark" ? "" : "text-muted-foreground"} `}>
                                                        <Fragment>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className="p-1 border w-[30px] h-[30px]"
                                                                onClick={() => onEdit(i)}
                                                            >
                                                                <Pencil size={16}/>
                                                            </Button>
                                                            <Button
                                                                variant="outline hover:bg-transparent"
                                                                className="p-1 border w-[30px] h-[30px]"
                                                                onClick={() => handleDeleteStatus(x.id, i)}
                                                                disabled={statusList.filter(stat => stat.id).length === 1}
                                                            >
                                                                <Trash2 size={16}/>
                                                            </Button>
                                                        </Fragment>
                                                    </TableCell>
                                                </Fragment>
                                        }
                                    </TableRow>
                                ))}
                            </Fragment> :
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyData />
                                        </TableCell>
                                    </TableRow>
                            }
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
        </Card>
        </Fragment>
    );
};

export default Statuses;
