<template>
  <!--element-ui左侧菜单控件-->
  <el-menu
    class="el-menu-vertical-demo menu-style"
    :style="conheight"
    background-color="#3f5363"
    text-color="#fff"
    active-text-color="#6495ED"
    :unique-opened="true"
    :default-openeds="defaultOpeneds"
    :default-active="activeRouter"
  >
    <!--unique-opened属性如果直接等于字符换"true"会报错，加上：就好了-->
    <!--default-active="2" 默认选中哪一个 数字为el-submenu的唯一标识index-->
    <!--可下拉操作式菜单（1级）-->
    <el-submenu v-for="(n, i) in vData" :index="n.id" :key="n.id" v-if="n.children">
      <!--菜单文字/图标-->
      <template slot="title">
        <!-- <i class="el-icon-menu"></i> -->
        <img :src="n.logoUrl" alt srcset style="width:18px;height:18px;" v-if="n.logoUrl"/>
        <span>{{n.menuName}}</span>
      </template>
      <!--disabled 禁用-->
      <!--<el-menu-item-group title="支出申请">
							<!--<template slot="title">分组一</template>
							<el-menu-item index="1-1">支出申请</el-menu-item>
      </el-menu-item-group>-->
      <!--A 二级菜单，如果判断有下一级 使用submenu可下拉操作式菜单-->
      <el-submenu v-for="(x, y) in n.children" :index="x.id" v-if="x.children" :key="x.id">
        <!--菜单文字/图标-->
        <template slot="title">
          <!-- <i class="el-icon-s-help"></i> -->
          <span>{{x.menuName}}</span>
        </template>
        <!--B 三级菜单，如果判断有下一级 使用submenu可下拉操作式菜单-->
        <el-submenu v-for="(a, d) in x.children" :index="a.id" v-if="a.children" :key="a.id">
          <!--菜单文字/图标-->
          <template slot="title">
            <!-- <i class="el-icon-s-help"></i> -->
            <span>{{a.menuName}}</span>
          </template>
          <!--<el-menu-item index="1-4-1">选项1</el-menu-item>-->
        </el-submenu>
        <!--B 三级菜单，如果判断没有下一级 使用menu-item直接跳转式菜单 @click="toPage(a.menuUrl)"-->
        <el-menu-item v-else :index="'/' + a.menuUrl" :router="a.menuUrl">
          <!--:router="a.menuUrl"-->
          <!--菜单文字/图标-->
          <template slot="title">
            <!-- <i class="el-icon-help"></i> -->
            <nuxt-link class="yt-topage" :to="'/' + a.menuUrl">
              <span>{{a.menuName}}</span>
            </nuxt-link>
          </template>
        </el-menu-item>
      </el-submenu>
      <!--A 二级菜单，如果判断没有下一级 使用menu-item直接跳转式菜单 @click="toPage(x.menuUrl)"-->
      <el-menu-item v-else :index="'/' + x.menuUrl" :router="x.menuUrl">
        <!--菜单文字/图标-->
        <template slot="title">
          <nuxt-link class="yt-topage" :to="'/' + x.menuUrl">
            <!-- <i class="el-icon-help"></i> -->
            <span>{{x.menuName}}</span>
          </nuxt-link>
        </template>
      </el-menu-item>
    </el-submenu>
    <!--A 一级菜单，如果判断没有下一级 使用menu-item直接跳转式菜单 @click="toPage(n.menuUrl)"-->
    <el-menu-item v-else :index="'/' + n.menuUrl" :router="n.menuUrl">
      <!--菜单文字/图标-->
      <template slot="title">
        <nuxt-link class="yt-topage" :to="'/' + n.menuUrl">
          <!-- <i class="el-icon-help"></i> -->
          <img :src="n.logoUrl" alt srcset style="width:18px;height:18px;" />
          <span style="padding-left: 5px;">{{n.menuName}}</span>
        </nuxt-link>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<!--引用个人js文件-->
<script type="text/javascript" src="../assets/js/common/left-menu.js"></script>

<style scoped>
body,
html {
  margin: 0px;
}
.el-menu-vertical-demo .el-menu-item.is-active {
  background-color: #32424f !important;
}
.el-menu-vertical-demo .el-submenu .el-menu-item {
  min-width: 0px !important;
}
</style>