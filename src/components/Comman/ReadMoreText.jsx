import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { Button } from "../ui/button";

const ReadMoreText = ({ html }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const contentRef = useRef(null);

    const checkTruncation = useCallback(() => {
        if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight, 10);
            const maxHeight = lineHeight * 3;

            setIsTruncated(contentHeight > maxHeight);
        }
    }, [html]);

    useEffect(() => {
        checkTruncation();
    }, [html, checkTruncation]);

    return (
        <React.Fragment>
            {isExpanded || !isTruncated ? (
                <React.Fragment>
                    <div dangerouslySetInnerHTML={{__html: html}} ref={contentRef}/>
                    {isTruncated && (
                        <Button
                            variant={"ghost hover:bg-none"}
                            className={"p-0 h-0 text-primary font-semibold text-xs"}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            Read less
                        </Button>
                    )}
                </React.Fragment>
            ) : (
                <div onClick={() => setIsExpanded(true)}>
                    <HTMLEllipsis
                        unsafeHTML={html}
                        maxLine='3'
                        isClamped="true"
                        ellipsis="...Read more"
                        basedOn='letters'
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default ReadMoreText;