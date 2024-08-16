import React, {Fragment, useEffect, useState,} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../ui/card";
import {Button} from "../../ui/button";
import {Check, Loader2, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {ApiService} from "../../../utils/ApiService";
import {useDispatch, useSelector} from "react-redux";
import {allStatusAndTypesAction} from "../../../redux/action/AllStatusAndTypesAction";
import {toast} from "../../ui/use-toast";
import EmptyData from "../../Comman/EmptyData";
import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "../../ui/dialog";
import randomColor from 'randomcolor';

const initialNewLabel = {
    label_name: '',
    label_color_code:"",
};

const Labels = () => {
    const {theme} = useTheme();
    const [newLabel, setNewLabel] = useState({...initialNewLabel });
    const [labelError, setLabelError] = useState(initialNewLabel);
    const [isEdit,setIsEdit]= useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [labelList, setLabelList] = useState([]);
    const [deleteId,setDeleteId]=useState(null);
    const [isSave,setIsSave]=useState(false);
    const [openDelete,setOpenDelete] = useState(false);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);

    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const apiService = new ApiService();
    const dispatch = useDispatch();

    useEffect(() => {
        if(allStatusAndTypes.labels){
            getAllLabels();
        }
    }, [allStatusAndTypes.labels]);

    const getAllLabels = async () => {
        setLabelList(allStatusAndTypes.labels);
        setIsLoading(false);
    }

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...labelList];
        updatedColors[index] = { ...updatedColors[index], label_color_code: newColor.clr };
        setLabelList(updatedColors);
    };

    const handleShowInput = () => {
        const clone = [...labelList];
        clone.push(initialNewLabel);
        setLabelList(clone);
        setIsEdit(clone.length - 1);
        setNewLabel({...newLabel,
            label_color_code: randomColor()
        });

    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        if (index !== undefined) {
            const updatedColors = [...labelList];
            updatedColors[index] = { ...updatedColors[index], [name]: value };
            setLabelList(updatedColors);
        } else {
            setNewLabel({ ...newLabel, [name]: value });
        }
        setLabelError(labelError => ({...labelError, [name]: ""}));
    };

    const handleAddNewLabel = async (record,index) => {
        let validationErrors = {};
        Object.keys(newLabel).forEach(name => {
            const error = validation(name, newLabel[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setLabelError(validationErrors);
            return;
        }
        setIsSave(true);
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            label_name: record.label_name,
            label_color_code: record.label_color_code,
            label_sort_order_id: record.label_sort_order_id || "1",
            user_browser: record.user_browser || '',
            user_ip_address: record.user_ip_address || '',
        }

        const data = await apiService.createLabels(payload)
        if (data.status === 200) {
            let clone = [...labelList];
            clone.push(data.data);
            clone.splice(index, 1);
            setLabelList(clone);
            dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            setIsSave(false);
            toast({
                description:data.message
            })
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
        setNewLabel({ ...initialNewLabel });
        setIsEdit(null);
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
            case "label_name":
                if(!value || value.trim() === "") {
                    return "Label name is required."
                } else {
                    return "";
                }
            default: {
                return  "";
            }
        }
    }

    const handleEditLabel = (index) => {
        setLabelError(initialNewLabel);
        const clone = [...labelList]
        if(isEdit !== null && !clone[isEdit]?.id){
            clone.splice(isEdit, 1)
            setIsEdit(index)
            setLabelList(clone)
        } else {
            setIsEdit(index)
        }
    };

    const handleSaveLabel = async (index) => {
        const updatedColors = [...labelList];
        const labelToSave = updatedColors[index];

        if (!labelToSave.label_name || labelToSave.label_name.trim() === "") {
            setLabelError({
                ...labelError,
                label_name: "Label name is required."
            });
            return;
        }
        setIsSave(true);
        const payload = {
            project_id: `${projectDetailsReducer.id}`,
            label_name: labelToSave.label_name,
            label_color_code: labelToSave.label_color_code,
            label_sort_order_id: labelToSave.label_sort_order_id || '',
            user_browser: labelToSave.user_browser || '',
            user_ip_address: labelToSave.user_ip_address || '',
        }
        const data = await apiService.updateLabels(payload, labelToSave.id)
        if (data.status === 200) {
            let clone = [...labelList];
            let index = clone.findIndex((x) => x.id === labelToSave.id);
            if (index !== -1) {
                clone[index] = data.data;
                setLabelList(clone)
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}))
            }
            setIsSave(false)
            toast({
                description:data.message
            })
        } else {
            setIsSave(false);
            toast({
                description:data.message,
                variant: "destructive"
            })
        }
        setLabelError({
            ...labelError,
            label_name: ""
        });
        updatedColors[index] = { ...labelToSave };
        setIsEdit(null);
    };

    const handleDeleteLabel = (id) => {
        setDeleteId(id);
        setOpenDelete(true);
    };

    const onDelete =async () =>{
        setIsLoadingDelete(true);
        const clone = [...labelList];
        const indexToDelete = clone.findIndex((x)=>x.id == deleteId);
        if (deleteId) {
            const data = await apiService.deleteLabels(deleteId)
            if (data.status === 200) {
                clone.splice(indexToDelete,1);
                setLabelList(clone);
                dispatch(allStatusAndTypesAction({...allStatusAndTypes, labels: clone}));
                toast({
                    description:data.message,
                })
            } else {
                toast({
                    description:data.message,
                    variant: "destructive",
                })
            }
        } else {
            const clone = [...labelList];
            clone.splice(indexToDelete, 1);
            setLabelList(clone);
        }
        setOpenDelete(false);
        setIsLoadingDelete(false);
    }

    const handleCancel = (index) => {
        const clone = [...labelList];
        clone.splice(index,1);
        setLabelList(clone);
        setNewLabel(initialNewLabel);
        setIsEdit(null);
        setLabelError(initialNewLabel);
    }

    return (
        <Card>
            {
                openDelete &&
                <Fragment>
                    <Dialog open onOpenChange={()=> setOpenDelete(false)}>
                        <DialogContent className="max-w-[350px] w-full sm:max-w-[525px] p-3 md:p-6 rounded-lg">
                            <DialogHeader className={"flex flex-row justify-between gap-2"}>
                                <div className={"flex flex-col gap-2"}>
                                    <DialogTitle className={"text-start"}>You really want delete this label?</DialogTitle>
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
                                    className={` ${theme === "dark" ? "text-card-foreground" : "text-card"} ${isLoadingDelete === true ? "py-2 px-6" : "py-2 px-6"} w-[76px] text-sm font-semibold bg-destructive`}
                                    onClick={onDelete}
                                >
                                    {isLoadingDelete ? <Loader2 size={16} className={"animate-spin"}/> : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </Fragment>
            }

            <CardHeader className="flex flex-row justify-between items-center border-b p-4 flex-wrap md:flex-nowrap sm:p-6 gap-y-2">
                <div>
                    <CardTitle className="text-lg sm:text-2xl font-medium">Labels</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground p-0">
                        Use Labels to organise your Changelog
                    </CardDescription>
                </div>
                <Button
                    disabled={isEdit != null}
                    className="flex gap-1 items-center text-sm font-semibold m-0"
                    onClick={handleShowInput}
                >
                    <div><Plus size={20} /></div>New Label
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className={"grid grid-cols-1 overflow-visible whitespace-nowrap"}>
                    <Table>
                    <TableHeader className="p-0">
                        <TableRow>
                            {
                                ["Label Name","Label Color","Action"].map((x,i)=>{
                                    return(
                                        <TableHead key={i} className={`px-2 py-[10px] md:px-3 ${i === 0 ? "w-2/5" : i === 1 ? "w-1/5 text-center" : "pr-[39px] text-end"} pl-4 ${theme === "dark" ? "" : "text-card-foreground"}`}>{x}</TableHead>
                                    )
                                })
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                             labelList.length > 0 ? <>
                                {(labelList || []).map((x, i) => (

                                    <TableRow key={x.id}>
                                        {
                                            isEdit == i && x.id ?  <Fragment>
                                                                        <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                            <Input
                                                                                className={"bg-card h-9 "}
                                                                                type="text"
                                                                                value={x.label_name}
                                                                                name={"label_name"}
                                                                                onBlur={onBlur}
                                                                                onChange={(e) => handleInputChange(e, i)}
                                                                            />
                                                                            <div className="grid gap-2">
                                                                                {
                                                                                    labelError.label_name && <span className="text-red-500 text-sm">{labelError.label_name}</span>
                                                                                }
                                                                            </div>
                                                                        </TableCell>

                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <div className={"flex justify-center items-center"}>
                                                                                <ColorInput style={{width:"102px"}} name={"clr"} value={x.label_color_code}
                                                                                            onChange={(color) => onChangeColorColor(color, i)}/>
                                                                            </div>
                                                                        </TableCell>

                                                                        <TableCell
                                                                            className={`flex justify-end gap-2 px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className={`p-1 border w-[30px] h-[30px] ${isSave ? "justify-center items-center" : ""}`}
                                                                                onClick={() => handleSaveLabel(i)}
                                                                            >
                                                                                {isSave ?
                                                                                    <Loader2 className="mr-1 h-4 w-4 animate-spin justify-center"/> :
                                                                                    <Check size={16}/>}
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className="p-1 border w-[30px] h-[30px]"
                                                                                onClick={() => {
                                                                                   setIsEdit(null);
                                                                                   setNewLabel(initialNewLabel);
                                                                                   setLabelList(allStatusAndTypes.labels);
                                                                                }}
                                                                            >
                                                                                <X size={16}/>
                                                                            </Button>
                                                                        </TableCell>
                                                                 </Fragment> :

                                                                <Fragment>
                                                                    {x.id ? <Fragment>
                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.label_name}</TableCell>

                                                                        <TableCell
                                                                            className={`px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <div
                                                                                className={"flex justify-center items-center gap-1"}>
                                                                                <Square size={16} strokeWidth={1}
                                                                                        fill={x.label_color_code}
                                                                                        stroke={x.label_color_code}/>
                                                                                <p>{x.label_color_code}</p>
                                                                            </div>
                                                                        </TableCell>

                                                                        <TableCell
                                                                            className={`flex justify-end gap-2 px-2 py-[10px] md:px-3 font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className="p-1 border w-[30px] h-[30px]"
                                                                                onClick={() => {
                                                                                    handleEditLabel(i);
                                                                                }}
                                                                            >
                                                                                <Pencil size={16}/>
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline hover:bg-transparent"
                                                                                className="p-1 border w-[30px] h-[30px]"
                                                                                onClick={() => handleDeleteLabel(x.id, i)}
                                                                            >
                                                                                <Trash2 size={16}/>
                                                                            </Button>
                                                                        </TableCell>
                                                                    </Fragment> :
                                                                    <Fragment>
                                                                            <TableCell className={"px-2 py-[10px] md:px-3"}>
                                                                                <Input
                                                                                    className={"bg-card"}
                                                                                    type="text"
                                                                                    id="labelName"
                                                                                    name="label_name"
                                                                                    value={newLabel.label_name}
                                                                                    onChange={handleInputChange}
                                                                                    placeholder="Enter Label Name"
                                                                                    onBlur={onBlur}
                                                                                />
                                                                                <div className="grid gap-2">
                                                                                    {
                                                                                        labelError.label_name &&
                                                                                        <span className="text-red-500 text-sm">{labelError.label_name}</span>
                                                                                    }
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className={`${labelError ? "align-top" : ""} px-2 py-[10px] md:px-3 text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                                                                <div className={"flex justify-center items-center"}>
                                                                                    <ColorInput
                                                                                        className={"w-[98px]"}
                                                                                        name="label_color_code"
                                                                                        value={newLabel.label_color_code}
                                                                                        onChange={(color) => setNewLabel((prevState) => ({
                                                                                            ...prevState,
                                                                                            label_color_code: color.label_color_code
                                                                                        }))}
                                                                                    />
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="flex justify-end gap-2 px- py-[15px] md:px-3 items-center">
                                                                                <Button
                                                                                    variant=""
                                                                                    className={`${isSave === true ? "py-2 px-4" : "py-2 px-4"} w-[100px] h-[30px] text-sm font-semibold`}
                                                                                    onClick={() => handleAddNewLabel(newLabel,i)}
                                                                                >
                                                                                    {isSave ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Add Label"}
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline hover:bg-transparent"
                                                                                    className="p-1 border w-[30px] h-[30px]"
                                                                                    onClick={()=> {
                                                                                       handleCancel(i)
                                                                                    }}
                                                                                >
                                                                                    <X size={16}/>
                                                                                </Button>
                                                                            </TableCell>
                                                                    </Fragment>}
                                                                </Fragment>
                                        }
                                    </TableRow>
                                ))}
                                </> : (labelList.length == 0 && isLoading == false) ? <TableRow>
                                <TableCell colSpan={6}>
                                    <EmptyData />
                                </TableCell>
                            </TableRow> :null
                        }
                    </TableBody>
             </Table>

                </div>

            </CardContent>
        </Card>
    );
};

export default Labels;
