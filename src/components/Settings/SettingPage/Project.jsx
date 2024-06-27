import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Button} from "../../ui/button";
import {Icon} from "../../../utils/Icon";
import {useTheme} from "../../theme-provider";
import {Input} from "../../ui/input";

const Project = () => {
    const {theme} = useTheme();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
    };

    return (
        <Card>
            <CardHeader className={"p-6 gap-1 border-b"}>
                <CardTitle className={"text-2xl font-medium"}>Project Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Manage your project settings.</CardDescription>
            </CardHeader>
            <CardContent className={"p-0 border-b"}>
                <div className={"px-6 pt-6"}><h3 className={"text-sm font-medium"}>Edit Images</h3></div>
                <div className={"pt-4 p-6"}>
                    <div className="w-full items-center gap-1.5">
                        <div className={"flex gap-[94px]"}>
                            <div className={"flex gap-2"}>
                                <div className="w-[50px] h-[50px] relative">

                                    {selectedFile ? (
                                        <>
                                            <img src={imagePreview} alt="Preview"
                                                 className="w-full h-full object-cover rounded cursor-pointer"
                                                 onClick={handleRemoveImage}/>
                                            {/*<Button variant="outline" onClick={handleRemoveImage} className="w-[129px] px-4 py-2 absolute top-[50%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] border-0 flex justify-center items-center bg-primary hover:bg-primary text-card hover:text-card text-sm font-semibold">*/}
                                            {/*    Change image*/}
                                            {/*</Button>*/}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className="w-full h-full py-[13px] inset-0 flex items-center justify-center bg-muted rounded-lg cursor-pointer"
                                            >
                                                <div
                                                    className={`${theme === "dark" ? "profile-menu-icon" : ""}`}>{Icon.editImgLogo}</div>
                                            </label>
                                        </>
                                    )}

                                </div>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Logo</h4>
                                    <p className={"text-xs font-medium text-muted-foreground"}>50px By 50px</p>
                                </div>
                            </div>
                            <div className={"flex gap-2"}>
                                <div className="w-[64px] h-[64px] relative">

                                    {selectedFile ? (
                                        <>
                                            <img src={imagePreview} alt="Preview"
                                                 className="w-full h-full object-cover rounded cursor-pointer"
                                                 onClick={handleRemoveImage}/>
                                            {/*<Button variant="outline" onClick={handleRemoveImage} className="w-[129px] px-4 py-2 absolute top-[50%] left-[50%] origin-center translate-x-[-50%] translate-y-[-50%] border-0 flex justify-center items-center bg-primary hover:bg-primary text-card hover:text-card text-sm font-semibold">*/}
                                            {/*    Change image*/}
                                            {/*</Button>*/}
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                id="pictureInput"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label
                                                htmlFor="pictureInput"
                                                className=" w-full h-full py-[17px] inset-0 flex items-center justify-center bg-muted rounded-lg cursor-pointer"
                                            >
                                                <div
                                                    className={`${theme === "dark" ? "profile-menu-icon" : ""}`}>{Icon.editImgLogo}</div>
                                            </label>
                                        </>
                                    )}

                                </div>
                                <div className={"flex flex-col gap-1"}>
                                    <h4 className={"text-sm font-medium"}>Favicon</h4>
                                    <p className={"text-xs font-medium text-muted-foreground"}>64px By 64px</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardContent className={"p-6 border-b"}>
                <div className={"flex gap-4 w-full"}>
                    <div className="basis-1/2">
                        <Label htmlFor="text">Project Name</Label>
                        <Input type="text" id="text" placeholder="testingapp" className={"mt-1 bg-card"} />
                    </div>
                    <div className="basis-1/2">
                        <Label htmlFor="text">Project website</Label>
                        <Input type="text" id="text" placeholder="https://yourcompany.com" className={"mt-1 bg-card"} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className={"pt-4 justify-end gap-6"}>
                <Button variant={"outline hover:bg-transparent"} className={`text-sm font-semibold ${theme === "dark" ? "text-card-foreground" : "text-primary"} border border-primary`}>Delete project</Button>
                <Button className={"text-sm font-semibold"}>Update project</Button>
            </CardFooter>
        </Card>
    );
};

export default Project;