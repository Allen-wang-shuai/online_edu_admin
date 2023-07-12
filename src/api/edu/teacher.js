import request from '@/utils/request'

export default {

    //1 讲师列表（条件查询分页）
    //current当前页，limit每页记录数，teacherQuery条件对象
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            //路径参数的两种写法，建议用第二种
            //url: '/eduservice/teacher/pageTeacherCondition/'+current+"/"+limit,
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQuery条件对象，后端使用RequestBody获取数据
            data: teacherQuery//data表示把对象转换成Json进行传递到接口里面去
        })
    },

    //删除讲师
    deleteTeacherId(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },

    //添加讲师
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },

    //根据id查询讲师信息
    getTeacherInfo(id) {
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },

    //修改讲师
    updateTeacherInfo(teacher) {
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    },

    //获取所有讲师
    getList() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
        })
    }

}
