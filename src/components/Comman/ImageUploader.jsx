import React from 'react';
import {CircleX, Upload} from "lucide-react";
import {Label} from "../ui/label";

// const ImageUploader = ({ selectedImage, onChangeStatus, handleUpload }) => {
const ImageUploader = ({
                           image,
                           onDelete,
                           onUpload,
                           altText = "Uploaded image",
                           imageWidth = "w-[282px]",
                           imageHeight = "h-[128px]"
                       }) => {
    return (
        // <div className="py-4 px-6 w-full space-y-1.5">
        //     <Label htmlFor="picture" className="font-normal capitalize">Featured image</Label>
        //     <div className="w-[282px] h-[128px] flex gap-1">
        //         {selectedImage?.cover_image ? (
        //             <div>
        //                 {selectedImage.cover_image.name ? (
        //                     <div className="w-[282px] h-[128px] relative border p-[5px]">
        //                         <img
        //                             className="upload-img"
        //                             src={URL.createObjectURL(selectedImage.cover_image)}
        //                             alt="Featured"
        //                         />
        //                         <CircleX
        //                             size={20}
        //                             className="text-muted-foreground dark:text-card-foreground cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
        //                             onClick={() => onChangeStatus('delete_cover_image', "")}
        //                         />
        //                     </div>
        //                 ) : (
        //                     <div className="w-[282px] h-[128px] relative border p-[5px]">
        //                         <img
        //                             className="upload-img"
        //                             src={selectedImage.cover_image}
        //                             alt="Featured"
        //                         />
        //                         <CircleX
        //                             size={20}
        //                             className="text-muted-foreground dark:text-card-foreground cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
        //                             onClick={() => onChangeStatus('delete_cover_image', selectedImage.cover_image.replace("https://code.quickhunt.app/public/storage/feature_idea/", ""))}
        //                         />
        //                     </div>
        //                 )}
        //             </div>
        //         ) : (
        //             <div>
        //                 <input
        //                     id="pictureInput"
        //                     type="file"
        //                     className="hidden"
        //                     multiple
        //                     onChange={handleUpload}
        //                     accept="image/*"
        //                 />
        //                 <label
        //                     htmlFor="pictureInput"
        //                     className="border-dashed w-[282px] h-[128px] py-[52px] flex items-center justify-center bg-muted border border-muted-foreground rounded cursor-pointer"
        //                 >
        //                     <Upload className="h-4 w-4 text-muted-foreground" />
        //                 </label>
        //             </div>
        //         )}
        //     </div>
        // </div>

        <div>
            {image ? (
                <div className={`${imageWidth} ${imageHeight} relative border p-[5px]`}>
                    <img
                        className="upload-img"
                        src={image.name ? URL.createObjectURL(image) : image}
                        alt={altText}
                    />
                    <CircleX
                        size={20}
                        className="light:text-muted-foreground dark:text-card cursor-pointer absolute top-[0%] left-[100%] translate-x-[-50%] translate-y-[-50%] z-10"
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