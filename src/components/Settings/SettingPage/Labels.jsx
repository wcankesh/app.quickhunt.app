import React, { Fragment, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import {Check, Menu, Pencil, Plus, Square, Trash2, X} from "lucide-react";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "../../ui/table";
import ColorInput from "../../Comman/ColorPicker";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";

const initialNewLabel = {
    labelName: '',
    value: '#000000',
};

const Labels = () => {
    const {theme} = useTheme();
    const [labelColors, setLabelColors] = useState([
        {labelName: "BUG FIX", name: "clr", value: "#ff3c3c",},
        {labelName: "NEW", name: "clr", value: "#3b82f6",},
        {labelName: "IMPORTANT", name: "clr", value: "#63c8d9",},
    ]);
    const [showColorInput, setShowColorInput] = useState(false);
    const [newLabel, setNewLabel] = useState({...initialNewLabel });
    const [labelError, setLabelError] = useState(initialNewLabel);
    const [isEdit,setIsEdit]= useState(null);

    const onChangeColorColor = (newColor, index) => {
        const updatedColors = [...labelColors];
        updatedColors[index] = { ...updatedColors[index], value: newColor.clr };
        setLabelColors(updatedColors);
    };

    const handleShowInput = () => {
        setShowColorInput(true);
    };

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        if (index !== undefined) {
            const updatedColors = [...labelColors];
            updatedColors[index] = { ...updatedColors[index], [name]: value };
            setLabelColors(updatedColors);
        } else {
            setNewLabel({ ...newLabel, [name]: value });
        }
        setLabelError(labelError => ({
            ...labelError,
            [name]: ""
        }));
    };

    const handleAddNewLabel = () => {
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

        setLabelColors((prevLabels) => [
            ...prevLabels,
            {
                labelName: newLabel.labelName,
                name: 'clr',
                value: newLabel.value,
            },
        ]);

        setNewLabel({ ...initialNewLabel });
        setShowColorInput(false);
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
            case "labelName":
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
        const updatedColors = [...labelColors];
        updatedColors[index] = { ...updatedColors[index]};
        setLabelColors(updatedColors);
        setIsEdit(index);
    };

    const handleSaveLabel = (index) => {
        const updatedColors = [...labelColors];
        const labelToSave = updatedColors[index];

        if (!labelToSave.labelName || labelToSave.labelName.trim() === "") {
            setLabelError({
                ...labelError,
                labelName: "Label name is required."
            });
            return;
        }
        setLabelError({
            ...labelError,
            labelName: ""
        });

        updatedColors[index] = { ...labelToSave };
        setLabelColors(updatedColors);
        setIsEdit(null);
    };


    const handleCancelEdit = (index) => {
        const updatedColors = [...labelColors];
        updatedColors[index] = { ...updatedColors[index],};
        setLabelColors(updatedColors);
        setIsEdit(null);
    };

    const handleDeleteLabel = (index) => {
        const updatedColors = [...labelColors];
        updatedColors.splice(index, 1);
        setLabelColors(updatedColors);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center border-b">
                <div>
                    <CardTitle className="text-2xl font-medium">Labels</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground p-0">
                        Use Labels to organise your Changelog
                    </CardDescription>
                </div>
                <Button
                    disabled={showColorInput}
                    className="flex gap-1 items-center text-sm font-semibold m-0"
                    onClick={handleShowInput}
                >
                    <div><Plus size={20} /></div>New Label
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="p-0">
                        <TableRow>
                            <TableHead className={"w-[48px]"}/>
                            <TableHead className={`w-2/5 pl-0 ${theme === "dark" ? "" : "text-card-foreground"}`}>Label Name</TableHead>
                            <TableHead className={`text-center ${theme === "dark" ? "" : "text-card-foreground"}`}>Label Color</TableHead>
                            <TableHead className={`pr-[39px] text-end ${theme === "dark" ? "" : "text-card-foreground"}`}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {labelColors.map((x, i) => (
                            <TableRow key={i}>
                                <TableCell><Menu className={"cursor-grab"} size={16} /></TableCell>
                                {
                                    isEdit === i ?
                                    <TableCell className={"py-[8.5px] pl-0 py-[11px]"}>
                                        <Input
                                            className={"bg-card h-9"}
                                            type="text"
                                            value={x.labelName}
                                            name={"labelName"}
                                            onBlur={onBlur}
                                            onChange={(e) => handleInputChange(e, i)}
                                        />
                                        <div className="grid gap-2">
                                            {
                                                labelError.labelName &&
                                                <span className="text-red-500 text-sm">{labelError.labelName}</span>
                                            }
                                        </div>
                                    </TableCell>
                                    : <TableCell className={`font-medium text-xs py-[8.5px] pl-0 ${theme === "dark" ? "" : "text-muted-foreground"}`}>{x.labelName}</TableCell>
                                }
                                    {isEdit === i ?
                                        <TableCell className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                            <div className={"flex justify-center items-center"}>
                                                <ColorInput name={x.name} value={x.value} onChange={(color) => onChangeColorColor(color, i)} />
                                            </div>
                                        </TableCell> :
                                        <TableCell className={`font-medium text-xs ${theme === "dark" ? "" : "text-muted-foreground"}`}>
                                            <div className={"flex justify-center items-center gap-1"}>
                                                <Square size={16} strokeWidth={1} fill={x.value} stroke={x.value}/>
                                                <p>{x.value}</p>
                                            </div>
                                        </TableCell>
                                    }
                                <TableCell className="flex justify-end gap-2 pr-6">
                                    {isEdit === i ? (
                                        <Fragment>
                                            <Button
                                                variant="outline hover:bg-transparent"
                                                className="p-1 border w-[30px] h-[30px]"
                                                onClick={() => handleSaveLabel(i)}
                                            >
                                                <Check size={16} />
                                            </Button>
                                            <Button
                                                variant="outline hover:bg-transparent"
                                                className="p-1 border w-[30px] h-[30px]"
                                                onClick={() => handleCancelEdit(i)}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                        <Button
                                            variant="outline hover:bg-transparent"
                                            className="p-1 border w-[30px] h-[30px]"
                                            onClick={() => handleEditLabel(i)}
                                        >
                                            <Pencil size={16} />
                                        </Button>
                                            <Button
                                                variant="outline hover:bg-transparent"
                                                className="p-1 border w-[30px] h-[30px]"
                                                onClick={() => handleDeleteLabel(i)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </Fragment>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {showColorInput && (
                            <TableRow>
                                <TableCell className={`${labelError ? "align-top" : ""}`}>
                                    <Button variant={"ghost hover:bg-transparent"} className={"p-0 cursor-grab"}><Menu size={16} /></Button>
                                </TableCell>
                                <TableCell className={"p-0 py-4 pr-4"}>
                                        <Input
                                            className={"bg-card"}
                                            type="text"
                                            id="labelName"
                                            name="labelName"
                                            value={newLabel.labelName}
                                            onChange={handleInputChange}
                                            placeholder="Enter Label Name"
                                            onBlur={onBlur}
                                        />
                                    <div className="grid gap-2">
                                        {
                                            labelError.labelName &&
                                            <span className="text-red-500 text-sm">{labelError.labelName}</span>
                                        }
                                    </div>
                                </TableCell>
                                <TableCell className={`${labelError ? "align-top" : ""} p-0 py-4`}>
                                    <div className={"py-2 px-3 border border-border rounded-lg overflow-hidden"}>
                                    <ColorInput
                                        name="newLabelColor"
                                        value={newLabel.value}
                                        onChange={(color) => setNewLabel((prevState) => ({ ...prevState, value: color.clr }))}
                                    />
                                    </div>
                                </TableCell>
                                <TableCell className="flex justify-end gap-2 pr-6">
                                    <Button
                                        variant=""
                                        className="text-sm font-semibold"
                                        onClick={handleAddNewLabel}
                                    >
                                        Add Label
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default Labels;
