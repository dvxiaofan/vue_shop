<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- echarts 视图容器 -->
      <div id="main" style="width: 800px; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
// 处理数据合并
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 组件显示完毕初始化图表
    const myChart = echarts.init(document.getElementById('main'))

    const { data: res } = await this.$http.get('reports/type/1')

    if (res.meta.status !== 200) {
      return this.$message.error('获取统计数据失败')
    }

    // echarts 配置  数据合并处理
    const result = _.merge(res.data, this.options)

    console.log('result: ', result)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="scss" scoped></style>
