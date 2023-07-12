import request from '@/utils/request'

export default {

    //课程分类列表查询
    getSubjectList(){
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
        })
    }

}
