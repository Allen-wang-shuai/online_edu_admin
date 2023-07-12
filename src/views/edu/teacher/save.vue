<template>
  <div class="app-container">
    <h2>添加讲师</h2>
    <hr />

    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>

      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right" />
      </el-form-item>

      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调
        field="file"类似html中<input type="file" name="file" >
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <!-- 讲师头像 -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

//上传相关组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
//讲师操作方法组件
import teacherApi from "@/api/edu/teacher";

export default {

  //声明上传组件
  components: { ImageCropper, PanThumb },

  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: ""
      },
      BASE_API:process.env.BASE_API, //获取dev.env.js里面的地址值
      imagecropperKey:0,             //上传组件key的值  
      imagecropperShow:false,        //上传弹框组件是否显示
      saveBtnDisabled: false         //保存按钮是否禁用
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

    //关闭上传组件
    close(){
      this.imagecropperShow = false
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },

    //上传成功之后的方法，该组件进行了封装data就代表了response的过程
    cropSuccess(data){
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1
    },

    //初始化页面信息
    init() {
      //判断路径中是否有id值
      if (this.$route.params && this.$route.params.id) {
        //从路径中获取id值
        const id = this.$route.params.id;
        //调用根据id查询的方法
        this.getInfo(id);
      } else {
        //没有id值的话清空对象值
        this.teacher = {};
      }
    },

    //根据讲师id查询的方法
    getInfo(id) {
      teacherApi.getTeacherInfo(id).then(response => {
        this.teacher = response.data.teacher;
      });
    },

    //添加或者更新讲师
    saveOrUpdate() {
      //此方法调用后要禁用保存按钮以避免重复保存
      this.saveBtnDisabled = true;

      //判断是修改还是添加
      if (!this.teacher.id) {
        //添加讲师
        this.saveTeacher();
      } else {
        //修改讲师
        this.updateTeacher();
      }
    },

    //添加讲师方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "添加成功!"
        });

        //回到列表页面，路由跳转
        this.$router.push({ path: "/edu/teacher/list" });
      });
    },

    //修改讲师
    updateTeacher() {
      teacherApi.updateTeacherInfo(this.teacher).then(response => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改成功!"
        });

        //回到列表页面，路由跳转
        this.$router.push({ path: "/edu/teacher/list" });
      });
    }
  }
};
</script>

<style>
</style>