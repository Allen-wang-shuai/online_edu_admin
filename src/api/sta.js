import request from '@/utils/request'

export default {

    //生成统计数据
    createStatistics(day) {
        return request({
            url: `/staservice/sta/${day}`,
            method: 'post'
        })
    },

    //获取统计数据
    showChart(searchObj) {
        return request({
            url: `/staservice/sta/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
            method: 'get'
        })
    }

}