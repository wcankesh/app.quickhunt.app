import React, {useEffect} from 'react';

const Notification = () => {
    useEffect(() => {
        // Ensure the Quickhunt_Config array exists
        window.Quickhunt_Config = window.Quickhunt_Config || [];
        // Push the configuration object
        window.Quickhunt_Config.push({
            Quickhunt_Widget_Key: "NnRwS0JmM1orRVNEbFc2cy9RdjRMZz09Ojozb0lVUU5CbXp3UkhuQjZoMmhKZTVRPT0="
        });

        // Dynamically load the external script
        const script = document.createElement('script');
        script.src = "https://widget.quickhunt.app/widgetScript.js";
        script.async = true;
        document.body.appendChild(script);

        // Cleanup script on component unmount
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <div>
            {/*<iframe src="https://quickhuntapp.quickhunt.app/widget/ideas?widget=311"*/}
            {/*        style={{border: "0px", outline: "0px", width: "100%", height: "calc(100vh - 56px)"}}*/}
            {/*/>*/}
        </div>
    );
};

export default Notification;