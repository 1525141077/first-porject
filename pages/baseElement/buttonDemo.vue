<template>
  <div class="dome-container">
    <div class="method-text">【基础用法】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">表单中重要成员之一，用来触发用户点击的事件.</span>
      </p>
    </div>
    <p>2.使用说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <table class="yt-table">
        <thead class="yt-thead the-inner">
          <tr>
            <th width="200px">type类型</th>
            <th width="580px">描述</th>
          </tr>
        </thead>
        <tbody class="yt-tbody">
          <tr>
            <td>
              <div>primary</div>
            </td>
            <td>
              <div>主要按钮</div>
            </td>
          </tr>
          <tr>
            <td>success</td>
            <td>成功按钮</td>
          </tr>
          <tr>
            <td>info</td>
            <td>信息按钮</td>
          </tr>
          <tr>
            <td>warning</td>
            <td>警告按钮</td>
          </tr>
          <tr>
            <td>danger</td>
            <td>危险按钮</td>
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
      <el-row>
        <el-button>默认按钮</el-button>
        <el-button type="primary">主要按钮</el-button>
        <el-button type="success">成功按钮</el-button>
        <el-button type="info">信息按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
      </el-row>

      <el-row>
        <el-button plain>朴素按钮</el-button>
        <el-button type="primary" plain>主要按钮</el-button>
        <el-button type="success" plain>成功按钮</el-button>
        <el-button type="info" plain>信息按钮</el-button>
        <el-button type="warning" plain>警告按钮</el-button>
        <el-button type="danger" plain>危险按钮</el-button>
      </el-row>

      <el-row>
        <el-button round>圆角按钮</el-button>
        <el-button type="primary" round>主要按钮</el-button>
        <el-button type="success" round>成功按钮</el-button>
        <el-button type="info" round>信息按钮</el-button>
        <el-button type="warning" round>警告按钮</el-button>
        <el-button type="danger" round>危险按钮</el-button>
      </el-row>

      <el-row>
        <el-button icon="el-icon-search" circle></el-button>
        <el-button type="primary" icon="el-icon-edit" circle></el-button>
        <el-button type="success" icon="el-icon-check" circle></el-button>
        <el-button type="info" icon="el-icon-message" circle></el-button>
        <el-button type="warning" icon="el-icon-star-off" circle></el-button>
        <el-button type="danger" icon="el-icon-delete" circle></el-button>
      </el-row>
    </div>

    <div class="method-text">【禁用状态】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">按钮不可用状态。你可以使用disabled属性来定义按钮是否可用，它接受一个Boolean值。.</span>
      </p>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.禁用状态代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showdDisabledContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 10px 10px;">
      <el-row>
        <el-button disabled>默认按钮</el-button>
        <el-button type="primary" disabled>主要按钮</el-button>
        <el-button type="success" disabled>成功按钮</el-button>
        <el-button type="info" disabled>信息按钮</el-button>
        <el-button type="warning" disabled>警告按钮</el-button>
        <el-button type="danger" disabled>危险按钮</el-button>
      </el-row>

      <el-row>
        <el-button plain disabled>朴素按钮</el-button>
        <el-button type="primary" plain disabled>主要按钮</el-button>
        <el-button type="success" plain disabled>成功按钮</el-button>
        <el-button type="info" plain disabled>信息按钮</el-button>
        <el-button type="warning" plain disabled>警告按钮</el-button>
        <el-button type="danger" plain disabled>危险按钮</el-button>
      </el-row>
    </div>

    <div class="method-text">【文字按钮】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">没有边框和背景色的按钮。.</span>
      </p>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.文字按钮代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showdTextContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 10px 10px;">
      <el-button type="text">文字按钮</el-button>
      <el-button type="text" disabled>文字按钮</el-button>
    </div>

    <div class="method-text">【图标按钮】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span
          style="font-size: 14px;"
        >带图标的按钮可增强辨识度（有文字）或节省空间（无文字）。设置icon属性即可，icon 的列表可以参考 Element 的 icon 组件，也可以设置在文字右边的 icon ，只要使用i标签即可，可以使用自定义图标。.</span>
      </p>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.图标按钮代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showdIconContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 10px 10px;">
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
      <el-button type="primary" icon="el-icon-search">搜索</el-button>
      <el-button type="primary">
        上传
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>

    <div class="method-text">【按钮组按钮】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">以按钮组的方式出现，常用于多项类似操作。 使用el-button-group标签来嵌套你的按钮。.</span>
      </p>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.按钮组代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showdGroupContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 10px 10px;">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
        <el-button type="primary">
          下一页
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </el-button-group>
    </div>

    <div class="method-text">【加载中】</div>
    <p>1.元素说明:</p>
    <div class="label-code-div-first" style="height: auto">
      <p style="font-weight: normal;">
        <span style="font-size: 14px;">点击按钮后进行数据加载操作，在按钮上显示加载状态。要设置为 loading 状态，只要设置loading属性为true即可。.</span>
      </p>
    </div>
    <div class="method-text">代码展示</div>
    <p>1.加载中代码展示:</p>
    <div class="label-code-div-first" style="height: auto" v-highlight>
      <pre>
        <code>
          {{showdLoadingContent}}
        </code>
      </pre>
    </div>
    <p>2.展示效果:</p>
    <div class="base-form-model" style="padding: 10px 0px 10px 10px;">
     <el-button type="primary" :loading="true">加载中</el-button>
    </div>
  </div>
