import React, {useEffect, useRef} from 'react';
import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";

const Editor = ({blocks, id, onChange}) => {
    const editorCore = useRef(null);

    const handleSave = React.useCallback(async () => {
        const savedData = await editorCore.current.save();
        onChange(savedData.blocks)
    }, []);

    const editorConstants = {
        embed: Embed,
        image: {
            class: Image,
            inlineToolbar : true,
            config: {
                endpoints: {
                    byFile: 'https://code.quickhunt.app/public/api/upload', // Your file upload endpoint
                    byUrl: 'https://code.quickhunt.app/public/storage/post', // Your endpoint that provides image by URL
                },
                field: 'image',
                types: 'image/*',
                captionPlaceholder: ""

            },
            actions: [
                {
                    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" x2="10" y1="11" y2="17"/>
                        <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>,
                    title: 'Delete',
                    action: (block) => {
                        // handleImageDelete(editorCore, block.id);
                    },
                },
            ],
        },

    }
    useEffect(() => {
        const editor = new EditorJS({
            holder: id,
            autofocus: false,
            tools:editorConstants,
            enableReInitialize:true,
            placeholder: "Step description",
            onChange:handleSave,
            data:{
                time: new Date().getTime(),
                blocks: blocks,
                version: "2.12.4"
            }
        });
        editorCore.current = editor;
        return () => {
            if (editorCore.current && typeof editorCore.current.destroy === 'function') {
                editorCore.current.destroy(); // Destroy the editor instance
            }
        };

    }, []);
    return (
        <div id={id}>

        </div>
    );
};

export default Editor;