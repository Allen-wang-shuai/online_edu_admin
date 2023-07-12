import request from '@/utils/request'

export default {

    //添加小节
    addVideo(video) {
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },

    //根据小节id查询小节
    getVideoInfo(videoId) {
        return request({
            url: `/eduservice/video/getVideoInfo/${videoId}`,
            method: 'get'
        })
    },

    //修改章节
    updateVideo(video) {
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    },

    //删除小节
    deleteVideo(videoId) {
        return request({
            url: `/eduservice/video/${videoId}`,
            method: 'delete'
        })
    },

    //删除视频
    deleteAliyunVod(videoId) {
        return request({
            url: `/eduvod/video/${videoId}`,
            method: 'delete'
        })
    }

}