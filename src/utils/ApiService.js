import axios from "axios";
import {logout, removeProjectDetails, token, baseUrl} from "./constent";
import qs from 'qs';
const baseUrlApi = 'https://code.quickhunt.app/public/api';
let instance = axios.create();
instance.interceptors.request.use(function (config) {
    config.headers["Authorization"] = `Bearer ${token()}`;
    return config;
});

export class ApiService{
    async getData(url){
        const config = {
            headers: {
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

    async postData(url,data,isFormData){
        const config = {
            headers:{
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

    async adminSignup (payload){
        return await this.postDataAuth(`${baseUrlApi}/users`,payload)
    }
    async login (payload){
        return await this.postDataAuth(`${baseUrlApi}/login`,payload)
    }
    async logout (payload){
        return await this.postData(`${baseUrlApi}/logout`,payload)
    }
    async getLoginUserDetails (){
        return await this.getData(`${baseUrlApi}/user`)
    }
    async updateLoginUserDetails (payload, id){
        return await this.postData(`${baseUrlApi}/users/${id}?_method=PUT`, payload, true)
    }
    async getAllPosts (payload){
        return await this.getData(`${baseUrlApi}/posts?${qs.stringify(payload)}`)
    }
    async getSinglePosts (id){
        return await this.getData(`${baseUrlApi}/posts/${id}`)
    }
    async createPosts (payload){
        return await this.postData(`${baseUrlApi}/posts`,payload, true)
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
    async getAllLabels (id){
        return await this.getData(`${baseUrlApi}/labels?project_id=${id}`)
    }
    async createLabels (payload){
        return await this.postData(`${baseUrlApi}/labels`,payload)
    }
    async createRoadmapStatus (payload){
        return await this.postData(`${baseUrlApi}/roadmap-status`,payload)
    }
    async updateLabels (payload, id){
        return await this.putData(`${baseUrlApi}/labels/${id}`,payload)
    }
    async updateRoadmapStatus (payload, id){
        return await this.putData(`${baseUrlApi}/roadmap-status/${id}`,payload)
    }
    async deleteLabels (id){
        return await this.deleteData(`${baseUrlApi}/labels/${id}`)
    }
    async deleteRoadmapStatus (id){
        return await this.deleteData(`${baseUrlApi}/roadmap-status/${id}`)
    }
    async getAllProjects (){
        return await this.getData(`${baseUrlApi}/projects`)
    }
    async getSingleProjects (id){
        return await this.getData(`${baseUrlApi}/projects/${id}`)
    }
    async createProjects (payload){
        return await this.postData(`${baseUrlApi}/projects`,payload)
    }
    async updateProjects (payload, id){
        return await this.postData(`${baseUrlApi}/projects/${id}?_method=PUT`,payload, true)
    }
    async deleteProjects (id){
        return await this.deleteData(`${baseUrlApi}/projects/${id}`)
    }
    async getAllCustomers (id){
        return await this.getData(`${baseUrlApi}/customers?${qs.stringify(id)}`)
    }
    async getSingleCustomers (id){
        return await this.getData(`${baseUrlApi}/customers/${id}?is_history=1`)
    }
    async createCustomers (payload){
        return await this.postData(`${baseUrlApi}/customers`,payload)
    }
    async updateCustomers (payload, id){
        return await this.putData(`${baseUrlApi}/customers/${id}`,payload)
    }
    async deleteCustomers (id){
        return await this.deleteData(`${baseUrlApi}/customers/${id}`)
    }
    async createCategory (payload){
        return await this.postData(`${baseUrlApi}/category`, payload)
    }
    async getAllCategory (id){
        return await this.getData(`${baseUrlApi}/category?project_id=${id}`,)
    }
    async updateCategory (payload, id){
        return await this.putData(`${baseUrlApi}/category/${id}`,payload)
    }
    async deleteCategories (id){
        return await this.deleteData(`${baseUrlApi}/category/${id}`)
    }
    async getFeedback (payload){
        return await this.postData(`${baseUrlApi}/get-feedback`, payload)
    }
    async getReaction (payload){
        return await this.getData(`${baseUrlApi}/get-reaction?post_id=${payload.post_id}`)
    }

    async getMember (payload){
        return await this.postData(`${baseUrlApi}/member`, payload)
    }
    async inviteUser (payload){
        return await this.postData(`${baseUrlApi}/invite`, payload)
    }
    async getEmailSetting (id){
        return await this.getData(`${baseUrlApi}/email-setting?project_id=${id}`,)
    }
    async getSocialSetting (id){
        return await this.getData(`${baseUrlApi}/social-setting?project_id=${id}`,)
    }
    async updateEmailSetting (payload){
        return await this.postData(`${baseUrlApi}/email-setting`,payload)
    }
    async join (payload){
        return await this.postData(`${baseUrlApi}/join`,payload)
    }
    async getPortalSetting (id){
        return await this.getData(`${baseUrlApi}/setting?project_id=${id}`,)
    }
    async getInvitationDetail (token){
        return await this.getData(`${baseUrlApi}/invitation-detail?token=${token}`,)
    }
    async updatePortalSetting (id, payload){
        return await this.putData(`${baseUrlApi}/setting/${id}`,payload)
    }
    async updateSocialSetting (payload){
        return await this.postData(`${baseUrlApi}/social-setting`, payload)
    }

    async getAllTopics (id){
        return await this.getData(`${baseUrlApi}/topic?project_id=${id}`)
    }
    async createTopics (payload){
        return await this.postData(`${baseUrlApi}/topic`, payload)
    }
    async updateTopics (payload, id){
        return await this.putData(`${baseUrlApi}/topic/${id}`, payload)
    }
    async updateWidgets (payload, id){
        return await this.putData(`${baseUrlApi}/widget/${id}`, payload)
    }
    async deleteTopics (id){
        return await this.deleteData(`${baseUrlApi}/topic/${id}`)
    }

    async onDeleteIdea (id){
        return await this.deleteData(`${baseUrlApi}/feature-idea/${id}`)
    }
    async getAllStatusAndTypes (id){
        return await this.getData(`${baseUrlApi}/all?project_id=${id}`)
    }

    async getAllIdea (payload){
        return await this.getData(`${baseUrlApi}/feature-idea?${qs.stringify(payload)}`)
    }
    async getAllRoadmapStatus (id){
        return await this.getData(`${baseUrlApi}/roadmap-status?project_id=${id}`)
    }
    async getWidgetsSetting (id){
        return await this.getData(`${baseUrlApi}/widget?project_id=${id}`)
    }
    async getRoadmapIdea (payload){
        return await this.postData(`${baseUrlApi}/roadmap-idea`, payload)
    }
    async giveVote (payload){
        return await this.postData(`${baseUrlApi}/v1/vote`,payload)
    }

    async createIdea (payload){
        return await this.postData(`${baseUrlApi}/feature-idea`,payload, true)
    }

    async updateIdea (payload, id){
        return await this.postData(`${baseUrlApi}/feature-idea/${id}?_method=put`,payload, true)
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

    async follow (payload){
        return await this.postData(`${baseUrlApi}/follow`,payload, )
    }
    async ideaSearch (payload){
        return await this.postData(`${baseUrlApi}/idea/search`,payload, )
    }
    async removeMember (payload){
        return await this.postData(`${baseUrlApi}/remove-member`,payload, )
    }

    async getInvitation (payload){
        return await this.getData(`${baseUrlApi}/invitation?${qs.stringify(payload)}`)
    }
    async forgotPassword (payload){
        return await this.postData(`${baseUrlApi}/forgot-password`,payload)
    }

    async resetPassword (payload){
        return await this.postData(`${baseUrlApi}/reset-password`,payload)
    }
    async changePassword (payload){
        return await this.postData(`${baseUrlApi}/change-password`,payload)
    }
    async prices (){
        return await this.getData(`${baseUrlApi}/prices`)
    }

    async getSingleIdea (id){
        return await this.getData(`${baseUrlApi}/v1/feature-idea/${id}`)
    }
    async dashboardData (payload){
        return await this.postData(`${baseUrlApi}/dashboard`,payload)
    }
    async payment (payload){
        return await this.postData(`${baseUrlApi}/payment`,payload)
    }
    async cancelPlan (){
        return await this.getData(`${baseUrlApi}/cancel`,)
    }
    async paymentStatus (payload){
        return await this.postData(`${baseUrlApi}/payment-status`,payload)
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
    async resubscribe (payload){
        return await this.postData(`${baseUrlApi}/resubscribe`,payload)
    }
    async roadmapStatusRank (payload){
        return await this.postData(`${baseUrlApi}/roadmap-status/rank`,payload)
    }
}
