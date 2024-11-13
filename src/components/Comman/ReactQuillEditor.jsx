import React from 'react';
import ReactQuill from "react-quill";
import {cn} from "../../lib/utils";

const ReactQuillEditor = ({name, value, onChange, className}) => {
    const sanitizeHTML = (html) => {
        // Remove all HTML tags and check if the result is empty
        const stripped = html.replace(/(<([^>]+)>)/gi, "").trim();
        // Return an empty string if there's no actual content
        return stripped.length === 0 ? "" : html;
    };

    return (
        <>
            <ReactQuill
                className={cn(
                    "rounded-md border bg-card min-h-[145px] h-full", className
                )}
                placeholder="Type here..."
                theme="snow" /*className={"rounded-md border bg-card"}*/
                modules={
                    {
                        toolbar: [
                            [{ size: [] }],
                            ["bold", "italic", "underline"],
                            [{ align: [] }],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ "color": [] }, { 'background': [] }],
                            ["link", 'image'],

                        ]
                    }
                }
                formats={[
                    "header", "height", "bold", "italic",
                    "underline", "strike", "blockquote",
                    "list", "color", 'background', "bullet", "indent",
                    "link", "image", "align", "size",
                ]}
                value={value}
                // onChange={(newValue, delta, source, editor) => {
                //     if (source === "user") {
                //         onChange({target: {name: name, value: newValue}})
                //     }
                // }}
                onChange={(newValue, delta, source, editor) => {
                    if (source === "user") {
                        // Sanitize the input value to remove empty tags
                        const sanitizedValue = sanitizeHTML(newValue);
                        onChange({ target: { name: name, value: sanitizedValue } });
                    }
                }}
            />
        </>
    );
};

export default ReactQuillEditor;