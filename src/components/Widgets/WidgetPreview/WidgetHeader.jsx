import React from 'react';
import {Icon} from "../../../utils/Icon";
import {useSelector} from "react-redux";
import {Button} from "../../ui/button";

const WidgetHeader = ({widgetsSetting, selected, setSelected}) => {
    const projectDetailsReducer = useSelector(state => state.projectDetailsReducer);

    const navList = [
        {
            title: widgetsSetting.idea_title || 'Ideas',
            icon: Icon.ideasIcon,
            link: 'ideas',
            selected: selected === `ideas`,
            isCheck: widgetsSetting.is_idea === 0 ? false : true,
            isRedirect: widgetsSetting.idea_display === 2 ? false : true,
        },
        {
            title: widgetsSetting.roadmap_title || 'Roadmap',
            link: 'roadmap',
            icon: Icon.roadmapIcon,
            selected: selected === `roadmap`,
            isCheck: widgetsSetting.is_roadmap === 0 ? false : true,
            isRedirect: widgetsSetting.roadmap_display === 2 ? false : true,
        },
        {
            title: widgetsSetting.announcement_title || 'Announcements',
            link: 'announcements',
            icon: Icon.announcement,
            selected: selected === `announcements`,
            isCheck: widgetsSetting.is_announcement === 0 ? false : true,
            isRedirect: widgetsSetting.changelog_display === 2 ? false : true,
        }
    ];

    const onRedirect = (link,redirectType) => {
        if(redirectType){
            setSelected(link);
        }else{
            window.open(`https://${projectDetailsReducer.domain}/${link}`, "_blank")
        }
    };

    return (
        <header className="border-b border-slate-200" style={{backgroundColor:widgetsSetting.header_bg_color}}>
            <div className={"px-3"}>
                {
                    widgetsSetting?.hide_header === 1 ?
                        <div className="flex items-center gap-4 justify-between pt-3 pb-4">
                            <div className="inline-block align-middle cursor-pointer">
                                {
                                    projectDetailsReducer?.project_logo != '' ?
                                        <img src={`https://code.quickhunt.app/public/storage/project/${projectDetailsReducer.project_logo}`} alt={projectDetailsReducer?.project_name} className="max-h-10"/> : <div className="text-3xl font-medium tracking-tight transition-colors">{projectDetailsReducer?.project_name || ''}</div>
                                }
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className={`gap-2 flex`}>
                                    <Button variant={"outline"} style={{ borderColor:widgetsSetting?.header_btn_background_color,color:widgetsSetting?.header_btn_background_color, }} className="hover:bg-inherit text-primary border-primary bg-transparent">Sign in</Button>
                                    <Button style={{ backgroundColor:widgetsSetting?.header_btn_background_color,color:widgetsSetting?.header_btn_text_color}}>Sign up</Button>
                                </div>


                            </div>
                        </div> : ''
                }
                <ul className={`gap-1 mb-b-1 flex ${widgetsSetting?.hide_header === 0 ? 'pt-2' : ''}`}>
                    {
                        (navList || []).map((x, i) => {
                            if(x.isCheck){
                                return (
                                    <li key={`Nav_${i}`}>
                                        <button onClick={() => onRedirect(x.link, x.isRedirect)} style={{color:x.selected ? widgetsSetting.header_btn_background_color : widgetsSetting.header_text_color}} className={`${x.selected ? 'bg-slate-50 border-slate-200 text-primary' : 'border-transparent'}  border border-b-0 rounded-t-md flex items-center gap-1 text-sm py-2 px-2`} >{x.icon}{x.title}</button>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
            </div>
        </header>
    );
};

export default WidgetHeader;