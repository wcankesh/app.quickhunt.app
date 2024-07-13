import React, {useState} from "react";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import {Button} from "../ui/button";

const ReadMoreText = ({html}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <React.Fragment>
            {isExpanded ? (
                <React.Fragment>
                    <div dangerouslySetInnerHTML={{__html: html}}></div>
                    <Button
                        variant={"ghost hover:bg-none"}
                        className={"p-0 h-0 text-primary font-semibold"}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        Read less
                    </Button>
                </React.Fragment>
            ) : (
                <div onClick={() => setIsExpanded(!isExpanded)}>
                    <HTMLEllipsis
                        unsafeHTML={html}
                        maxLine='3'
                        isclamped="true"
                        ellipsis="...Read more"
                        basedOn='letters'
                    />

                </div>
            )}

        </React.Fragment>
    );
};
export default ReadMoreText