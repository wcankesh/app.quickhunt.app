import React from 'react';
import ReactQuill from "react-quill";
import {cn} from "../../lib/utils";

const ReactQuillEditor = ({name, value, onChange, className}) => {
    return (
        <>
            <ReactQuill
                className={cn(
                    "rounded-md border bg-card", className
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
                onChange={(newValue, delta, source, editor) => {
                    if (source === "user") {
                        onChange({target: {name: name, value: newValue}})
                    }
                }}
            />
        </>
    );
};

export default ReactQuillEditor;