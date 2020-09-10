<template>
  <div class="pass-word">
    <el-dialog
      title="修改密码"
      :visible.sync="dialogState"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      :before-close="canelBtn">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码：" prop="oldPass">
          <el-input :type="passw1" v-model="ruleForm.oldPass" autocomplete="off">
            <i slot="suffix" :class="icon1" @mouseover="showIn(1)" @mouseleave="showIn(1)"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPass">
          <el-input :type="passw2" v-model="ruleForm.newPass" autocomplete="off">
            <i slot="suffix" :class="icon2" @mouseover="showIn(2)" @mouseleave="showIn(2)"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input :type="passw3" v-model="ruleForm.checkPass" autocomplete="off">
            <i slot="suffix" :class="icon3" @mouseover="showIn(3)" @mouseleave="showIn(3)"></i>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canelBtn">取 消</el-button>
        <el-button type="primary" @click="sureBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '../../service/http'
import { option } from '../../static/config'
export default {
  // props: {
  //   pkId: ''
  // },
  data () {
    // 原密码
    let validateOldPass = (rule, value, callback) => {
      if (!value) {
        callback('请输入旧密码')
      } else {
        callback()
      }
    }
    // 新密码
    let validateNewPass = (rule, value, callback) => {
      let nameTest = /[^\w\.\/]/ig
      if (!value) {
        callback('请输入新密码')
      } else if (value === this.ruleForm.oldPass) {
        callback('新密码不能与旧密码一致')
      } else {
        if (nameTest.test(value)) {
          callback('密码中禁止输入汉字')
        } else {
          callback()
          this.$refs.ruleForm.validateField('checkPass')
        }
      }
    }
    // 确认密码
    let validateCkeckPass = (rule, value, callback) => {
       if (!value) {
        callback('请确认新密码')
      } else if (value !== this.ruleForm.newPass) {
        callback('两次输入不一致')
      } else {
        callback()
      }
    }
    return {
      passw1: 'password',
      icon1: 'el-input__icon el-icon-view',
      passw2: 'password',
      icon2: 'el-input__icon el-icon-view',
      passw3: 'password',
      icon3: 'el-input__icon el-icon-view',
      // 是否显示弹窗
      dialogState: false,
      userinfo: {},
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          { required: true,validator: validateOldPass, trigger: 'blur' }
        ],
        newPass: [
          { required: true,validator: validateNewPass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true,validator: validateCkeckPass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.dialogState = this.$route.query.dialogState
    this.getUserInfo()
  },
  methods: {
    // 移入
    showIn (type) {
      let name = 'passw' + type
      // let icon = 'icon' + type
    　//点击图标是密码隐藏或显示
      if( this[name] == "text"){
          this[name] = "password"
          //更换图标
          // this[icon] = "el-input__icon el-icon-view";
      }else {
          this[name] = "text"
          // this[icon] = "el-input__icon el-icon-loading";
      }
    },
    getUserInfo () {
      axios.post(option.base_path + 'index/getCurrentUserInfo').then(res => {
        this.userinfo = res.data.data
      })
    },
    // 取消
    canelBtn() {
      this.dialogState = false
      // this.ruleForm.oldPass = ''
      // this.ruleForm.newPass = ''
      // this.ruleForm.checkPass = ''
      this.$refs.ruleForm.resetFields()
      this.$router.go(-1)
    },
    // 确认
    sureBtn () {
      debugger
      let passMap = {
        userCode: this.userinfo.userName,
        passwordOld: this.ruleForm.oldPass,
        passwordNew: this.ruleForm.newPass
      }
      this.$refs.ruleForm.validate(n => {
        if (n) {
          axios
            .post(option.base_path + "db/user/updatePassword", passMap)
            .then(res => {
              if(res.data.flag === 0) {
                let msg = JSON.parse(res.data.message)
                if (msg.success === 0) {
                  this.$message.success('密码修改成功')
                  this.canelBtn()
                  window.location.href=option.logoutUrl
                } else {
                  this.$message.error(msg.msg)
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      })
    }
  }
}
</script>

<style>
</style>
