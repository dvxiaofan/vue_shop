<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="ordersList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="90px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.order_pay === '0'"
              type="danger"
              plain
              size="mini"
              >未付款</el-button
            >
            <el-button v-else type="success" plain size="mini"
              >已付款</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="90px"
        ></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="150px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editOrderById(scope.row.order_id)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-s-flag"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单数据
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }

      console.log('order: ', res.data)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // 编辑订单
    editOrderById(orderId) {
      console.log('edit order')
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    }
  }
}
</script>

<style lang="scss" scoped></style>
