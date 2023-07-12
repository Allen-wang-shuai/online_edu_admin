<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <!-- 课程章节信息 -->
    <el-button type="success" @click="openChapterDialog()">添加章节</el-button>
    <hr />

    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style type="text" @click="openEditChapter(chapter.id)">修改</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">修改</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 课程章节信息 -->

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="chapterExe">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :title="videoTitle">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";

export default {
  data() {
    return {
      saveBtnDisabled: false, //下一步按钮是否禁用
      chapterVideoList: [],
      courseId: "", //课程id
      dialogChapterFormVisible: false, //添加课程弹框是否显示
      dialogVideoFormVisible: false, //添加课时弹框是否显示
      chapter: {
        title: "",
        courseId: "",
        sort: 0
      }, //封装章节数据
      chapterExe: "", //章节操作标题
      video: {
        // 课时对象
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: "",
        chapterId: "",
        courseId: ""
      },
      videoTitle: "", //课时操作标题
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },

  created() {
    //获取到路径中的课程id值
    if (this.$route.params && this.$route.params.id) {
      //从路径中获取id值
      this.courseId = this.$route.params.id;
      //根据课程id查询章节信息
      this.getChapterVideo();
    }
  },

  methods: {
    //==================================================小节操作=========================================//
    //添加或者修改课时
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo();
      } else {
        this.updateVideo();
      }
    },

    //添加课时
    addVideo() {
      //向video中添加课程id
      this.video.courseId = this.courseId;

      video.addVideo(this.video).then(response => {
        //1、关闭弹框
        this.dialogVideoFormVisible = false;
        //2、提示信息
        this.$message({
          type: "success",
          message: "添加课时信息成功!"
        });
        //3、刷新页面
        this.getChapterVideo();
      });
    },

    //修改课时
    updateVideo() {
      video.updateVideo(this.video).then(response => {
        //1、关闭弹框
        this.dialogVideoFormVisible = false;
        //2、提示信息
        this.$message({
          type: "success",
          message: "修改课时信息成功!"
        });
        //3、刷新页面
        this.getChapterVideo();
      });
    },

    //删除课时
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除课时记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确定执行
        video.deleteVideo(videoId).then(response => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!"
          });

          //3、刷新页面
          this.getChapterVideo();
        });
      });
    },

    //打开添加课时对话框
    openVideo(chapterId) {
      //1、清空数据
      this.video = {};
      this.fileList = [];
      //2、打开弹框
      this.dialogVideoFormVisible = true;
      //3、设置操作名称
      this.videoTitle = "添加课时";
      //设置chapterId
      this.video.chapterId = chapterId;
    },

    //打开修改课时对话框
    openEditVideo(videoId) {
      //1、设置操作名称
      this.videoTitle = "修改课时";
      //2、数据回显
      video.getVideoInfo(videoId).then(response => {
        this.video = response.data.video;
        //看情况显示视频列表
        if (this.video.videoOriginalName!=null&&this.video.videoOriginalName!="") {
          //文件列表
          this.fileList = [{ name: this.video.videoOriginalName }]; //这里注意name不要带引号
        }else{
          this.fileList = []
        }
      });
      //3、打开对话框
      this.dialogVideoFormVisible = true;
    },

    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      //设置视频名字和视频id
      this.video.videoSourceId = response.data.videoId;
      this.video.videoOriginalName = file.name;
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    //调用删除方法之前给一个提示
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    //删除视频
    handleVodRemove() {
      video.deleteAliyunVod(this.video.videoSourceId).then(response => {
        //把数据清空
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
        this.fileList = [];

        this.$message({
          type: "success",
          message: response.message
        });
      });
    },

    //==================================================小节操作=========================================//

    //==================================================章节操作=========================================//

    //1、添加或者修改章节
    saveOrUpdate() {
      if (!this.chapter.id) {
        //chapter对象中没有id表示添加章节
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },

    //2、添加章节
    addChapter() {
      //设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId;

      chapter.addChapter(this.chapter).then(response => {
        //1、关闭弹框
        this.dialogChapterFormVisible = false;
        //2、提示信息
        this.$message({
          type: "success",
          message: "添加章节信息成功!"
        });
        //3、刷新页面
        this.getChapterVideo();
      });
    },

    //3、修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter).then(response => {
        //1、关闭弹框
        this.dialogChapterFormVisible = false;
        //2、提示信息
        this.$message({
          type: "success",
          message: "修改章节信息成功!"
        });
        //3、刷新页面
        this.getChapterVideo();
      });
    },

    //4、删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除章节记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确定执行
        chapter.deleteChapter(chapterId).then(response => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除成功!"
          });

          //3、刷新页面
          this.getChapterVideo();
        });
      });
    },

    //5、打开修改章节对话框
    openEditChapter(chapterId) {
      //0、设置操作名称
      this.chapterExe = "修改章节";

      //1、数据回显
      chapter.getChapterInfo(chapterId).then(response => {
        this.chapter = response.data.chapter;
      });
      //2、打开对话框
      this.dialogChapterFormVisible = true;
    },

    //6、打开添加章节对话框
    openChapterDialog() {
      //0、设置操作名称
      this.chapterExe = "添加章节";
      //1、打开会话框
      this.dialogChapterFormVisible = true;
      //2、清空数据
      this.chapter = {};
    },

    //7、根据课程id查询章节信息
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then(response => {
        this.chapterVideoList = response.data.allChapterVideo;
      });
    },
    //==================================================章节操作=========================================//

    //跳转到上一步
    previous() {
      this.$router.push({ path: "/edu/course/info/" + this.courseId });
    },

    //跳转到第三步
    next() {
      this.$router.push({ path: "/edu/course/publish/" + this.courseId });
    }
  }
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>