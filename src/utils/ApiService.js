import axios from "axios";
import {logout, removeProjectDetails, token, baseUrl} from "./constent";
import qs from 'qs';
const baseUrlApi = 'http://192.168.1.36:3001';
// const baseUrlApi = 'https://code.quickhunt.app/public/api';
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
            if(e.response.status === 403){
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
            if(e.response.status === 403){
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

    async patchData(url, data, isFormData) {
        const config = {
            headers: {
                "Content-Type": isFormData ? 'multipart/form-data' : "application/json",
                "Accept": "*/*"
            }
        }
        let resData = '';
        let response = '';
        await instance.patch(url, data, config).then((res) => {
            if(res.data.status === 200){
                response = res.data;
            }else{
                response = res.data
            }
        }).catch((e) => {
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
        return await this.postData(`${baseUrlApi}/auth/register`,payload)
    }
    async login (payload){
        return await this.postData(`${baseUrlApi}/auth/login`,payload)
    }
    async logout (payload){
        return await this.postData(`${baseUrlApi}/logout`,payload)
    }
    // async getLoginUserDetails (token = {}){
    //     return await this.getData(`${baseUrlApi}/user`, token)
    // }
    async getLoginUserDetails (token = {}){
        return await this.getData(`${baseUrlApi}/auth/user`, token)
    }
    // async updateLoginUserDetails (payload, id){
    //     return await this.postData(`${baseUrlApi}/users/${id}?_method=PUT`, payload, true)
    // }
    async updateLoginUserDetails (payload){
        return await this.patchData(`${baseUrlApi}/auth/update-user`, payload, true)
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
        return await this.getData(`${baseUrlApi}/invitedUser/get-invitation-detail?token=${token}`,)
    }
    async join (payload){
        return await this.postData(`${baseUrlApi}/invitedUser/accept-Reject`,payload)
    }

    /* --------------------------------- On Boarding ----------------------------------- */
    async onBoardingFlow (payload, token = {}) {
        return await this.postData(`${baseUrlApi}/auth/onBoard`, payload, false, token)
    }
    async onBoardingFlowComplete () {
        return await this.getData(`${baseUrlApi}/on-bord/complete`)
    }

    /* ---------- Announcement api ---------- */
    async getAllPosts (payload){
        return await this.getData(`${baseUrlApi}/post/get-all-post?${qs.stringify(payload)}`)
    }
    async getSinglePosts (id){
        return await this.getData(`${baseUrlApi}/post/get-one-post?id=${id}`)
    }
    async createPosts (payload){
        return await this.postData(`${baseUrlApi}/post/create-post`,payload, true)
    }
    async deletePostsImage (payload){
        return await this.postData(`${baseUrlApi}/remove-image`,payload,)
    }
    async filterPost (payload){
        return await this.postData(`${baseUrlApi}/search`,payload)
    }
    async updatePosts (payload, id){
        return await this.putData(`${baseUrlApi}/post/update-post?id=${id}`,payload, true)
    }
    async deletePosts (id){
        return await this.deleteData(`${baseUrlApi}/post/delete-post?id=${id}`)
    }
    async getFeedback (id){
        return await this.postData(`${baseUrlApi}/post-feedback/get-feedback?id=${id}`)
    }
    async getReaction (id){
        return await this.getData(`${baseUrlApi}/post-reaction/get-reaction?id=${id}`)
    }

    /* ---------- Settings Labels api ---------- */
    async getAllLabels (id){
        return await this.getData(`${baseUrlApi}/label/get-all-labels?id=${id}`)
    }
    async createLabels (payload){
        return await this.postData(`${baseUrlApi}/label/labels`,payload)
    }
    async updateLabels (payload, id){
        return await this.putData(`${baseUrlApi}/label/update-labels?id=${id}`,payload)
    }
    async deleteLabels (id){
        return await this.deleteData(`${baseUrlApi}/label/delete-labels?id=${id}`)
    }

    /* ---------- Settings Project api ---------- */
    async getAllProjects (){
        return await this.getData(`${baseUrlApi}/project/get-all`)
    }
    async getSingleProjects (id){
        return await this.getData(`${baseUrlApi}/project/get-single-project?id=${id}`)
    }
    async createProjects (payload, token = {}){
        return await this.postData(`${baseUrlApi}/project/create`,payload,false, token)
    }
    async updateProjects (payload, id){
        return await this.putData(`${baseUrlApi}/project/update-project?id=${id}`,payload, true)
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
        return await this.getData(`${baseUrlApi}/customerAuth/getAll?${qs.stringify(id)}`)
    }
    async getSingleUser (id){
        return await this.getData(`${baseUrlApi}/customers/${id}?is_history=1`)
    }
    async createUsers (payload){
        return await this.postData(`${baseUrlApi}/customerAuth/store`,payload)
    }
    async userManualUpVote (payload){
        return await this.postData(`${baseUrlApi}/customerAuth/vote`,payload)
    }
    async userAction (payload){
        return await this.postData(`${baseUrlApi}/customerAuth/vote`,payload)
    }
    async updateUsers (payload, id){
        return await this.putData(`${baseUrlApi}/customers/${id}`,payload)
    }
    async deleteUsers (id){
        return await this.deleteData(`${baseUrlApi}/customerAuth/delete/${id}`)
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

    /* ---------- Settings Status api ---------- */

    async createSettingsStatus (payload){
        return await this.postData(`${baseUrlApi}/road-map-status/roadmap-statuses`,payload)
    }
    async updateSettingsStatus (payload, id){
        return await this.putData(`${baseUrlApi}/road-map-status/update-roadmap-statuses?id=${id}`,payload)
    }
    async onDeleteSettingsStatus (id){
        return await this.deleteData(`${baseUrlApi}/road-map-status/delete-roadmap-statuses?id=${id}`)
    }
    async roadmapSettingsStatusRank (payload){
        return await this.patchData(`${baseUrlApi}/road-map-status/update-rank`,payload)
    }

    /* ---------- Ideas api ---------- */
    async getAllIdea (payload){
        return await this.getData(`${baseUrlApi}/idea/getAll?${qs.stringify(payload)}`)
    }
    async ideaSearch (payload){
        return await this.postData(`${baseUrlApi}/idea/search`,payload, )
    }
    // async getIdeaVote (payload){
    //     return await this.postData(`${baseUrlApi}/idea/votes`,payload, )
    // }
    async getIdeaVote (payload){
        return await this.postData(`${baseUrlApi}/vote/get-votes`,payload, )
    }
    // async removeUserVote (payload){
    //     return await this.postData(`${baseUrlApi}/idea/remove-vote`,payload, )
    // }
    async removeUserVote (payload){
        return await this.postData(`${baseUrlApi}/vote/remove-vote`,payload, )
    }
    async getSingleIdea (id){
        return await this.getData(`${baseUrlApi}/idea/getOne/${id}`)
    }

    /* ---------- Common Roadmap api and Ideas common api and Settings Statuses api ---------- */
    async giveVote (payload){
        return await this.postData(`${baseUrlApi}/vote/give-vote`,payload)
    }
    async updateIdea (payload, id){
        return await this.putData(`${baseUrlApi}/idea/update/${id}?_method=put`,payload, true)
    }
    async onDeleteIdea (id){
        return await this.deleteData(`${baseUrlApi}/idea/delete/${id}`)
    }
    async setRoadmapRank (payload){
        return await this.postData(`${baseUrlApi}/feature-idea/rank`, payload)
    }
    async createIdea (payload){
        return await this.postData(`${baseUrlApi}/idea/create`,payload, true)
    }
    // async createComment (payload){
    //     return await this.postData(`${baseUrlApi}/v1/comment`,payload, true)
    // }
    async createComment (payload){
        return await this.postData(`${baseUrlApi}/comment/add`,payload, true)
    }
    async updateComment (id){
        return await this.postData(`${baseUrlApi}/comment/update/${id}`, true)
    }
    async deleteComment (id){
        return await this.postData(`${baseUrlApi}/comment/delete/${id}` )
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
        return await this.postData(`${baseUrlApi}/article-category/categories`, payload, true)
    }
    async createSubCategory (payload){
        return await this.postData(`${baseUrlApi}/article-subCategory/subCategories`, payload, true)
    }
    async getAllCategory (payload){
        return await this.getData(`${baseUrlApi}/article-category/get-all-categories?${qs.stringify(payload)}`,)
    }
    async getAllSubCategory (id){
        return await this.getData(`${baseUrlApi}/article-subCategory/get-all-subCategories?id=${id}`,)
    }
    async updateCategory (payload, id){
        return await this.putData(`${baseUrlApi}/article-category/update-categories?id=${id}`,payload, true)
    }
    async updateSubCategory (payload, id){
        return await this.putData(`${baseUrlApi}/article-subCategory/update-subCategories?id=${id}`,payload, true)
    }
    async deleteCategories (id){
        return await this.deleteData(`${baseUrlApi}/article-category/delete-categories?id=${id}`)
    }
    async deleteSubCategories (id){
        return await this.deleteData(`${baseUrlApi}/article-subCategory/delete-subCategories?id=${id}`)
    }

    /* ---------- Help Center Articles api ---------- */
    async getAllArticles (payload){
        return await this.getData(`${baseUrlApi}/artical/get-all-articles?${qs.stringify(payload)}`,)
    }
    async createArticles (payload){
        return await this.postData(`${baseUrlApi}/artical/articles`, payload)
    }
    async getSingleArticle (id){
        return await this.getData(`${baseUrlApi}/artical/get-single-articles?id=${id}`)
    }
    async updateArticle (payload, id){
        return await this.putData(`${baseUrlApi}/artical/update-articles?id=${id}`, payload)
    }
    async deleteArticles (id){
        return await this.deleteData(`${baseUrlApi}/artical/delete-articles?id=${id}`)
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
        return await this.postData(`${baseUrlApi}/category/categories`, payload)
    }
    async deleteCategorySettings (id){
        return await this.deleteData(`${baseUrlApi}/category/delete-categories?id=${id}`)
    }
    async updateCategorySettings (payload, id){
        return await this.putData(`${baseUrlApi}/category/update-categories?id=${id}`,payload)
    }

    /* ---------- Settings Board api ---------- */
    async getAllBoards (id){
        return await this.getData(`${baseUrlApi}/board/get-all-boards?id=${id}`)
    }
    async createBoard (payload){
        return await this.postData(`${baseUrlApi}/board/boards`,payload)
    }
    async deleteBoard (id){
        return await this.deleteData(`${baseUrlApi}/board/delete-boards?id=${id}`)
    }
    async updateBoard (payload, id){
        return await this.putData(`${baseUrlApi}/board/update-boards?id=${id}`, payload)
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
        return await this.postData(`${baseUrlApi}/emoji/emojis`, payload)
    }
    async getAllEmoji (id){
        return await this.getData(`${baseUrlApi}/emoji/get-all-emojis?id=${id}`)
    }
    async deleteEmoji (id){
        return await this.deleteData(`${baseUrlApi}/emoji/delete-emojis?id=${id}`)
    }
    async updateEmoji (payload, id){
        return await this.putData(`${baseUrlApi}/emoji/update-emojis?id=${id}`,payload)
    }

    /* ---------- Settings Social api ---------- */
    async updateSocialSetting (payload){
        return await this.postData(`${baseUrlApi}/social/socials`, payload)
    }

    /* ---------- Settings Tags api ---------- */
    async createTopics (payload){
        return await this.postData(`${baseUrlApi}/tag/tags`, payload)
    }
    async updateTopics (payload, id){
        return await this.putData(`${baseUrlApi}/tag/update-tags?id=${id}`, payload)
    }
    async deleteTopics (id){
        return await this.deleteData(`${baseUrlApi}/tag/delete-tags?id=${id}`)
    }

    /* ---------- Settings Team api ---------- */
    async getAllMember (id){
        return await this.getData(`${baseUrlApi}/team/get-team?id=${id}`)
    }
    async getInvitation (id){
        return await this.getData(`${baseUrlApi}/invitedUser/get-all-invitedUsers?id=${id}`)
    }
    async inviteUser (payload){
        return await this.postData(`${baseUrlApi}/invitedUser/invite-member`, payload)
    }
    async removeMember (id){
        return await this.deleteData(`${baseUrlApi}/invitedUser/revoke-invitation?id=${id}` )
    }

    /* ---------- Import Export api ---------- */
    async ideaImport (payload){
        return await this.postData(`${baseUrlApi}/idea/import`, payload, true)
    }

    /* ---------- HeaderBar Api ---------- */
    async getAllStatusAndTypes (id){
        return await this.getData(`${baseUrlApi}/project/all-Detail?id=${id}`)
    }
    // async getAllProjects (){
    //     return await this.getData(`${baseUrlApi}/project/getAll`)
    // }

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
