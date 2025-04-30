import React from 'react';
import {CircleX, Upload} from "lucide-react";
import {DO_SPACES_ENDPOINT} from "../../utils/constent";

const ImageUploader = ({
                           image,
                           onDelete,
                           onUpload,
                           altText = "Uploaded image",
                           imageWidth = "w-[282px]",
                           imageHeight = "h-[128px]"
                       }) => {
    return (
        <div>
            {image ? (
                <div className={`${imageWidth} ${imageHeight} relative border p-[5px]`}>
                    <img
                        className="upload-img"
                        src={image.name ? URL.createObjectURL(image) : `${DO_SPACES_ENDPOINT}/${image}`}
                        alt={altText}
                    />
                    <CircleX
                        size={20}
                        className="stroke-gray-500 dark:stroke-white cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
                        onClick={onDelete}
                    />
                </div>
            ) : (
                <div>
                    <input
                        id="pictureInput"
                        type="file"
                        className="hidden"
                        onChange={onUpload}
                        accept="image/*"
                    />
                    <label
                        htmlFor="pictureInput"
                        className={`border-dashed ${imageWidth} ${imageHeight} py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer`}
                    >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                    </label>
                </div>
            )}
        </div>

    );
};

export default ImageUploader;