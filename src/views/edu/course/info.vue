<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="课程一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="课程二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 所属分类 -->

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" class="avatar" />
        </el-upload>
      </el-form-item>
      <!-- 课程封面-->

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce"; //富文本编辑器组件

//定义一个常量，常量值不能改变
const defaultForm = {
  title: "",
  subjectId: "", //二级分类ID
  subjectParentId: "", //一级分类ID
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "/static/logo.png",
  price: 0
};

export default {
  components: { Tinymce }, //声明第三方富文本编辑器组件组件

  data() {
    return {
      saveBtnDisabled: false, //下一步按钮是否禁用
      courseInfo: defaultForm,
      teacherList: [], //封装讲师数据
      subjectOneList: [], //课程一级分类
      subjectTwoList: [], //课程二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: ""
    };
  },

  //监听
  watch: {
    $route(to, from) {
      //路由变化方式，监听到之后会执行里面的方法
      this.init();
    }
  },

  created() {
    this.init();
  },

  methods: {
    //0、初始化方法
    init() {
      //判断路由中是否有id值，有的话是修改没有的话是添加
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        //调用根据id查询课程信息，通过双向绑定机制实现数据回显
        this.getInfo();
      } else {
        //初始化讲师数据
        this.getListTeacher();
        //初始化一级分类数据
        this.getOneSubject();

        //清空表单信息
        this.courseInfo = { cover: "/static/logo.png" };
      }
    },

    //1、跳转到第二步，这里要做一下判断，到底是保存还是修改
    saveOrUpdate() {
      if(!this.courseInfo.id){
        this.addCourse()
      }else{
        this.updateCourse()
      }
    },

    //2、查询所有讲师
    getListTeacher() {
      course.getListTeacher().then(response => {
        this.teacherList = response.data.teachers;
      });
    },

    //3、获得课程分类一级Id
    getOneSubject() {
      subject.getSubjectList().then(response => {
        this.subjectOneList = response.data.list;
      });
    },

    //4、获得一级分类下的二级分类，我们用的框架只需要加一个value就可以将一级分类的id值传过来，
    //change事件中只需要写该方法名字即可，框架会帮我们封装
    subjectLevelOneChanged(value) {
      //value是一级分类的id值
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children;
          //把二级分类id值清空保证切换一级分类时二级分类清空
          this.courseInfo.subjectId = "";
        }
      }
    },

    //5、上传封面之前、
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //6、上传封面成功
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },

    //7、根据课程id查询课程信息用户数据的回显
    getInfo() {
      course.getCourseInfoById(this.courseId).then(response => {
        //在courseInfo中包含课程信息，里面有课程一级分类id和课程二级分类id
        this.courseInfo = response.data.courseInfo;

        //初始化课程一级和二级分类列表，是课程分类能够实现回显
        subject.getSubjectList().then(response => {
          this.subjectOneList = response.data.list;
          for (let i = 0; i < this.subjectOneList.length; i++) {
            //比较subjectOneList里面一级分类课程的id和当前courseInfo中的一级分类id是否一样
            //一样的话将subjectOneList里面一级分类课程下的二级分类集合赋值给subjectTwoList
            if (this.subjectOneList[i].id === this.courseInfo.subjectParentId) {
              this.subjectTwoList = this.subjectOneList[i].children;
            }
          }
        });

        //初始化讲师列表
        this.getListTeacher();
      });
    },

    //8、添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "添加课程信息成功!"
        });
        //跳转到第二步
        this.$router.push({
          path: "/edu/course/chapter/" + response.data.courseId
        });
      });
    },

    //9、修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改课程信息成功!"
        });
        //跳转到第二步
        this.$router.push({
          path: "/edu/course/chapter/" + this.courseId //注意这里修改方法不会返回课程id
        });
      });
    }

  }
};
</script>

<style>
.avatar {
  width: 250px;
  height: 155px;
}

.tinymce-container {
  line-height: 29px;
}
</style>