</template>

<script>
export default {
  // 数据源
  data() {
    return {
      showFileContent: `
        <el-row>
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="info">信息按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
        </el-row>

        <el-row>
          <el-button plain>朴素按钮</el-button>
          <el-button type="primary" plain>主要按钮</el-button>
          <el-button type="success" plain>成功按钮</el-button>
          <el-button type="info" plain>信息按钮</el-button>
          <el-button type="warning" plain>警告按钮</el-button>
          <el-button type="danger" plain>危险按钮</el-button>
        </el-row>

        <el-row>
          <el-button round>圆角按钮</el-button>
          <el-button type="primary" round>主要按钮</el-button>
          <el-button type="success" round>成功按钮</el-button>
          <el-button type="info" round>信息按钮</el-button>
          <el-button type="warning" round>警告按钮</el-button>
          <el-button type="danger" round>危险按钮</el-button>
        </el-row>

        <el-row>
          <el-button icon="el-icon-search" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
          <el-button type="info" icon="el-icon-message" circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
        </el-row>
        `,
      showdDisabledContent: `
        <el-row>
          <el-button disabled>默认按钮</el-button>
          <el-button type="primary" disabled>主要按钮</el-button>
          <el-button type="success" disabled>成功按钮</el-button>
          <el-button type="info" disabled>信息按钮</el-button>
          <el-button type="warning" disabled>警告按钮</el-button>
          <el-button type="danger" disabled>危险按钮</el-button>
        </el-row>

        <el-row>
          <el-button plain disabled>朴素按钮</el-button>
          <el-button type="primary" plain disabled>主要按钮</el-button>
          <el-button type="success" plain disabled>成功按钮</el-button>
          <el-button type="info" plain disabled>信息按钮</el-button>
          <el-button type="warning" plain disabled>警告按钮</el-button>
          <el-button type="danger" plain disabled>危险按钮</el-button>
        </el-row>
        `,
      showdTextContent: `
        <el-button type="text">文字按钮</el-button>
        <el-button type="text" disabled>文字按钮</el-button>
        `,
      showdIconContent: `
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        `,
      showdGroupContent: `
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
          <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button type="primary" icon="el-icon-share"></el-button>
          <el-button type="primary" icon="el-icon-delete"></el-button>
        </el-button-group>
        `,
      showdLoadingContent: `
        <el-button type="primary" :loading="true">加载中</el-button>
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
