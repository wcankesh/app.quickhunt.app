import React, {Fragment} from 'react';
import {CircleX, Loader2, Paperclip} from "lucide-react";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";
import {useTheme} from "../theme-provider";

const CommentEditor = ({
                           isEditMode,
                           comment,
                           images = [],
                           onUpdateComment,
                           onCancelComment,
                           onDeleteImage,
                           onImageClick,
                           onImageUpload,
                           onCommentChange,
                           isSaving,
                           idImageUpload = '',
                       }) => {
    const {theme} = useTheme()
    return (
        <div className="space-y-2">
            {isEditMode ? (
                <div className="space-y-2">
                    <Textarea
                        value={comment}
                        onChange={onCommentChange}
                    />
                    {images.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {images.map((img, index) => (
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
                            disabled={!comment.trim()}
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
                            <Input
                                id={idImageUpload}
                                type="file"
                                className="hidden"
                                onChange={onImageUpload}
                                accept=".jpg,.jpeg"
                            />
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
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] border p-[3px]"
                                onClick={() => onImageClick(img)}
                            >
                                <img
                                    className="upload-img cursor-pointer"
                                    src={img}
                                    alt=""
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentEditor;