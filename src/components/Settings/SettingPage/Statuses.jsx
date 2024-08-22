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
import {Skeleton} from "../../ui/skeleton";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
import randomColor from 'randomcolor';


const initialStatus = {
    title: '',
    color_code: '',
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
    const [labelError, setLabelError] = useState(initialStatus);
    const [isEdit,setIsEdit]= useState(null);
    const [statusList,setStatusList]=useState([]);
    const [isSave,setIsSave]= useState(false);
    const [deleteId,setDeleteId]=useState(null);
    const [deleteIndex,setDeleteIndex] =useState(null);
    const [openDelete,setOpenDelete]=useState(false);
    const [isDeleteLoading,setIsDeleteLoading]=useState(false);
    const [dragAndDrop, setDragAndDrop] = useState(initialDnDState);
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const dispatch = useDispatch();
    let apiService = new ApiService();

    useEffect(() => {
        if(allStatusAndTypes.roadmap_status){
            getAllRoadmapStatus();
        }
    }, [allStatusAndTypes.roadmap_status]);

    const getAllRoadmapStatus = () => {
        setStatusList(allStatusAndTypes.roadmap_status);
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], color_code: newColor.color_code };
        setStatusList(updatedColors);
    };

    const handleShowInput = () => {
        const clone = [...statusList];
        clone.push({title: '', color_code: randomColor(),});
        setIsEdit(clone.length - 1);
        setStatusList(clone)
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedColors = [...statusList];
        updatedColors[index] = { ...updatedColors[index], [name]: value };
        setStatusList(updatedColors);
        setLabelError(labelError => ({
            ...labelError,
            [name]: ""
        }));
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
            project_id: `${projectDetailsReducer.id}`,
            title: newStatus.title,
            color_code: newStatus.color_code,
        }
        const data = await apiService.createRoadmapStatus(payload)
        if (data.status === 200) {
            let clone = [...statusList];
            clone[index] = {...data.data};
            setStatusList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            setIsSave(false);
            setIsEdit(null);

            toast({
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data.message,
                variant: "destructive",
            })
        }
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
            project_id: `${projectDetailsReducer.id}`,
            title: labelToSave.title,
            color_code: labelToSave.color_code,
        }
        const data = await apiService.updateRoadmapStatus(payload, labelToSave.id)
        if (data.status === 200) {
            let clone = [...statusList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
            }
            setIsSave(false)
            toast({
                description:data.message
            })
        } else {
            setIsSave(false)
            toast({
                description:data.message,
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
    };

    const onEdit = (index) => {
        const clone = [...statusList]
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setStatusList(clone)
        } else {
            if(isEdit !== index){
                setStatusList(allStatusAndTypes.roadmap_status)
            }
            setIsEdit(index)
        }
    }

    const onEditCancel = () => {
        setIsEdit(null)
        setStatusList(allStatusAndTypes.roadmap_status)
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
            rank:rank
        }
        setStatusList(clone);
        dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}));
        setDragAndDrop({
            ...dragAndDrop,
            draggedFrom: null,
            draggedTo: null,
            isDragging: false
        });
        const data = await apiService.roadmapStatusRank(payload)
        if (data.status === 200) {
            toast({
                description:data.message
            })
        } else {
            toast({
                description:data.message,
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
            const data = await apiService.deleteRoadmapStatus(deleteId)
            if (data.status === 200) {
                const clone = [...statusList];
                clone.splice(deleteIndex, 1)
                setStatusList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, roadmap_status: clone}))
                toast({
                    description:data.message
                })
            } else if(data.status === 201){
                toast({
                    description:data.message,
                    variant: "destructive"
                });
            } else {
                toast({
                    description:data.message,
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
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this status ?</DialogTitle>
                                    <DialogDescription className={"text-start"}>This action can't be undone.</DialogDescription>
                                </div>
                                <X size={16} className={"m-0 cursor-pointer"} onClick={() => setOpenDelete(false)}/>
                            </DialogHeader>
                            <DialogFooter className={"flex-row justify-end space-x-2"}>
                                <Button variant={"outline hover:none"}
                                        className={"text-sm font-semibold border"}
                                        onClick={() => setOpenDelete(false)}>Cancel</Button>
                                <Button
                                    variant={"hover:bg-destructive"}
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isDeleteLoading ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={deleteParticularRow}
                                >
                                    {isDeleteLoading ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <Card>
                <CardHeader className="flex flex-row flex-wrap gap-y-2 justify-between items-center border-b p-4 sm:p-6">
                    <div>
                        <CardTitle className="text-lg sm:text-2xl font-medium">Statuses</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground p-0">
                            Use Statuses to track Ideas on your Roadmap.
                        </CardDescription>
                    </div>
                    <Button
                        disabled={isEdit !== null}
                        className="flex gap-1 items-center text-sm font-semibold m-0"
                        onClick={handleShowInput}
                    >
                        <div><Plus size={20} /></div>New Status
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <div className={"grid grid-cols-1 overflow-visible whitespace-nowrap"}>
                        <Table>
                        <TableHeader className={"p-0"}>
                            <TableRow>
                                {
                                    ["","Status Name","Status Color","Action"].map((x,i)=>{
                                        return(
                                            <TableHead className={`p-0 ${theme === "dark" ? "" : "text-card-foreground"} ${i === 0 ? "w-[48px]" : i === 1 ? "w-2/5" : i === 2 ? "text-center" : i === 3 ? "text-end pr-4" : ""}`}>{x}</TableHead>
                                        )
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                statusList.length > 0 ? <>
                                {(statusList || []).map((x, i) => (
                                    <TableRow id={i} key={i} position={i} data-position={i} draggable={"true"} onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} onDragLeave={onDragLeave}>
                                        <TableCell><Menu className={"cursor-grab"} size={16}/></TableCell>
                                        {
                                            isEdit === i ?
                                                <Fragment>
                                                    <TableCell className={"py-[8.5px] pl-0 py-[11px]"}>
                                                        <Input
                                                            className={"bg-card h-9"}
                                                            type="title"
                                                            value={x.title}
                                                            name={"title"}
                                                            onBlur={onBlur}
                                                            onChange={(e) => handleInputChange(e, i)}
                                                        />
                                                        <div className="grid gap-2">
                                                            {
                                                                labelError.title &&
                                                                <span className="text-red-500 text-sm">{labelError.title}</span>
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell
                                                        className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center"}>
                                                            <ColorInput name={"color_code"} value={x.color_code} onChange={(color) => onChangeColorColor(color, i)}/>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end gap-2 pr-4">
                                                        <Fragment>
                                                            {
                                                                x.id ? <Button
                                                                    variant="outline hover:bg-transparent"
                                                                    className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                    onClick={() => handleSaveStatus(i)}
                                                                >
                                                                    {isSave ? <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> : <Check size={16}/>}
                                                                </Button> : <Button
                                                                    variant=""
                                                                    className="text-sm font-semibold h-[30px]"
                                                                    onClick={() => handleAddNewStatus(x, i)}
                                                                >
                                                                    {isSave ? <Loader2 className={"mr-2  h-4 w-4 animate-spin"}/> : "Add Status"}
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
                                                    </TableCell>
                                                </Fragment>
                                                :
                                                <Fragment>
                                                    <TableCell className={`font-medium text-xs py-[8.5px] pl-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.title}</TableCell>
                                                    <TableCell
                                                        className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                        <div className={"flex justify-center items-center gap-1"}>
                                                            <Square size={16} strokeWidth={1} fill={x.color_code} stroke={x.color_code}/>
                                                            <p>{x.color_code}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="flex justify-end gap-2 pr-4">
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
                                                            >
                                                                <Trash2 size={16}/>
                                                            </Button>
                                                        </Fragment>
                                                    </TableCell>
                                                </Fragment>
                                        }
                                    </TableRow>
                                ))}
                            </> :
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
