import axios from "axios";
import {logout, removeProjectDetails, token, baseUrl} from "./constent";
import qs from 'qs';
const baseUrlApi = 'https://code.quickhunt.app/public/api';
let instance = axios.create();
instance.interceptors.request.use(function (config) {
    if(config?.headers?.Authorization){
        config.headers["Authorization"] = config?.headers?.Authorization
    } else {
        config.headers["Authorization"] = `Bearer ${token() || ''}`
    }
    return config;

});

export class ApiService{
    async getData(url, header){
        const config = {
            headers: {
                ...header || {},
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
        };
        let resData = '';
        let response = '';
        await instance.get(url,config).then((res) =>{
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) =>{
            if(e.response.status === 401){
                logout();
                removeProjectDetails()
                window.location.replace(`${baseUrl}/login`)
            }
            resData = e && e.response && e.response.data;
        })
        return resData || response
    }

    async postData(url,data,isFormData, header){
        const config = {
            headers:{
                ...header || {},
                "Content-Type": isFormData ? 'multipart/form-data' : "application/json",
                "Accept": "*/*"
            }
        }
        let resData = '';
        let response = '';
        await instance.post(url,data,config).then((res) =>{
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) =>{
            if(e.response.status === 401){
                logout();
                removeProjectDetails()
                window.location.replace(`${baseUrl}/login`)
            }
            resData = e.response.data;
        })
        return resData || response
    }

    async putData(url,data, isFormData){
        const config = {
            headers:{
                "Content-Type": isFormData ? 'multipart/form-data' : "application/json",
                "Accept": "*/*"
            }
        }
        let resData = '';
        let response = '';
        await instance.put(url,data,config).then((res) =>{
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) =>{
            if(e.response.status === 401){
                logout();
                removeProjectDetails()
                window.location.replace(`${baseUrl}/login`)
            }
            resData = e.response.data;
        })
        return resData || response
    }

    async deleteData(url){
        const config = {
            headers:{
                "Content-Type": "application/json",
                "Accept": "*/*"
            }
        }
        let resData = '';
        let response = '';
        await instance.delete(url,config).then((res) =>{
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) =>{
            if(e.response.status === 401){
                logout();
                removeProjectDetails()
                window.location.replace(`${baseUrl}/login`)
            }
            resData = e.response.data;
        })
        return resData || response
    }

    async postDataAuth(url,data,header){
        const config = {
            headers:{
                'Content-Type': 'application/json',
                ...header || {}
            }
        }
        let resData = '';
        let response = '';
        await axios.post(url,data,config).then((res) =>{
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) =>{

            resData = e.response.data;
        })
        return resData || response
    }

    /* ---------- Auth Folder api and Settings Profile api ---------- */
    async adminSignup (payload){
        return await this.postDataAuth(`${baseUrlApi}/users`,payload)
    }
    async login (payload){
        return await this.postDataAuth(`${baseUrlApi}/login`,payload)
    }
    async logout (payload){
        return await this.postData(`${baseUrlApi}/logout`,payload)
    }
    async getLoginUserDetails (token = {}){
        return await this.getData(`${baseUrlApi}/user`, token)
    }
    async updateLoginUserDetails (payload, id){
        return await this.postData(`${baseUrlApi}/users/${id}?_method=PUT`, payload, true)
    }
    async changePassword (payload){
        return await this.postData(`${baseUrlApi}/change-password`,payload)
    }
    async forgotPassword (payload){
        return await this.postData(`${baseUrlApi}/forgot-password`,payload)
    }
    async resetPassword (payload){
        return await this.postData(`${baseUrlApi}/reset-password`,payload)
    }
    async getInvitationDetail (token){
        return await this.getData(`${baseUrlApi}/invitation-detail?token=${token}`,)
    }
    async join (payload){
        return await this.postData(`${baseUrlApi}/join`,payload)
    }

    /* --------------------------------- On Boarding ----------------------------------- */
    async onBoardingFlow (payload, token = {}) {
        return await this.postData(`${baseUrlApi}/on-bord`, payload, false, token)
    }
    async onBoardingFlowComplete () {
        return await this.getData(`${baseUrlApi}/on-bord/complete`)
    }

    /* ---------- Announcement api ---------- */
    async getAllPosts (payload){
        return await this.getData(`${baseUrlApi}/posts?${qs.stringify(payload)}`)
    }
    async getSinglePosts (id){
        return await this.getData(`${baseUrlApi}/posts/${id}`)
    }
    async createPosts (payload){
        return await this.postData(`${baseUrlApi}/posts`,payload, true)
    }
    async deletePostsImage (payload){
        return await this.postData(`${baseUrlApi}/remove-image`,payload,)
    }
    async filterPost (payload){
        return await this.postData(`${baseUrlApi}/search`,payload)
    }
    async updatePosts (payload, id){
        return await this.postData(`${baseUrlApi}/posts/${id}?_method=put`,payload, true)
    }
    async deletePosts (id, pageNo){
        return await this.deleteData(`${baseUrlApi}/posts/${id}/${pageNo}`)
    }
    async getFeedback (payload){
        return await this.postData(`${baseUrlApi}/get-feedback`, payload)
    }
    async getReaction (payload){
        return await this.getData(`${baseUrlApi}/get-reaction?${qs.stringify(payload)}`)
    }

    /* ---------- Settings Labels api ---------- */
    async getAllLabels (id){
        return await this.getData(`${baseUrlApi}/labels?project_id=${id}`)
    }
    async createLabels (payload){
        return await this.postData(`${baseUrlApi}/labels`,payload)
    }
    async updateLabels (payload, id){
        return await this.putData(`${baseUrlApi}/labels/${id}`,payload)
    }
    async deleteLabels (id){
        return await this.deleteData(`${baseUrlApi}/labels/${id}`)
    }

    /* ---------- Settings Project api ---------- */
    async getAllProjects (){
        return await this.getData(`${baseUrlApi}/projects`)
    }
    async getSingleProjects (id){
        return await this.getData(`${baseUrlApi}/projects/${id}`)
    }
    async createProjects (payload, token = {}){
        return await this.postData(`${baseUrlApi}/projects`,payload,false, token)
    }
    async updateProjects (payload, id){
        return await this.postData(`${baseUrlApi}/projects/${id}?_method=PUT`,payload, true)
    }
    async deleteProjects (id){
        return await this.deleteData(`${baseUrlApi}/projects/${id}`)
    }

    /* ---------- Inbox api ---------- */
    async inboxNotification (payload){
        return await this.postData(`${baseUrlApi}/notifications`,payload)
    }
    async inboxMarkAllRead (payload){
        return await this.postData(`${baseUrlApi}/mark-read`,payload)
    }

    /* ---------- Users api ---------- */
    async getAllUsers (id){
        return await this.getData(`${baseUrlApi}/customers?${qs.stringify(id)}`)
    }
    async getSingleUser (id){
        return await this.getData(`${baseUrlApi}/customers/${id}?is_history=1`)
    }
    async createUsers (payload){
        return await this.postData(`${baseUrlApi}/customers`,payload)
    }
    async userManualUpVote (payload){
        return await this.postData(`${baseUrlApi}/customer/vote`,payload)
    }
    async userAction (payload){
        return await this.postData(`${baseUrlApi}/customer-actions`,payload)
    }
    async updateUsers (payload, id){
        return await this.putData(`${baseUrlApi}/customers/${id}`,payload)
    }
    async deleteUsers (id){
        return await this.deleteData(`${baseUrlApi}/customers/${id}`)
    }

    /* ---------- Roadmap api ---------- */
    async getRoadmapIdea (payload){
        return await this.postData(`${baseUrlApi}/roadmap-idea`, payload)
    }
    async getAllRoadmapStatus (id){
        return await this.getData(`${baseUrlApi}/roadmap-status?project_id=${id}`)
    }
    async createRoadmapStatus (payload){
        return await this.postData(`${baseUrlApi}/roadmap-status`,payload)
    }
    async updateRoadmapStatus (payload, id){
        return await this.putData(`${baseUrlApi}/roadmap-status/${id}`,payload)
    }

    /* ---------- Ideas api ---------- */
    async getAllIdea (payload){
        return await this.getData(`${baseUrlApi}/feature-idea?${qs.stringify(payload)}`)
    }
    async ideaSearch (payload){
        return await this.postData(`${baseUrlApi}/idea/search`,payload, )
    }
    async getIdeaVote (payload){
        return await this.postData(`${baseUrlApi}/idea/votes`,payload, )
    }
    async removeUserVote (payload){
        return await this.postData(`${baseUrlApi}/idea/remove-vote`,payload, )
    }
    async getSingleIdea (id){
        return await this.getData(`${baseUrlApi}/feature-idea/${id}`)
        // return await this.getData(`${baseUrlApi}/v1/feature-idea/${id}`)
    }

    /* ---------- Common Roadmap api and Ideas common api and Settings Statuses api ---------- */
    async giveVote (payload){
        return await this.postData(`${baseUrlApi}/v1/vote`,payload)
    }
    async updateIdea (payload, id){
        return await this.postData(`${baseUrlApi}/feature-idea/${id}?_method=put`,payload, true)
    }
    async onDeleteIdea (id){
        return await this.deleteData(`${baseUrlApi}/feature-idea/${id}`)
    }
    async setRoadmapRank (payload){
        return await this.postData(`${baseUrlApi}/feature-idea/rank`, payload)
    }
    async createIdea (payload){
        return await this.postData(`${baseUrlApi}/feature-idea`,payload, true)
    }
    async createComment (payload){
        return await this.postData(`${baseUrlApi}/v1/comment`,payload, true)
    }
    async updateComment (payload){
        return await this.postData(`${baseUrlApi}/v1/edit-comment`,payload, true)
    }
    async deleteComment (payload){
        return await this.postData(`${baseUrlApi}/v1/delete-comment`,payload, )
    }
    async roadmapStatusRank (payload){
        return await this.postData(`${baseUrlApi}/roadmap-status/rank`,payload)
    }
    async deleteRoadmapStatus (id){
        return await this.deleteData(`${baseUrlApi}/roadmap-status/${id}`)
    }

    /* ---------- Dashboard api ---------- */
    async dashboardData (payload){
        return await this.postData(`${baseUrlApi}/dashboard`,payload)
    }
    async dashboardDataFeed (payload){
        return await this.postData(`${baseUrlApi}/feedbacks?${qs.stringify(payload)}`)
    }
    async dashboardDataReactions (payload){
        return await this.postData(`${baseUrlApi}/reactions?${qs.stringify(payload)}`)
    }

    /* ---------- In App Message api ---------- */
    // async getAllInAppMessage (id){
    //     return await this.getData(`${baseUrlApi}/app-message?project_id=${id}`)
    // }
    async getAllInAppMessage (payload){
        return await this.getData(`${baseUrlApi}/app-message?${qs.stringify(payload)}`)
    }
    async createInAppMessage (payload){
        return await this.postData(`${baseUrlApi}/app-message`, payload)
    }
    async deleteInAppMessage (id){
        return await this.deleteData(`${baseUrlApi}/app-message/${id}`)
    }
    async getSingleInAppMessage (id){
        return await this.getData(`${baseUrlApi}/app-message/${id}`)
    }
    async getResponseInAppMessage (payload){
        return await this.postData(`${baseUrlApi}/response/report`, payload)
    }
    async updateInAppMessage (payload, id){
        return await this.postData(`${baseUrlApi}/app-message/${id}?_method=PUT`, payload)
    }
    async updateInAppMessageStatus (payload, id){
        return await this.postData(`${baseUrlApi}/app-message/status/${id}`, payload)
    }
    async filterMessageType (payload){
        return await this.postData(`${baseUrlApi}/search`,payload)
    }

    /* ---------- Help Center Category api ans Settings Categories api ---------- */
    async createCategory (payload){
        return await this.postData(`${baseUrlApi}/help/category`, payload, true)
    }
    async createSubCategory (payload){
        return await this.postData(`${baseUrlApi}/help/sub-category`, payload, true)
    }
    async getAllCategory (payload){
        return await this.postData(`${baseUrlApi}/help/categories?${qs.stringify(payload)}`,)
    }
    async getAllSubCategory (id){
        return await this.getData(`${baseUrlApi}/help/sub-categories?project_id=${id}`,)
    }
    async updateCategory (payload, id){
        return await this.postData(`${baseUrlApi}/help/category/${id}`,payload, true)
    }
    async updateSubCategory (payload, id){
        return await this.postData(`${baseUrlApi}/help/sub-category/${id}`,payload, true)
    }
    async deleteCategories (id){
        return await this.deleteData(`${baseUrlApi}/help/category/${id}`)
    }
    async deleteSubCategories (id){
        return await this.deleteData(`${baseUrlApi}/help/sub-category/${id}`)
    }

    /* ---------- Help Center Articles api ---------- */
    async getAllArticles (payload){
        return await this.postData(`${baseUrlApi}/help/articles?${qs.stringify(payload)}`,)
    }
    async createArticles (payload){
        return await this.postData(`${baseUrlApi}/help/article`, payload, true)
    }
    async getSingleArticle (id){
        return await this.getData(`${baseUrlApi}/help/article/${id}`)
    }
    async updateArticle (payload, id){
        return await this.postData(`${baseUrlApi}/help/article/${id}`,payload, true)
    }
    async deleteArticles (id){
        return await this.deleteData(`${baseUrlApi}/help/article/${id}`)
    }
    async articleSearch (payload){
        return await this.postData(`${baseUrlApi}/help/article`, payload)
    }

    /* ---------- Widget api ---------- */
    async getWidgets (id){
        return await this.getData(`${baseUrlApi}/widget/${id}`)
    }
    async updateWidgets (payload, id){
        return await this.postData(`${baseUrlApi}/widget/${id}?_method=PUT`, payload)
    }
    async createWidgets (payload){
        return await this.postData(`${baseUrlApi}/widget`, payload)
    }
    async onDeleteWidget (id){
        return await this.deleteData(`${baseUrlApi}/widget/${id}`)
    }
    async getWidgetsSetting (payload){
        return await this.getData(`${baseUrlApi}/widget?${qs.stringify(payload)}`)
    }

    /* ---------- Settings Board api ---------- */
    async createCategorySettings (payload){
        return await this.postData(`${baseUrlApi}/category`, payload)
    }
    async deleteCategorySettings (id){
        return await this.deleteData(`${baseUrlApi}/category/${id}`)
    }
    async updateCategorySettings (payload, id){
        return await this.putData(`${baseUrlApi}/category/${id}`,payload)
    }

    /* ---------- Settings Board api ---------- */
    async getAllBoards (payload){
        return await this.getData(`${baseUrlApi}/board?${qs.stringify(payload)}`)
    }
    async createBoard (payload){
        return await this.postData(`${baseUrlApi}/board`,payload)
    }
    async deleteBoard (id){
        return await this.deleteData(`${baseUrlApi}/board/${id}`)
    }
    async updateBoard (payload, id){
        return await this.putData(`${baseUrlApi}/board/${id}`, payload)
    }

    /* ---------- Settings Domain api and GeneralSettings api ---------- */
    async getPortalSetting (id){
        return await this.getData(`${baseUrlApi}/setting?project_id=${id}`,)
    }
    async updatePortalSetting (id, payload){
        return await this.putData(`${baseUrlApi}/setting/${id}`,payload)
    }

    /* ---------- Settings Emoji api ---------- */
    async createEmoji (payload){
        return await this.postData(`${baseUrlApi}/emoji`, payload)
    }
    async getAllEmoji (id){
        return await this.getData(`${baseUrlApi}/emoji?project_id=${id}`)
    }
    async deleteEmoji (id){
        return await this.deleteData(`${baseUrlApi}/emoji/${id}`)
    }
    async updateEmoji (payload, id){
        return await this.putData(`${baseUrlApi}/emoji/${id}`,payload)
    }

    /* ---------- Settings Social api ---------- */
    async updateSocialSetting (payload){
        return await this.postData(`${baseUrlApi}/social-setting`, payload)
    }

    /* ---------- Settings Tags api ---------- */
    async createTopics (payload){
        return await this.postData(`${baseUrlApi}/topic`, payload)
    }
    async updateTopics (payload, id){
        return await this.putData(`${baseUrlApi}/topic/${id}`, payload)
    }
    async deleteTopics (id){
        return await this.deleteData(`${baseUrlApi}/topic/${id}`)
    }

    /* ---------- Settings Team api ---------- */
    async getMember (payload){
        return await this.postData(`${baseUrlApi}/member`, payload)
    }
    async getInvitation (payload){
        return await this.getData(`${baseUrlApi}/invitation?${qs.stringify(payload)}`)
    }
    async inviteUser (payload){
        return await this.postData(`${baseUrlApi}/invite`, payload)
    }
    async removeMember (payload){
        return await this.postData(`${baseUrlApi}/remove-member`,payload, )
    }

    /* ---------- Import Export api ---------- */
    async ideaImport (payload){
        return await this.postData(`${baseUrlApi}/idea/import`, payload, true)
    }

    /* ---------- HeaderBar Api ---------- */
    async getAllStatusAndTypes (id){
        return await this.getData(`${baseUrlApi}/all?project_id=${id}`)
    }

    /* ---------- Pricing Plan Api ---------- */
    async cancelPlan (){
        return await this.getData(`${baseUrlApi}/cancel`,)
    }
    async resubscribe (payload){
        return await this.postData(`${baseUrlApi}/resubscribe`,payload)
    }
    async checkout (payload){
        return await this.postData(`${baseUrlApi}/checkout`,payload)
    }
    async upcomingInvoice (payload){
        return await this.postData(`${baseUrlApi}/upcoming-invoice`,payload)
    }
    async changePlan (payload){
        return await this.postData(`${baseUrlApi}/change-plan`,payload)
    }
    async manageSubscription (){
        return await this.getData(`${baseUrlApi}/manage-subscription`,)
    }

    /* ---------- Other Api ---------- */
    async getEmailSetting (id){
        return await this.getData(`${baseUrlApi}/email-setting?project_id=${id}`,)
    }
    async getSocialSetting (id){
        return await this.getData(`${baseUrlApi}/social-setting?project_id=${id}`,)
    }
    async updateEmailSetting (payload){
        return await this.postData(`${baseUrlApi}/email-setting`,payload)
    }
    async getAllTopics (id){
        return await this.getData(`${baseUrlApi}/topic?project_id=${id}`)
    }
    async follow (payload){
        return await this.postData(`${baseUrlApi}/follow`,payload, )
    }
    async prices (){
        return await this.getData(`${baseUrlApi}/prices`)
    }
    async payment (payload){
        return await this.postData(`${baseUrlApi}/payment`,payload)
    }
    async paymentStatus (payload){
        return await this.postData(`${baseUrlApi}/payment-status`,payload)
    }
}
