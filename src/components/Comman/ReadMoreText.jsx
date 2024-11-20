import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { Button } from "../ui/button";

//old code
// const ReadMoreText = ({ html ,maxLine ="3"}) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [isTruncated, setIsTruncated] = useState(false);
//     const contentRef = useRef(null);
//
//     const checkTruncation = useCallback(() => {
//         if (contentRef.current) {
//             const contentHeight = contentRef.current.scrollHeight;
//             const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight, 10);
//             const maxHeight = lineHeight * 3;
//
//             setIsTruncated(contentHeight > maxHeight);
//         }
//     }, [html]);
//
//     useEffect(() => {
//         checkTruncation();
//     }, [html, checkTruncation]);
//
//     return (
//         <React.Fragment>
//             {isExpanded || !isTruncated ? (
//                 <React.Fragment>
//                     <div dangerouslySetInnerHTML={{__html: html}} ref={contentRef} className="break-words"/>
//                     {isTruncated && (
//                         <Button
//                             variant={"ghost hover:bg-none"}
//                             className={"p-0 h-0 text-primary font-semibold"}
//                             onClick={() => setIsExpanded(!isExpanded)}
//                         >
//                             Read less
//                         </Button>
//                     )}
//                 </React.Fragment>
//             ) : (
//                 <div onClick={() => setIsExpanded(true)}>
//                     <HTMLEllipsis
//                         unsafeHTML={html}
//                         maxLine={maxLine}
//                         isClamped="true"
//                         ellipsis="...Read more"
//                         basedOn='letters'
//                         className="break-words"
//                     />
//                 </div>
//             )}
//         </React.Fragment>
//     );
// };

// const ReadMoreText = ({ html, maxLength = 100 }) => {
//     const [isExpanded, setIsExpanded] = useState(false);
//
//     // Strip HTML tags and calculate the truncated text
//     const textContent = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
//     const isTruncated = textContent.length > maxLength;
//     const truncatedText = isTruncated ? textContent.slice(0, maxLength) + "..." : textContent;
//
//     return (
//         <React.Fragment>
//             <div
//                 dangerouslySetInnerHTML={{ __html: isExpanded ? html : truncatedText }}
//                 className="break-words"
//             />
//             {isTruncated && (
//                 <Button
//                     variant="ghost hover:bg-none"
//                     className="p-0 h-0 text-primary font-semibold"
//                     onClick={() => setIsExpanded(!isExpanded)}
//                 >
//                     {isExpanded ? "Read less" : "Read more"}
//                 </Button>
//             )}
//         </React.Fragment>
//     );
// };

const ReadMoreText = ({ html, maxLength = 100, onTextClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Strip HTML tags to get the plain text content
    const textContent = html?.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const isTruncated = textContent?.length > maxLength;
    const truncatedText = isTruncated ? textContent?.slice(0, maxLength) : textContent;

    return (
        <div className="break-words">
            {isExpanded || !isTruncated ? (
                // Expanded content with "Read less" button
                <React.Fragment>
                    <span onClick={onTextClick} dangerouslySetInnerHTML={{ __html: html }} />
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
                // Truncated content with "Read more" after ellipsis
                <React.Fragment>
                    <span onClick={onTextClick}>{truncatedText}</span>
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