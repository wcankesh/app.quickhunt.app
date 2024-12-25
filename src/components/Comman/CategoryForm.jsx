import React from 'react';
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import ReactQuillEditor from "./ReactQuillEditor";
import {CircleX, Loader2, Upload} from "lucide-react";
import {Button} from "../ui/button";
import {useTheme} from "../theme-provider";

const CategoryForm = ({ selectedData, setSelectedData, formError, setFormError, handleImageUpload, handleSubmit, isLoading, closeSheet }) => {
    const {theme} = useTheme();
    const handleOnChange = (name, value) => {
        setSelectedData({ ...selectedData, [name]: value });
        setFormError(formError => ({
            ...formError,
            [name]: formValidate(name, value)
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
                <Label htmlFor="category-name" className={"font-normal"}>Name</Label>
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
                <Label className={"font-normal"}>Description</Label>
                <ReactQuillEditor
                    value={selectedData?.description}
                    onChange={(e) => handleOnChange("description", e.target.value)}
                />
                {formError?.description && <span className="text-red-500 text-sm">{formError?.description}</span>}
            </div>
            <div className={"flex flex-col gap-2"}>
                <Label className={"font-normal"}>Icon</Label>
                <div className="w-[282px] h-[128px] flex gap-1">
                    {selectedData?.image ? (
                        <div>
                            <div className={"w-[282px] h-[128px] relative border p-[5px]"}>
                                <img
                                    className={"upload-img"}
                                    src={selectedData?.image?.name ? URL.createObjectURL(selectedData?.image) : selectedData?.image}
                                    alt=""
                                />
                                <CircleX
                                    size={20}
                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
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
                                accept={".jpg,.jpeg"}
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
                    className={`border w-[115px] font-medium hover:bg-primary`}
                    onClick={handleSubmit}
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Category"}
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