import React, {useEffect, useRef, useId} from 'react';
import ReactQuill from "react-quill";
import {cn} from "../../lib/utils";
import {cleanQuillHtml} from "../../utils/constent";

const ReactQuillEditor = ({name, value, onChange, className, hideToolBar, setImageSizeError}) => {
    const quillRef = useRef(null);
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    const sanitizeHTML = (html) => {
        // Remove all HTML tags and check if the result is empty
        const stripped = html.replace(/(<([^>]+)>)/gi, "").trim();
        // Return an empty string if there's no actual content
        return stripped.length === 0 ? "" : html;
    };

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const handleImage = () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.click();

            input.onchange = () => {
                const file = input.files[0];
                if (file) {
                    // Check file size
                    if (file.size > MAX_IMAGE_SIZE) {
                        setImageSizeError('Image size exceeds 5MB limit.');
                        return;
                    }

                    // Read file as data URL
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result;
                        // Insert image into editor
                        const range = quill.getSelection(true); // Ensure selection is valid
                        if (range) {
                            quill.insertEmbed(range.index, 'image', base64);
                            // Trigger onChange to update description
                            const newValue = quill.root.innerHTML;
                            onChange({ target: { name, value: sanitizeHTML(newValue) } });
                            setImageSizeError(''); // Clear any existing error
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
        };

        // Override default image handler
        quill.getModule('toolbar').addHandler('image', handleImage);

        // Check existing content for images and validate size
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        const images = doc.getElementsByTagName('img');
        for (let img of images) {
            if (img.src.startsWith('data:image/')) {
                const base64String = img.src.split(',')[1];
                const size = (base64String.length * 3) / 4; // Approximate byte size
                if (size > MAX_IMAGE_SIZE) {
                    setImageSizeError('Image size exceeds 5MB limit.');
                    break;
                } else {
                    setImageSizeError('');
                }
            }
        }
    }, [value, setImageSizeError, name, onChange]);

    return (
        <>
            <ReactQuill
                ref={quillRef}
                className={cn("rounded-md border bg-card min-h-[145px] h-full", className)}
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
                    if (source === 'user') {
                        const sanitizedValue = sanitizeHTML(newValue);
                        onChange({ target: { name: name, value: sanitizedValue } });
                        // Check for images in the new content
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(newValue, 'text/html');
                        const images = doc.getElementsByTagName('img');
                        let hasOversizedImage = false;
                        for (let img of images) {
                            if (img.src.startsWith('data:image/')) {
                                const base64String = img.src.split(',')[1];
                                const size = (base64String.length * 3) / 4; // Approximate byte size
                                if (size > MAX_IMAGE_SIZE) {
                                    hasOversizedImage = true;
                                    break;
                                }
                            }
                        }
                        setImageSizeError(hasOversizedImage ? 'Image size exceeds 5MB limit.' : '');
                    }
                }}
            />
        </>
    );
};

export default ReactQuillEditor;

// this works for row also
// export const DisplayReactQuill = ({ value, fontFamily = 'inherit', truncateLength = 100 }) => {
//     const quillRef = useRef(null);
//     const uniqueId = useId();
//     const [isExpanded, setIsExpanded] = useState(false);
//     const [truncatedValue, setTruncatedValue] = useState('');
//
//     const newValue = cleanQuillHtml(value);
//
//     useEffect(() => {
//         // Truncate the content if needed
//         if (!isExpanded && newValue && newValue.length > truncateLength) {
//             setTruncatedValue(newValue.slice(0, truncateLength) + '...');
//         } else {
//             setTruncatedValue(newValue);
//         }
//     }, [newValue, isExpanded, truncateLength]);
//
//     useEffect(() => {
//         if (quillRef.current) {
//             const editor = quillRef.current.getEditor();
//             const editorContainer = editor.root;
//             editorContainer.style.fontFamily = fontFamily;
//         }
//     }, [fontFamily]);
//
//     return (
//         <>
//             <style>
//                 {`
//                     .custom-react-quill .ql-editor { font-family: inherit; padding: 0px; }
//                     .custom-react-quill .ql-container.ql-snow, .ql-container.ql-snow {border: none; border-top: none!important}
//                 `}
//             </style>
//             {newValue ? (
//                 <div>
//                     <ReactQuill
//                         ref={quillRef}
//                         id={uniqueId}
//                         className="custom-react-quill"
//                         value={isExpanded ? newValue : truncatedValue}
//                         readOnly
//                         modules={{ toolbar: false }}
//                     />
//                     {newValue.length > truncateLength && (
//                         <button
//                             style={{
//                                 marginTop: '10px',
//                                 background: 'none',
//                                 border: 'none',
//                                 color: 'blue',
//                                 textDecoration: 'underline',
//                                 cursor: 'pointer'
//                             }}
//                             onClick={() => setIsExpanded(!isExpanded)}
//                         >
//                             {isExpanded ? 'Read Less' : 'Read More'}
//                         </button>
//                     )}
//                 </div>
//             ) : null}
//         </>
//     );
// };

export const DisplayReactQuill = ({value, fontFamily = 'inherit'}) => {
    const quillRef = useRef(null);
    const uniqueId = useId();
    const newValue = cleanQuillHtml(value);

    useEffect(() => {
        if (quillRef.current) {
            const editor = quillRef.current.getEditor();
            const editorContainer = editor.root;
            editorContainer.style.fontFamily = fontFamily;
        }
    }, [fontFamily]);

    return (
        <>
            <style>
                {`
                    .custom-react-quill .ql-editor { font-family: inherit; padding: 0px; }
                    .custom-react-quill .ql-container.ql-snow, .ql-container.ql-snow {border: none; border-top: none!important}
                `}
            </style>
            {
                newValue ?
                    <ReactQuill ref={quillRef} id={uniqueId} className="custom-react-quill text-muted-foreground" value={value} readOnly modules={{toolbar: false}}/> :
                    null
            }
        </>
    );
};