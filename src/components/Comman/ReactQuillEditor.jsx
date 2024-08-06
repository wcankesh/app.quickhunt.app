import React from 'react';
import ReactQuill from "react-quill";

const ReactQuillEditor = ({name, value, onChange}) => {
    return (
        <div>
            <ReactQuill
                theme="snow" className={"rounded-md border bg-card  "}
                modules={
                    {
                        toolbar: [
                            [{ size: [] }],
                            ["bold", "italic", "underline", "strike", "blockquote"],
                            [{ align: [] }],
                            [{ list: "ordered" }, { list: "bullet" }],
                            [{ "color": [] }],
                            ["link"],

                        ]
                    }
                }
                formats={[
                    "header", "height", "bold", "italic",
                    "underline", "strike", "blockquote",
                    "list", "color", "bullet", "indent",
                    "link", "image", "align", "size",
                ]}
                value={value}
                onChange={(value) => onChange({target: {name: name, value}})}
            />
        </div>
    );
};

export default ReactQuillEditor;