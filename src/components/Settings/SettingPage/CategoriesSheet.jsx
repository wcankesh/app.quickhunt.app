import React, {useState} from 'react';
import {Sheet, SheetContent, SheetHeader} from "../../ui/sheet";
import {Button} from "../../ui/button";
import {X} from "lucide-react";
import {Separator} from "../../ui/separator";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";

const initialState = {
    name:"",
    description:""
}

const CategoriesSheet = ({ isOpen, onOpen, onClose }) => {
    const [categoryDetails,setCategoryDetails] =useState(initialState);
    const [formError, setFormError] = useState(initialState);

    const onChange = (e) => {
        setCategoryDetails({...categoryDetails,[e.target.name]:e.target.value});
        setFormError(formError => ({...formError, [e.target.name]: ""}));
    }

    const onBlur = (e) => {
        const { name, value } = e.target;
        setFormError({
            ...formError,
            [name]: formValidate(name, value)
        });
    };

    const formValidate = (name, value) => {
        switch (name) {
            case "name":
                if (!value || value.trim() === "") {
                    return "Name is required";
                }else {
                    return "";
                }
            case "description":
                if (!value || value.trim() === "") {
                    return "Description is required";
                }else {
                    return "";
                }
            default: {
                return "";
            }
        }
    };

    const addCategory = () => {
        let validationErrors = {};
        Object.keys(categoryDetails).forEach(name => {
            const error = formValidate(name, categoryDetails[name]);
            if (error && error.length > 0) {
                validationErrors[name] = error;
            }
        });
        if (Object.keys(validationErrors).length > 0) {
            setFormError(validationErrors);
            return;
        }
        console.log(categoryDetails,"category-details");
    }

    return (
        <Sheet open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
                <SheetContent className={"lg:max-w-[661px] sm:max-w-[520px] p-0"} >
                    <SheetHeader className={"px-8 py-6 border-b"}>
                        <div className={"flex justify-between items-center w-full"}>
                            <h2 className={"text-xl font-medium capitalize"}>Add New category</h2>
                            <X onClick={onClose} className={"cursor-pointer"}/>
                        </div>
                    </SheetHeader>
                    <div className={"px-8 py-6"}>
                        <div className={"flex flex-col gap-6"}>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input onChange={onChange} name={"name"} onBlur={onBlur} placeholder={"Enter the name of Category"} type="text" id="name" className={"h-9"}/>
                                {formError?.name && <span className={"text-red-500 text-sm"}>{formError?.name}</span>}
                            </div>
                            <div className="grid w-full gap-2">
                                <Label htmlFor="Description">Description</Label>
                                <Input onChange={onChange} name={"description"}  placeholder={"Enter the Description of Category"} type="text" id="Description" className={"h-9"}/>
                                {formError?.description && <span className={"text-red-500 text-sm"}>{formError?.description}</span>}
                            </div>

                        </div>
                    </div>
                    <Separator/>
                    <div className={"px-8 py-6"}>
                        <Button onClick={addCategory}>Add Category</Button>
                    </div>
                </SheetContent>
        </Sheet>
    );
};

export default CategoriesSheet;