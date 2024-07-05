import React,{useState} from 'react';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html'
import {Button} from "../ui/button";


const ReadMoreText = ({html}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <React.Fragment>
            {isExpanded ? (
                <React.Fragment className={"flex flex-col"}>
                    <div dangerouslySetInnerHTML={{__html:html}}></div>
                    {/*<p className="p-0" onClick={() => setIsExpanded(!isExpanded)}>Read less</p>*/}
                </React.Fragment>
            ) : (
                <div onClick={() => setIsExpanded(!isExpanded)}>
                    <HTMLEllipsis
                        unsafeHTML={html}
                        maxLine='3'
                        isClamped={true}
                        ellipsis="...Read more"
                        basedOn='letters'
                    />
                </div>
            )}

        </React.Fragment>
    );
};

export default ReadMoreText;