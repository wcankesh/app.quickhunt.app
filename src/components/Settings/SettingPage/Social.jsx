import React, {useState} from 'react';
import {Card, CardContent, CardHeader} from "../../ui/card";
import {Separator} from "../../ui/separator";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {Button} from "../../ui/button";

const initialState = {
    facebook:"",
    twitter:"",
    linkedin:"",
    youtube:"",
    instagram:"",
    github:""
}

const Social = () => {
    const [formData,setFormData]=useState(initialState);

    const onChange =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    };

    return (
        <Card>
            <CardHeader className={"p-6"}>
                <h2 className="text-2xl font-medium leading-8">Social links</h2>
            </CardHeader>
            <Separator/>
            <CardContent className={"p-0"}>
                <div className={"px-6 pt-4 pb-6"}>
                    <div className="grid w-full">
                        <Label htmlFor="facebook" className={"mb-[6px]"}>Facebook</Label>
                        <Input onChange={onChange} name="facebook" placeholder={"https://facebook.com/"} type="text" id="facebook" className={"h-9"}/>
                    </div>

                    <div className="w-full mt-4">
                        <Label htmlFor="twitter" className={"mb-[6px]"}>Twitter ( X )</Label>
                        <Input onChange={onChange} name="twitter" placeholder={"https://x.com/"} type="text" id="twitter" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="linkedin" className={"mb-[6px]"}>Linkedin</Label>
                        <Input onChange={onChange} name="linkedin" placeholder={"https://linkedin.com/"} type="text" id="linkedin" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="youtube" className={"mb-[6px]"}>YouTube</Label>
                        <Input onChange={onChange} name="youtube" placeholder={"https://youtube.com/"} type="text" id="youtube" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="instagram" className={"mb-[6px]"}>Instagram</Label>
                        <Input onChange={onChange} name="instagram" placeholder={"https://instagram.com/"} type="text" id="instagram" className={"h-9"}/>
                    </div>

                    <div className="grid w-full mt-4">
                        <Label htmlFor="github" className={"mb-[6px]"}>GitHub</Label>
                        <Input onChange={onChange} name="github" placeholder={"https://github.com/"} type="text" id="github" className={"h-9"}/>
                    </div>
                </div>

                <Separator className={""}/>

                <div className={"px-6 pt-4 pb-6 flex flex-row justify-end"}>
                    <Button>Update Social</Button>
                </div>



            </CardContent>
        </Card>
    );
};

export default Social;