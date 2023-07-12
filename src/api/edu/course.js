import request from '@/utils/request'

export default {

    //添加课程信息
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            data: courseInfo//data表示把对象转换成Json进行传递到接口里面去
        })
    },

    //查询所有的讲师
    getListTeacher() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
        })
    },

    //根据id查询课程信息
    getCourseInfoById(id) {
        return request({
            url: `/eduservice/course/getCourseInfo/${id}`,
            method: 'get'
        })
    },

    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            data: courseInfo//data表示把对象转换成Json进行传递到接口里面去
        })
    },

    //根据课程id查询课程确认信息
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    //课程最终发布
    publishCourse(courseId) {
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'put'
        })
    },

    //分页条件查询课程信息
    getPageList(page, limit, courseQuery) {
        return request({
            url: `/eduservice/course/${page}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },

    //根据课程id删除课程所有信息
    removeById(id) {
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete'
        })
    }

}