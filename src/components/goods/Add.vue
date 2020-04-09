<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示注意 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 表单item -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, index) in item.attr_vals"
                  :key="index"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 表单item -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action: 图片上传的地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
      @close="dialogClosed"
    >
      <img class="prew-img" :src="previewPath" alt="preview" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 当前步骤索引
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [1402, 1410, 1423],
        // 图片数组
        pics: [],
        // 商品描述
        goods_introduce: '',
        attrs: []
      },
      fileList: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }

      this.cateList = res.data
    },
    // 级联选择框选择事件
    handleChange() {
      console.log(this.addForm.goods_cat)
    },
    // tab页切换
    beforeTabLeave(activeName, oldActiveName) {
      if (
        (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) ||
        !this.addForm.goods_name
      ) {
        this.$message.error('请先完成基本信息录入')
        return false
      }

      // 这种形式有提示但依然跳转
      // this.$refs.addFormRef.validate(valid => {
      //   if (!valid) {
      //     this.$message.error('请先完成基本信息录入')
      //     return false
      //   }
      // })
    },
    async tabClick() {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品属性失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 上传图片成功
    handleSuccess(res) {
      // 拼接图片对象
      const picInfo = { pic: res.data.tmp_path }
      // 保存到数组
      this.addForm.pics.push(picInfo)
    },
    // 图片删除
    handleRemove(file) {
      // 将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 获取索引
      const picIndex = this.addForm.pics.findIndex(x => x.pic === filePath)

      // 删除
      this.addForm.pics.splice(picIndex, 1)
    },
    // 图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 关闭弹出框时清除URL
    dialogClosed() {
      this.previewPath = ''
    },
    // 添加商品按钮事件
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        this.addForm.attrs = []
        // 执行添加操作
        // lodash cloneDeep(obj)
        const formData = _.cloneDeep(this.addForm)
        formData.goods_cat = formData.goods_cat.join(',')

        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        formData.attrs = this.addForm.attrs

        // console.log('formData: ', formData)
        const { data: res } = await this.$http.post('goods', formData)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }

        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 动态计算参数ID
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 8px 0 !important;
}
.prew-img {
  width: 100%;
}
.btnAdd {
  margin: 15px 0;
}
</style>
