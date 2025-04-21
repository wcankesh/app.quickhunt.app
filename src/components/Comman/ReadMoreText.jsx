import React, { useState } from "react";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { Button } from "../ui/button";
import {DisplayReactQuill} from "./ReactQuillEditor";

const ReadMoreText = ({ html, maxLength = 100, onTextClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const textContent = html?.replace(/<[^>]*>/g, '');
    const isTruncated = textContent?.length > maxLength;
    const truncatedText = isTruncated ? textContent?.slice(0, maxLength) : textContent;

    return (
        <div className="break-words">
            {isExpanded || !isTruncated ? (
                <React.Fragment>
                    {/*<span onClick={onTextClick} dangerouslySetInnerHTML={{ __html: html }} />*/}
                    <DisplayReactQuill value={html} />
                    {isTruncated && (
                        <Button
                            variant="ghost hover:bg-none"
                            className="p-0 h-0 text-primary font-semibold"
                            onClick={() => setIsExpanded(false)}
                        >
                            Read less
                        </Button>
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <span onClick={onTextClick}>{truncatedText}</span>
                    {/*<DisplayReactQuill value={truncatedText} />*/}
                    <span>... </span>
                    <Button
                        variant="ghost hover:bg-none"
                        className="p-0 h-0 text-primary font-semibold"
                        onClick={() => setIsExpanded(true)}
                    >
                        Read more
                    </Button>
                </React.Fragment>
            )}
        </div>
    );
};

export default ReadMoreText;