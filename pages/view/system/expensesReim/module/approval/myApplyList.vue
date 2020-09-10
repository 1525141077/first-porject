<template>
  <div id="mainDiv" :style="publicHeight">
    <!-- :style="publicHeight" -->
    <el-container>
      <!-- 页面头部 -->
      <el-header class="yt-header">
        <el-form
          ref="form"
          :model="form"
          label-width="150px"
          :label-position="labelPosition"
          size="small"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="申请事由/单据编号：">
                <el-input v-model="form.name" class placeholder="请输入申请事由/单据编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请类别：">
                <el-select v-model="form.region" placeholder="请选择" clearable>
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请日期：">
                <el-date-picker
                  v-model="form.startData"
                  type="daterange"
                  range-separator="到"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="申请金额："
                :rules="[
						{ type: 'number', message: '金额必须为数字值'}
						]"
              >
                <el-input
                  placeholder="请输入"
                  style="width: 100px"
                  v-model.number="form.startMoney"
                  clearable
                ></el-input>-
                <el-input
                  placeholder="请输入"
                  style="width: 100px"
                  v-model.number="form.endMoney"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" style="text-align: right;">
              <el-button type="primary">查询</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <div
        style="height: 5px;background-color: #f3f3f3;border-top: 1px solid #dfe6f3;border-bottom: 1px solid #dfe6f3;"
      ></div>
      <!-- 页面主体 -->
      <el-main class="yt-main">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="handleTime" label="申请日期" width="150"></el-table-column>
          <el-table-column prop="appNum" label="单据编号" width="150"></el-table-column>
          <el-table-column prop="appName" label="申请事由"></el-table-column>
		  <el-table-column prop="formTypeName" label="申请类别" width="100"></el-table-column>
          <el-table-column prop="totalAmount" label="申请金额(元)" width="100"></el-table-column>
          <el-table-column prop="nodeNowState" label="当前状态"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<!--引用公用css文件-->
<style type="text/javascript" src="../../../../../../assets/css/common/yt-common.css"></style>
<!--引用个人css文件-->
<style type="text/javascript" src="../../../../../../assets/css/system/expensesReim/module/approve/myApplyList.css"></style>
<!--引用个人js文件-->
<script type="text/javascript" src="../../../../../../assets/js/system/expensesReim/module/approve/myApplyList.js"></script>