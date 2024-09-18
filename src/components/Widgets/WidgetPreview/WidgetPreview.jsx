import React,{Fragment, useState} from 'react';
import {Icon} from "../../../utils/Icon";
import {useSelector} from "react-redux";
import WidgetHeader from "./WidgetHeader";
import IdeaWidgetPreview from "./IdeaWidgetPreview";
import RoadmapWidgetPreview from "./RoadmapWidgetPreview";
import AnnouncementWidgetPreview from "./AnnouncementWidgetPreview";

const WidgetPreview = ({widgetsSetting, type, toggle,onToggle }) => {
    const allStatusAndTypes = useSelector(state => state.allStatusAndTypes);
    const [selected, setSelected] = useState("ideas")


    const renderContent = () => {
        return(
            <div className="flex flex-col h-full w-full">
                <WidgetHeader selected={selected} setSelected={setSelected} widgetsSetting={widgetsSetting}/>
                <main className="flex-1 block bg-slate-50 py-4 overflow-hidden">
                    {
                        selected === "ideas" && <IdeaWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    {
                        selected === "roadmap" && <RoadmapWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    {
                        selected === "announcements" && <AnnouncementWidgetPreview widgetsSetting={widgetsSetting}/>
                    }
                    <ul className="flex gap-2 mt-4 items-center justify-center">
                        {Object.entries(allStatusAndTypes?.social || {}).map(([social, url]) => {
                            if(url !== '' && url !== null){
                                return(
                                    <li key={social}>
                                        <a href={url} target="_blank" className="w-8 h-8 border rounded flex items-center justify-center" rel={social}>
                                            {Icon[social]}
                                        </a>
                                    </li>
                                )
                            }

                        })}
                    </ul>
                </main>
                <section className={'py-4'}>
                    <h6 className="text-sm font-semibold text-center ">Powered by <a className="text-primary underline" href="https://quickhunt.app" target="_blank">quickhunt</a></h6>
                </section>
            </div>
        )
    }
    return (
        <Fragment>
            {
                type === "popover" &&
                <div className={`QH-popover ${toggle ? "QH-popover-open" : ""}`} style={{
                    left: widgetsSetting.launcher_position === 1 ? "40px" : "inherit",
                    right: widgetsSetting.launcher_position === 2 ? "40px" : "inherit",
                    width: `${widgetsSetting.popover_width}px`, height: `${widgetsSetting.popover_height}px`
                }}>
                    {renderContent()}
                </div>
            }

            {
                type === "sidebar" &&
                <div className={"relative h-full"}>
                    <div className={`QH-sidebar ${toggle ? "QH-sidebar-open" : ""} relative`} style={{
                        left: widgetsSetting.sidebar_position === 1 ? "350px" : "inherit",
                        right: widgetsSetting.sidebar_position === 2 ? "0" : "inherit",
                    }}>
                        <div className="QH-sidebar-content" style={{
                            left: widgetsSetting.sidebar_position === 1 ? "350px" : "inherit",
                            right: widgetsSetting.sidebar_position === 2 ? "0" : "inherit",
                            width: `${widgetsSetting.sidebar_width}px`,
                        }}>
                            {renderContent()}
                        </div>
                        <div className="QH-sidebar-shadow" onClick={onToggle}>&nbsp;</div>
                    </div>
                </div>
            }

            {
                type === "modal" &&
                <div className={"relative h-full"}>
                    <div className={`QH-modal ${toggle ? "QH-modal-open" : ""}`}>
                        <div className={"QH-modal-content"}
                             style={{
                                 width: `${widgetsSetting.modal_width}px`,
                                 height: `${widgetsSetting.modal_height}px`,
                             }}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            }

            {
                type === "embed" &&
                <div className={"p-[64px] h-full "}>
                    <div className={"QH-widget-embed border rounded-lg"}>
                        <div className={"QH-embed"}>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            }

        </Fragment>
    );
};

export default WidgetPreview;