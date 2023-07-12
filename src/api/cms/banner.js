import request from '@/utils/request'

export default {

    //获取banner分页列表
    getBannerPage(page,limit){
        return request({
            url: `/cmsservice/banneradmin/${page}/${limit}`,
            method: 'get'
        })
    },

    //添加banner
    addBanner(banner){
        return request({
            url: `/cmsservice/banneradmin/save`,
            method: 'post',
            data: banner
        })
    },

    //根据id获取banner
    getBannerById(id){
        return request({
            url: `/cmsservice/banneradmin/${id}`,
            method: 'get'
        })
    },

    //修改banner
    updateBanner(banner){
        return request({
            url: `/cmsservice/banneradmin/update`,
            method: 'put',
            data: banner
        })
    },

    //删除banner
    deleteBanner(id){
        return request({
            url: `/cmsservice/banneradmin/remove/${id}`,
            method: 'delete'
        })
    }

}