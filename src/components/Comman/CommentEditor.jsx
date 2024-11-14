import React, {Fragment} from 'react';
import {CircleX, Loader2, Paperclip, Pencil, Pin, Trash2} from "lucide-react";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import {useTheme} from "../theme-provider";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";

export const CommentEditor = ({isEditMode, comment, images = [], onUpdateComment, onCancelComment, onDeleteImage, onImageClick, onImageUpload, onCommentChange, isSaving, idImageUpload = '',}) => {
    const {theme} = useTheme();
    const imageArray = Array.isArray(images) ? images : [];
    return (
        <div className="space-y-2">
            {isEditMode ? (
                <div className="space-y-2">
                    <Textarea
                        value={comment}
                        onChange={onCommentChange}
                    />
                    {imageArray.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {imageArray.map((img, index) => (
                                <Fragment key={index}>
                                    {
                                        img && img?.name ?
                                            <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                                                <img
                                                    className="upload-img"
                                                    src={img?.name ? URL.createObjectURL(img) : img}
                                                    alt=""
                                                />
                                                <CircleX
                                                    size={20}
                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                    onClick={() => onDeleteImage(index, !!img.name)}
                                                />
                                            </div> :
                                            <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                                                <img
                                                    className="upload-img"
                                                    src={img?.name ? URL.createObjectURL(img) : img}
                                                    alt=""
                                                />
                                                <CircleX
                                                    size={20}
                                                    className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                                    onClick={() => onDeleteImage(index, !!img.name)}
                                                />
                                            </div>
                                    }
                                </Fragment>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button
                            className="w-[81px] h-[30px] text-sm font-medium hover:bg-primary"
                            onClick={onUpdateComment}
                            disabled={!comment?.trim()}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : "Save"}
                        </Button>
                        <Button
                            className="h-[30px] text-sm font-medium text-primary border border-primary"
                            variant="outline hover:none"
                            onClick={onCancelComment}
                        >
                            Cancel
                        </Button>
                        <div className="p-2 max-w-sm relative w-[36px]">
                            <Input id={idImageUpload} type="file" className="hidden" onChange={onImageUpload} accept=".jpg,.jpeg"/>
                            <label
                                // htmlFor="commentImageUpload"
                                htmlFor={idImageUpload}
                                className="absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer"
                            >
                                <Paperclip size={16} className="stroke-primary" />
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-xs">{comment}</p>
                    <div className="flex gap-2 flex-wrap">
                        {imageArray.map((img, index) => (
                            <div
                                key={index}
                                className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"
                                onClick={() => onImageClick(img)}
                            >
                                <img className="upload-img cursor-pointer" src={img} alt=""/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const UserAvatar = ({ userPhoto, userName }) => {
    return (
        <Avatar className={"w-[20px] h-[20px]"}>
            {userPhoto ? (
                <AvatarImage src={userPhoto} alt={userName && userName.substring(0, 1)} />
            ) : (
                <AvatarFallback>{userName && userName.substring(0, 1).toUpperCase()}</AvatarFallback>
            )}
        </Avatar>
    );
};

export const ActionButtons = ({isEditable, onEdit, onDelete, isPinned, onPinChange, itemIndex}) => {
    return (
        <div className="flex gap-2">
            {isEditable && onEdit && (
                <Button variant="outline" className="w-[30px] h-[30px] p-1" onClick={() => onEdit(itemIndex)}>
                    <Pencil className="w-[16px] h-[16px]" />
                </Button>
            )}
            {onDelete && (
                <Button variant="outline" className="w-[30px] h-[30px] p-1" onClick={() => onDelete(itemIndex)}>
                    <Trash2 className="w-[16px] h-[16px]" />
                </Button>
            )}
            {typeof isPinned !== 'undefined' && onPinChange && (
                <Button variant="outline" className="w-[30px] h-[30px] p-1" onClick={() => onPinChange(!isPinned)}>
                    <Pin size={16} className={isPinned ? 'fill-card-foreground' : ''} />
                </Button>
            )}
        </div>
    );
};

export const SaveCancelButton = ({onClickSave, load, onClickCancel}) => {
    return (
        <Fragment>
            <div className={"p-4 lg:p-8 flex gap-3"}>
                <Button className={`w-[54px] text-sm font-medium hover:bg-primary`} onClick={onClickSave}>
                    {load ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save"}
                </Button>
                <Button
                    variant={"outline hover:bg-transparent"}
                    className={"border border-primary text-sm font-medium text-primary"}
                    onClick={onClickCancel}
                >
                    Cancel
                </Button>
            </div>
        </Fragment>
    )
}

export const ImageGallery = ({ images, onDeleteImage }) => {
    const {theme} = useTheme();
    if (!images || !images.length) return null;
    return (
        <div className="flex flex-wrap gap-3 mt-1">
            {images.map((image, index) => (
                <Fragment key={index}>
                    {image && (
                        <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] relative border p-[3px]">
                            <img className="upload-img" src={image.name ? URL.createObjectURL(image) : image} alt="Uploaded"/>
                            <CircleX
                                size={20}
                                className={`${theme === "dark" ? "text-card-foreground" : "text-muted-foreground"} cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10`}
                                onClick={() => onDeleteImage(index)}
                            />
                        </div>
                    )}
                </Fragment>
            ))}
        </div>
    );
};

export const UploadButton = ({ onChange, id = "fileInput", className = ""}) => {
    return (
        <div className={`p-2 max-w-sm relative w-[36px] ${className}`}>
            <input id={id} type="file" className="hidden" onChange={onChange} accept={".jpg,.jpeg"}/>
            <label
                htmlFor={id}
                className={`absolute inset-0 flex items-center justify-center bg-white border border-primary rounded cursor-pointer`}>
                <Paperclip size={16} className={`stroke-primary`} />
            </label>
        </div>
    );
};

export const StatusButtonGroup = ({statusButtons = [], onChangeStatus,}) => {
    const {theme} = useTheme();
    return (
        <div className="flex gap-2">
            {statusButtons.map((btn, index) => (
                <div key={index} className="flex gap-1 justify-between">
                    <Button
                        variant="outline"
                        className={`hover:bg-muted ${btn.width || 'w-[110px]'} h-[30px] capitalize ${theme === "dark" ? "" : "border-muted-foreground text-muted-foreground"} text-xs font-medium`}
                        onClick={() => onChangeStatus(btn.statusKey, btn.statusValue)}
                    >
                        {btn.isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            btn.label
                        )}
                    </Button>
                </div>
            ))}
        </div>
    );
};