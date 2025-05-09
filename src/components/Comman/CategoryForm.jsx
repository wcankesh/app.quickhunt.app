import React from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import ReactQuillEditor from "./ReactQuillEditor";
import {CircleX, Loader2, Upload} from "lucide-react";
import {Button} from "../ui/button";
import {DO_SPACES_ENDPOINT} from "../../utils/constent";

const CategoryForm = ({ selectedData, setSelectedData, formError, setFormError, handleImageUpload, handleSubmit, isLoading, closeSheet, saveTitle, className }) => {
    const handleOnChange = (name, value) => {
        const trimmedValue = (name === "title" || name === "description") ? value.trimStart() : value;
        setSelectedData(prev => ({ ...prev, [name]: trimmedValue }));
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, trimmedValue)
        }));
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "title":
                return !value || value.trim() === "" ? "Name is required" : "";
            case "description":
                const cleanValue = value.trim();
                const emptyContent = /^(<p>\s*<\/p>|<p><br><\/p>|<\/?[^>]+>)*$/;
                return !value || cleanValue === "" || emptyContent.test(cleanValue) ? "Description is required." : "";
            default:
                return "";
        }
    };

    const handleDeleteImage = () => {
        setSelectedData({ ...selectedData, image: "" });
    };

    return (
        <div className={"sm:px-8 sm:py-6 px-3 py-4 border-b space-y-6"}>
            <div className="grid w-full gap-2">
                <Label htmlFor="category-name" className={"font-medium"}>Name</Label>
                <Input
                    value={selectedData?.title}
                    onChange={(e) => handleOnChange("title", e.target.value)}
                    type="text"
                    id="category-name"
                    className={"h-9"}
                    placeholder={"Enter the name..."}
                />
                {formError?.title && <span className="text-red-500 text-sm">{formError?.title}</span>}
            </div>
            <div className="grid w-full gap-2">
                <Label className={"font-medium"}>Description</Label>
                <ReactQuillEditor
                    value={selectedData?.description}
                    onChange={(e) => handleOnChange("description", e.target.value)}
                />
                {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
            </div>
            <div className={"flex flex-col gap-2"}>
                <Label className={"font-medium"}>Icon</Label>
                <div className="w-[282px] h-[128px] flex gap-1">
                    {selectedData?.image ? (
                        <div>
                            <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                <img
                                    className={"upload-img"}
                                    src={selectedData?.image?.name ? URL.createObjectURL(selectedData?.image) : `${DO_SPACES_ENDPOINT}/${selectedData?.image}`}
                                    alt=""
                                />
                                <CircleX
                                    size={20}
                                    className={`stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                    onClick={handleDeleteImage}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <input
                                id="pictureInput"
                                type="file"
                                className="hidden"
                                accept={"image/*"}
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="pictureInput"
                                className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
                            >
                                <Upload className="h-4 w-4 text-muted-foreground" />
                            </label>
                        </div>
                    )}
                </div>
            </div>
            <div className={"flex gap-4"}>
                <Button
                    className={`border ${className} font-medium hover:bg-primary`}
                    onClick={handleSubmit}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : saveTitle}
                </Button>

                <Button
                    variant={"ghost hover:bg-none"}
                    onClick={closeSheet}
                    className={`border border-primary font-medium text-primary`}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default CategoryForm;