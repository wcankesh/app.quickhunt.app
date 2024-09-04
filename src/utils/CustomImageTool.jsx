import React from 'react';
import ImageTool from '@editorjs/image';

class CustomImageTool extends ImageTool {
    constructor({ data, config, api, readOnly, block }) {
        super({ data, config, api, readOnly, block });
        debugger
        this.api = api;
        this.data = data;
    }




    render() {

        // Get the original Image Tool element
        const imageToolElement = super.render();

        // Create a delete button
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
            debugger
            try {
                // Retrieve the current block's index
                const blockIndex = this.api.blocks.getCurrentBlockIndex();

                // Retrieve the block's data
                const blockData = this.api.blocks.getBlockByIndex(blockIndex).data;

                // Log the entire block data to understand its structure
                console.log('Block Data:', blockData);

                // Extract image URL from blockData if it exists
                if (blockData && blockData.file && blockData.file.url) {
                    const imageUrl = blockData.file.url;

                    // Log image URL
                    console.log('Image URL:', imageUrl);

                    // Make API call to delete the image from the server
                    const response = await fetch('https://your-server.com/delete-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ imageUrl }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    // Optionally handle server response here
                    const responseData = await response.json();
                    console.log('Server Response:', responseData);

                    // Delete the block from Editor.js
                    this.api.blocks.delete(blockIndex);
                } else {
                    console.error('No image URL found in block data');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
            }
        });

        // Ensure the image tool element is positioned relative for absolute positioning of the button
        imageToolElement.style.position = 'relative';
        imageToolElement.appendChild(deleteButton);

        return imageToolElement;
    }
}

export default CustomImageTool;
