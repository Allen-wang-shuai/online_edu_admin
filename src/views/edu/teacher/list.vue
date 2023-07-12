<template>
  <div class="app-container">
    <h2>讲师列表</h2>
    <hr />

    <!-- 在js中对象的属性可以不写，比如teacehrQuery.name，其teacehrQuery对象中并没有name属性，
    但是我们这样写没有错，并且会自动给我们在teacehrQuery对象中加上name属性-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacehrQuery.name" placeholder="讲师名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacehrQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacehrQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="teacehrQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 这里一定注意@click后的方法()一定不能省略因为getList()方法有参数 -->

    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{ scope.row.level===1?'高级讲师':'首席讲师' }}</template>
      </el-table-column>

      <el-table-column prop="career" label="资历" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/save/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- scope.row.id，scope为当前表格范围，row为表格中的一行数据对应list中的一个记录 -->

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
    <!-- @current-change="getList"表示切换页码时调用哪个函数，@在这里表示v-on即事件绑定，@为v-on的简写
    getList这里不能加括号因为elmentui框架帮我们封装了，调用函数时会自动加选择的page数作为参数来实现分页 -->


  </div>
</template>

<script>
//引入调用teacher.js文件
import teacher from "@/api/edu/teacher";

// export default表示可以被其他调用
export default {
  //写核心代码的位置
  // data:{

  // },
  //data的第二种写法，常用
  data() {
    //定义变量和初始值

    return {
      list: null, //查询后接口返回的集合
      page: 1, //当前页默认为1
      total: 0, //总记录数
      limit: 10, //每页记录数
      teacehrQuery: {} //条件封装对象
    };
  },

  created() {
    //create是一个方法，在页面渲染之前执行，一般就是调用methods定义的方法

    //采用this调用定义的方法除了分页一定要加()避免出错
    this.getList();
  },

  methods: {
    //创建具体的方法，调用teacher.js定义的方法

    //获得讲师列表的方法，page为方法参数不传参数默认为1
    getList(page = 1) {
      this.page = page;  //这句代码用来实现分页
      teacher
        .getTeacherListPage(this.page, this.limit, this.teacehrQuery)
        .then(response => {
          //response接口返回的数据
          this.list = response.data.rows;
          this.total = response.data.total;
          // console.log(response)
        }) //请求成功
    },

    //清空
    resetData() {
      //表单输入项数据清空
      this.teacehrQuery = {};
      //查询所有讲师数据
      this.getList();
    },

    //删除讲师
    removeDataById(id) {
      
      this.$confirm("此操作将永久删除讲师记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确定执行
          teacher
            .deleteTeacherId(id)
            .then(response => { //删除成功
              
              //提示信息
              this.$message({
                type: "success",
                message: "删除成功!"
              });

              //回到删除时列表页面
              this.getList(this.page);
            })

        })
        // .catch(() => {
        //   //点击取消执行
        //   this.$message({
        //     type: "info",
        //     message: "已取消删除"
        //   });
        // });框架有统一的catch处理这里不用要就行
    }



  }
};
</script>

<style>
</style>