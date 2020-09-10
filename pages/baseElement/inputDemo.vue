<template>
  <div class="dome-container">
    <div class="method-text">【input文本输入框】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">表单中重要成员之一，用来获取用户信息的元素.</span>
      </p>
    </div>
    <p>2.使用说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <table class="yt-table" style="width:100%;">
        <thead class="yt-thead the-inner">
          <tr>
            <th width="">参数</th>
            <th width="">描述</th>
            <th width="">类型</th>
            <th width="">可选值</th>
            <th width="">默认值</th>
          </tr>
        </thead>
        <tbody class="yt-tbody">
          <tr>
            <td>
              <div>type</div>
            </td>
            <td>
              <div>类型</div>
            </td>
            <td>
              <div>string</div>
            </td>
            <td>
              <div>text，textarea 和其他 原生 input 的 type 值</div>
            </td>
            <td>
              <div>text</div>
            </td>
          </tr>
          <tr>
            <td>
              <div>v-model</div>
            </td>
            <td>
              <div>绑定值</div>
            </td>
            <td>
              <div>string / number</div>
            </td>
            <td>
              <div>—</div>
            </td>
            <td>
              <div>—</div>
            </td>
          </tr>
          <tr>
            <td>
              <div>placeholder</div>
            </td>
            <td>
              <div>输入框占位文本</div>
            </td>
            <td>
              <div>string</div>
            </td>
            <td>
              <div>—</div>
            </td>
            <td>
              <div>—</div>
            </td>
          </tr>
          <tr>
            <td>
              <div>clearable</div>
            </td>
            <td>
              <div>是否可清空</div>
            </td>
            <td>
              <div>boolean</div>
            </td>
            <td>
              <div>—</div>
            </td>
            <td>
              <div>false</div>
            </td>
          </tr>
          <tr>
            <td>
              <div>disabled</div>
            </td>
            <td>
              <div>禁用</div>
            </td>
            <td>
              <div>boolean</div>
            </td>
            <td>
              <div>—</div>
            </td>
            <td>
              <div>false</div>
            </td>
          </tr>
          <tr>
            <td>
              <div>size</div>
            </td>
            <td>
              <div>输入框尺寸，只在 type!="textarea" 时有效</div>
            </td>
            <td>
              <div>string</div>
            </td>
            <td>
              <div>medium / small / mini</div>
            </td>
            <td>
              <div>—</div>
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.基础代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showFileContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 0px 10px;">

      <!-- 基础用法 -->
      <el-input v-model="input" placeholder="请输入内容"></el-input>

      <!-- 禁用 通过 disabled 属性指定是否禁用 input 组件 -->
      <el-input
        placeholder="请输入内容"
        v-model="input"
        :disabled="true">
      </el-input>

      <!-- 可清空 使用clearable属性即可得到一个可清空的输入框 -->
      <el-input
        placeholder="请输入内容"
        v-model="input"
        clearable>
      </el-input>

      <!-- 密码框 使用show-password属性即可得到一个可切换显示隐藏的密码框 -->
      <el-input placeholder="请输入密码" v-model="input" show-password></el-input>

      <!-- 文本域 通过将 type 属性的值指定为 textarea 文本域高度可通过 rows 属性控制 -->
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>

    </div>
  </div>
</template>

<script>
export default {
  // 数据源
  data() {
    return {
      input: '',
      textarea: '',
      showFileContent: `
        <!-- 基础用法 -->
        <el-input v-model="input" placeholder="请输入内容"></el-input>

        <!-- 禁用 通过 disabled 属性指定是否禁用 input 组件 -->
        <el-input
          placeholder="请输入内容"
          v-model="input"
          :disabled="true">
        </el-input>

        <!-- 可清空 使用clearable属性即可得到一个可清空的输入框 -->
        <el-input
          placeholder="请输入内容"
          v-model="input"
          clearable>
        </el-input>

        <!-- 密码框 使用show-password属性即可得到一个可切换显示隐藏的密码框 -->
        <el-input placeholder="请输入密码" v-model="input" show-password></el-input>

        <!-- 文本域 通过将 type 属性的值指定为 textarea 文本域高度可通过 rows 属性控制 -->
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
        `
    };
  },
  // 初始化执行
  mounted() {},
  // 方法声明
  methods: {},
  // 组件注册
  components: {}
};
</script>

<style lang="stylus" scoped></style>
