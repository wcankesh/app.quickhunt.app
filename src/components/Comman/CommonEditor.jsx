import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Embed from '@editorjs/embed';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import List from '@editorjs/list';
import Warning from '@editorjs/warning';
import Code from '@editorjs/code';
import LinkTool from '@editorjs/link';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';
import {BASE_URL_API} from "../../utils/constent";

const editorConstants = {
    embed: Embed,
    header: {
        class: Header,
        inlineToolbar: true,
        config: {
            placeholder: 'Enter a header',
            levels: [2, 3, 4],
            defaultLevel: 2,
        },
    },
    table: Table,
    marker: Marker,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: {
        class: Image,
        inlineToolbar: true,
        config: {
            endpoints: {
                byFile: `${BASE_URL_API}/upload`,
                byUrl: 'https://code.quickhunt.app/public/storage/post',
            },
            field: 'image',
            types: 'image/*',
        },
    },
    quote: Quote,
    inlineCode: InlineCode,
};

const CommonEditor = ({ value, onChange, setArticlesDetails }) => {
    const editorInstance = useRef(null);
    const editorContainerRef = useRef(null);

    const handleSave = React.useCallback(async () => {
        const savedData = await editorInstance.current.save();
        setArticlesDetails(prevState => ({
            ...prevState,
            description: JSON.stringify({blocks: savedData.blocks})
        }));
    }, []);

    const initializeEditor = () => {
        const editorData = value ? JSON.parse(value) : { blocks: [{ type: "paragraph", data: { text: "Hey" } }] };

        editorInstance.current = new EditorJS({
            holder: editorContainerRef?.current,
            autofocus: true,
            tools: editorConstants,
            data: editorData,
            onChange: handleSave
            // onChange: async () => {
            //     const savedData = await editorInstance?.current?.save();
            //     onChange(JSON.stringify({ blocks: savedData.blocks }));
            // },
        });
    };

    useEffect(() => {
                    if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                        editorInstance.current.destroy();
                    }

        initializeEditor();

        return () => {
            if (editorInstance.current && typeof editorInstance.current.destroy === 'function') {
                editorInstance.current.destroy();
            }
        };
    }, [value]);

    return <div ref={editorContainerRef} className="editor-container" />;
};

export default CommonEditor;
