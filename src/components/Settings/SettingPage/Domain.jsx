import React from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription} from "../../ui/card";
import {Label} from "../../ui/label";
import {Input} from "../../ui/input";
import {useTheme} from "../../theme-provider";
import {Button} from "../../ui/button";

const Domain = () => {
    const {theme} = useTheme();
    return (
        <Card>
            <CardHeader className={"p-6 gap-1 border-b"}>
                <CardTitle className={"text-2xl font-medium"}>Domain Setting</CardTitle>
                <CardDescription className={"text-sm text-muted-foreground p-0"}>Personalise your Quickhunt page with a custom domain.</CardDescription>
            </CardHeader>
            <CardContent className={"p-6 flex flex-col gap-6 border-b"}>
                <div className="gap-2 relative">
                    <Label htmlFor="domain" className="text-right">Subdomain</Label>
                    <Input id="domain" placeholder="https://" className={"pr-[115px] bg-card mt-1"} />
                    <span className={"absolute top-[38px] right-[13px] text-sm font-medium"}>.quickhunt.io</span>
                </div>
                <div className="">
                    <Label htmlFor="text">Custom Domain</Label>
                    <Input type="text" id="text" placeholder="https://" className={"mt-1 bg-card"} />
                </div>
                <p className={"text-sm font-medium text-muted-foreground"}>
                    <span className={"font-bold"}>Note:</span> Add a new
                    <span className={"font-bold"}> CNAME</span> record for the subdomain you decided on
                    <span className={"font-bold"}> (eg feedback in the example above)</span> to your
                    <span className={"font-bold"}> DNS</span> and point it at the domain
                    <span className={"font-bold"}> "cname.quickhunt.io"</span>.</p>
            </CardContent>
            <CardFooter className={"pt-[20px] justify-end"}>
                <Button className={"text-sm font-semibold"}>Update Domain </Button>
            </CardFooter>
        </Card>
    );
};

export default Domain;