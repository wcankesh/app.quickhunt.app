import React from 'react';
import ImageTool from '@editorjs/image';

class CustomImageTool extends ImageTool {
    constructor({data, config, api, readOnly, block}) {
        super({data, config, api, readOnly, block});
        this.api = api;
        this.data = data;
    }

    render() {
        const imageToolElement = super.render();

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '10px';
        deleteButton.style.right = '10px';
        deleteButton.style.backgroundColor = 'red';
        deleteButton.style.color = 'white';
        deleteButton.style.border = 'none';
        deleteButton.style.padding = '5px 10px';
        deleteButton.style.cursor = 'pointer';

        // Add event listener to the delete button
        deleteButton.addEventListener('click', async () => {
            try {
                // Retrieve the current block's index
                const blockIndex = this.api.blocks.getCurrentBlockIndex();

                // Retrieve the block's data
                const blockData = this.api.blocks.getBlockByIndex(blockIndex).data;

                // Extract image URL from blockData if it exists
                if (blockData && blockData.file && blockData.file.url) {
                    const imageUrl = blockData.file.url;

                    // Make API call to delete the image from the server
                    const response = await fetch('https://your-server.com/delete-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({imageUrl}),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const responseData = await response.json();

                    this.api.blocks.delete(blockIndex);
                } else {
                    console.error('No image URL found in block data');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        });

        imageToolElement.style.position = 'relative';
        imageToolElement.appendChild(deleteButton);
        return imageToolElement;
    }
}

export default CustomImageTool;
