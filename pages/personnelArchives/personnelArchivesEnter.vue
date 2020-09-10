<template>
  <div class="yt-dome-container">
    <!-- 表单区域START -->
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">基本信息</span>
          </el-col>
        </template>
      </topTip>
      <el-row>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">姓名：</span>
            <span>{{ this.formData.realName==""?"--":this.formData.realName}}</span>
          </div>
          <el-form-item label="姓名：" prop="realName" v-else>
            <el-input
              @blur="getWorkNum"
              v-model="ruleForm.realName"
              placeholder="请输入"
              style="width:60%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">工作状态：</span>
            <span>{{ this.formData.workStateName==""?"--":this.formData.workStateName}}</span>
          </div>
          <el-form-item label="工作状态：" prop="workState" v-else>
            <el-select v-model="ruleForm.workState" placeholder="请选择工作状态" @change="onworkState"   style="width:60%">
              <el-option
                v-for="item in workStateList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
               
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">{{formLabel}}</span>
            <span>{{ this.formData.employDate==""?"--":this.formData.employDate}}</span>
          </div>
          <el-form-item :label="formLabel||'入职时间：'" prop="employDate" v-else>
            <el-date-picker
              type="date"
              placeholder="请选择入职时间"
              value-format="yyyy-MM-dd"
              v-model="ruleForm.employDate"
              style="width:60%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">企业邮箱：</span>
            <span>{{ this.formData.enterpriseMailbox==""?"--":this.formData.enterpriseMailbox}}</span>
          </div>
          <el-form-item label="企业邮箱：" prop="enterpriseMailbox" v-else>
            <el-input v-model="ruleForm.enterpriseMailbox" placeholder="请输入" style="width:60%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">座机号码：</span>
            <span>{{ this.formData.landline==""?"--":this.formData.landline}}</span>
          </div>
          <el-form-item label="座机号码：" prop="landline" v-else>
            <el-input
              v-model="ruleForm.landline"
              placeholder="请输入010-0000000"
              @change="land"
             style="width:60%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">工号：</span>
            <span>{{ this.formData.workNum==""?"--":this.formData.workNum}}</span>
          </div>
          <el-form-item label="工号：" prop="workNum" v-else>
            <span class="readTxt">{{ruleForm.workNum==''?'--':ruleForm.workNum}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      
      <!-- <el-row>
        <el-col :span="8">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">部门组织：</span>
            <span>{{ this.formData.deptName ==""?"--":this.formData.deptName }}</span>
          </div>
          <el-form-item label="部门组织：" prop="deptName " v-else>
            <el-select v-model="ruleForm.deptName" @change="onSelect" placeholder="请选择部门组织">
              <el-option
                v-for="item in tissueList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">岗位：</span>
            <span>{{ this.formData.positionName==""?"--":this.formData.positionName}}</span>
          </div>
          <el-form-item label="岗位：" prop v-else>
            <el-select v-model="ruleForm.positionName" @change="onJob" placeholder="请选择岗位">
              <el-option
                v-for="item in positionList"
                :key="item.positionId"
                :label="item.positionName"
                :value="item.positionId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="1"
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <span @click="addUser" class="addgo">+</span>
        </el-col>
      </el-row>-->
      <div v-if="this.$route.query.archivesState=='2'">
        <div
          v-for="item in ruleForm.moreNotifyObject"
          :key="item.positionId"
          style="margin-bottom: 20px;"
        >
          <el-row>
            <el-col :span="8">
              <span class="yt-read-text" style="margin-left:20px">部门组织：</span>
              <span>{{ item.deptName ==""?"--":item.deptName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="yt-read-text" style="margin-left:20px">岗位：</span>
              <span>{{ item.positionName==""?"--":item.positionName}}</span>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- <el-row v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"> -->

      <!-- 动态生成 -->
      <div v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState">
        <div class="moreRulesIn" v-for="(item, index) in ruleForm.moreNotifyObject" :key="item.deptId + index">
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门组织："  :prop="'moreNotifyObject.'+index +'.deptId'"  :rules="{required: true, message: '部门组织不能为空', trigger:  ['blur','change'] }" >
                <el-select
                  v-model="item.deptId"
                  @change="onSelectTwo(item)"
                  placeholder="请选择部门组织"
                    style="width:60%"
                >
                  <el-option
                    v-for="n in tissueList"
                    :key="n.deptId"
                    :label="n.deptName"
                    :value="n.deptId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="岗位：" >
                <el-select
                  v-model="item.positionId"
                  @change="onJobTwo(item, index)"
                  placeholder="请选择岗位"
                    style="width:88%"
                >
                  <el-option
                    v-for="n in item.positionList"
                    :key="n.positionId"
                    :label="n.positionName"
                    :value="n.positionId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
          
              <i class="el-icon-plus addgo"  @click="addUser" v-if="index===0"></i>
              <i class="el-icon-minus addgo jian"  @click="deleteRules(item, index)"  v-if="index!==0"></i>
             
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- </el-row>  -->
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">个人信息</span>
          </el-col>
        </template>
      </topTip>
      <el-row>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">身份证：</span>
            <span>{{ this.formData.idCard==""?"--":this.formData.idCard}}</span>
          </div>
          <el-form-item label="身份证：" prop="idCard" v-else>
            <el-input v-model="ruleForm.idCard" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">性别：</span>
            <span>{{ this.formData.gender==""?"--":this.formData.gender==1?"女":"男"}}</span>
          </div>
          <el-form-item label="性别：" prop="gender" v-else>
            <span  style="width:80%">{{ruleForm.gender==''?'--':ruleForm.gender==1?"女":"男"}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">出生日期：</span>
            <span  style="width:80%">{{ this.formData.birthDate==""?"--":this.formData.birthDate}}</span>
          </div>
          <el-form-item label="出生日期：" prop="birthDate" v-else>
            <span  style="width:80%">{{ruleForm.birthDate==''?'--':ruleForm.birthDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">年龄：</span>
            <span>{{ this.formData.age==""?"--":this.formData.age}}</span>
          </div>
          <el-form-item label="年龄：" prop="age" v-else>
            <span style="width:80%">{{ruleForm.age==''?'--':ruleForm.age}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">联系方式：</span>
            <span>{{ this.formData.cellPhone==""?"--":this.formData.cellPhone}}</span>
          </div>
          <el-form-item label="联系方式：" prop="cellPhone" v-else>
            <el-input v-model="ruleForm.cellPhone" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">民族：</span>
            <span>{{ this.formData.nationName==""?"--":this.formData.nationName}}</span>
          </div>
          <el-form-item label="民族：" prop="nation" v-else>
            <el-select v-model="ruleForm.nation" @change="onNation" placeholder="请选择" style="width:80%">
              <el-option
                v-for="item in nationList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">婚姻状况：</span>
            <span>{{ this.formData.marriageName==""?"--":this.formData.marriageName}}</span>
          </div>
          <el-form-item label="婚姻状况：" prop="marriage" v-else>
            <el-select v-model="ruleForm.marriage" @change="onMarriage" placeholder="请选择" style="width:80%">
              <el-option
                v-for="item in marriageList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">最终学历：</span>
            <span>{{ this.formData.educationName==""?"--":this.formData.educationName}}</span>
          </div>
          <el-form-item label="最终学历：" prop="education" v-else>
            <el-select v-model="ruleForm.education" @change="oneducation" placeholder="请选择" style="width:80%">
              <el-option
                v-for="item in educationList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">政治面貌：</span>
            <span>{{ this.formData.politicalStatusName==""?"--":this.formData.politicalStatusName}}</span>
          </div>
          <el-form-item label="政治面貌：" prop="politicalStatus" v-else>
            <el-select
              v-model="ruleForm.politicalStatus"
              @change="onpoliticalStatus"
              placeholder="请选择"
               style="width: 80%"
            >
              <el-option
                v-for="item in politicalStatusList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">入党时间：</span>
            <span>{{ this.formData.empartyDate==""?"--":this.formData.empartyDate}}</span>
          </div>
          <el-form-item label="入党时间：" prop="empartyDate" v-else >
           
              <el-date-picker
                type="date"
              placeholder="请选择入党时间"
              value-format="yyyy-MM-dd"
            v-model="ruleForm.empartyDate"
             :disabled="ruleForm.politicalStatus==='0'?false:true"
             class="empartyDate"
             style="width:80%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">党关系所在地：</span>
            <span>{{ this.formData.empartyPlace==""?"--":this.formData.empartyPlace}}</span>
          </div>
          <el-form-item label="党关系所在地：" prop="empartyPlace" v-else >
            <el-input v-model="ruleForm.empartyPlace" placeholder="请输入"  class="empartyPlace" style="width:80%"  :disabled="ruleForm.politicalStatus==='0'?false:true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">籍贯：</span>
            <span>{{ this.formData.nativePlaceName==""?"--":this.formData.nativePlaceName}}</span>
          </div>
          <el-form-item label="籍贯：" prop="nativePlace" v-else>
            <el-cascader
              :options="this.options"
              v-model="ruleForm.nativePlace"
              ref="der"
              filterable
              change-on-select
              @change="onNative"
              style="width:80%"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">户口性质：</span>
            <span>{{ this.formData.householdRegistrationNature==""?"--":this.formData.householdRegistrationNature}}</span>
          </div>
          <el-form-item label="户口性质：" prop="householdRegistrationNature" v-else>
            <el-select
              v-model="ruleForm.householdRegistrationNature"
              @change="onregisteredResidence"
              placeholder="请选择"
              style="width:80%"
            >
              <el-option
                v-for="item in registeredResidenceList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">户籍城市：</span>
            <span>{{ this.formData.householdRegistrationCityName==""?"--":this.formData.householdRegistrationCityName}}</span>
          </div>
          <el-form-item label="户籍城市：" prop="householdRegistrationCity" v-else>
            <el-cascader
            ref="cascader"
              :options="this.options"
              v-model="ruleForm.householdRegistrationCity"
              change-on-select
              filterable
              @change="handleChange"
              style="width:80%"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">外语水平：</span>
            <span>{{ this.formData.foreignLanguageLevel==""?"--":this.formData.foreignLanguageLevel}}</span>
          </div>
          <el-form-item label="外语水平：" prop="foreignLanguageLevel" v-else>
            <el-input v-model="ruleForm.foreignLanguageLevel" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">存档单位：</span>
            <span>{{ this.formData.archivesPlaceName==""?"--":this.formData.archivesPlaceName}}</span>
          </div>
          <el-form-item label="存档单位：" prop="archivesPlace" v-else>
            <!-- <el-input v-model="ruleForm.archivesPlace" placeholder="请输入" style="width:80%" v-else></el-input> -->
            <el-select v-model="ruleForm.archivesPlace" @change="onfileLocation" placeholder="请选择" style="width:80%">
              <el-option
                v-for="item in fileLocationList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">参与工作时间：</span>
            <span>{{ this.formData.workHoursDate==""?"--":this.formData.workHoursDate}}</span>
          </div>
          <el-form-item label="参加工作时间：" prop="workHoursDate" v-else>
            <el-date-picker
               align="right"
               type="year"
              @change="workDate"
              placeholder="请选择入职时间"
              value-format="yyyy-MM-dd"
              v-model="ruleForm.workHoursDate"
              class="workHoursDate"
              style="width:80%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">年假天数：</span>
            <span>{{ this.formData.yearDateNumber==""?"--":this.formData.yearDateNumber}}</span>
          </div>
          <el-form-item label="年假天数：" prop="yearDateNumber" v-else>
            <span class="readTxt" style="width:80%">{{ruleForm.yearDateNumber==''?'系统自动计算':ruleForm.yearDateNumber}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">家庭住址：</span>
            <span>{{ this.formData.homeAddress==""?"--":this.formData.homeAddress}}</span>
          </div>
          <el-form-item label="家庭住址：" prop="homeAddress" v-else>
            <el-input v-model="ruleForm.homeAddress" placeholder="请输入" style="width:96%"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18">
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <span class="yt-read-text" style="margin-left:20px">个人特长：</span>
            <span>{{ this.formData.specialSkillListStrName==""?"--":this.formData.specialSkillListStrName}}</span>
          </div>
          <el-form-item label="个人特长：" prop v-else>
            <el-checkbox-group v-model="personalSpecialtys" @change="onability">
              <el-checkbox
                v-for="item in abilityList"
                :key="item.value"
                :label="item.value"
              >{{item.disvalue}}</el-checkbox>
              <el-input v-if="disvaluelast" v-model="context" placeholder="请输入" style="width:20%"></el-input>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <secondLevel>
        <template v-slot:textTitle>附件上传</template>
      </secondLevel>
      <el-row style="margin-left: 3%;">
        <el-col :span="4">
          <div class="wenjian">身份证原件照片正面</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <img :src="fileList" alt style="height: 150px;width: 150px;" /> -->
             <upload
              :fileList="ruleFormTwo.fileList"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <upload
              @upload="uploadPicture"
              @delFile="delFileBtnPicture"
              :fileList="ruleFormTwo.fileList"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="true"
            ></upload>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="wenjian">身份证原件照片背面</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <img :src="fileListTwo" alt style="height: 150px;width: 150px;" /> -->
             <upload
              :fileList="ruleFormTwo.fileListTwo"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <upload
              @upload="uploadTwo"
              @delFile="delFileTwo"
              :fileList="ruleFormTwo.fileListTwo"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="true"
            ></upload>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="wenjian">一寸照片</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <img :src="photograph" alt style="height: 150px;width: 150px;" /> -->
             <upload
              :fileList="ruleFormTwo.photograph"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <upload
              @upload="uploadphotograph"
              @delFile="delphotograph"
              :fileList="ruleFormTwo.photograph"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="true"
            ></upload>
          </div>
        </el-col>
      </el-row>
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">学历教育</span>
          </el-col>
        </template>
      </topTip>
      <el-row
        style="margin-left: 3%;margin-bottom: 20px;"
        v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
      >
        <el-button type="primary" @click="addAcademic">新增</el-button>
      </el-row>
      <el-table :data="academicList" border style="width: 100%;margin-bottom: 20px;">
        <el-table-column prop="startDate" header-align="center" align="center" label="学习时间">
           <template slot-scope="scope">
              <span>{{scope.row.startDate +"—"+scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="school" header-align="center" align="center" label="毕业院校"></el-table-column>
        <el-table-column prop="major" header-align="center" align="center" label="专业">
           <template slot-scope="scope">
              <span>{{scope.row.major||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="education" header-align="center" align="center" label="学历">
           <template slot-scope="scope">
                   <span>{{scope.row.educationName||scope.row.education}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop
          label="操作"
          width="100"
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="academicUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="academicDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <secondLevel>
        <template v-slot:textTitle>附件上传</template>
      </secondLevel>
      <el-row style="margin-left: 3%;">
        <el-col :span="24">
          <div class="wenjian">学历/学位证件照片</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <span class="yt-read-text" style="margin-left:20px">暂无附件</span> -->
            <!-- <img :src="education" alt style="height: 150px;width: 150px;" /> -->
             <upload
              :fileList="ruleFormTwo.education"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <upload
              @upload="uploadeducation"
              @delFile="deleducation"
              :fileList="ruleFormTwo.education"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="false"
            ></upload>
          </div>
        </el-col>
      </el-row>
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">工作经历</span>
          </el-col>
        </template>
      </topTip>
      <el-row
        style="margin-left: 3%;margin-bottom: 20px;"
        v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
      >
        <el-button type="primary" @click="addWork">新增</el-button>
      </el-row>
      <el-table :data="workList" border style="width: 100%;">
        <el-table-column prop="startDate" header-align="center" align="center" label="工作时间">
          <template slot-scope="scope">
              <span>{{scope.row.startDate +"—"+scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workUnits" header-align="center" align="center" label="工作单位"></el-table-column>
        <el-table-column prop="position" header-align="center" align="center" label="职位">
            <template slot-scope="scope">
              <span>{{scope.row.position||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop
          label="操作"
          width="100"
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="workUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="workDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <secondLevel>
        <template v-slot:textTitle>
          附件上传
          <span class="readTxt">（请上传最后一份工作经历的离职证明）</span>
        </template>
      </secondLevel>
      <el-row style="margin-left: 3%;">
        <el-col :span="24">
          <div class="wenjian">离职证明</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <span class="yt-read-text" style="margin-left:20px">暂无附件</span> -->
            <!-- <img :src="dimission" alt style="height: 150px;width: 150px;" /> -->
             <upload
              :fileList="ruleFormTwo.dimission"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <!-- <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>-->
            <upload
              @upload="uploaddimission"
              @delFile="deldimission"
              :fileList="ruleFormTwo.dimission"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="false"
            ></upload>
          </div>
        </el-col>
      </el-row>
      <topTip>
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">家庭情况</span>
          </el-col>
        </template>
      </topTip>
      <secondLevel>
        <template v-slot:textTitle>主要家庭成员</template>
        <template
          v-slot:buttonTitle
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <el-button class="assTripBtn" type="primary" @click="addFamily">新增</el-button>
        </template>
      </secondLevel>
      <el-table :data="familyList" border style="width: 100%;">
        <el-table-column prop="familyMember" header-align="center" align="center" label="姓名"></el-table-column>
        <el-table-column prop="relation" header-align="center" align="center" label="与本人关系"></el-table-column>
        <el-table-column prop="workUnits" header-align="center" align="center" label="工作单位">
            <template slot-scope="scope">
                   <span>{{scope.row.workUnits||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isContact" header-align="center" align="center" label="是否为紧急联系人">
          <template slot-scope="scope">
                   <span>{{scope.row.isContact==1?"是":"否"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contactInformation"
          header-align="center"
          align="center"
          label="联系方式"
        ></el-table-column>
        <el-table-column
          prop
          label="操作"
          width="100"
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="familyUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="familyDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <secondLevel>
        <template v-slot:textTitle>子女情况</template>
        <template
          v-slot:buttonTitle
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <el-button class="assTripBtn" type="primary" @click="addChildren">新增</el-button>
        </template>
      </secondLevel>
      <el-table :data="childrenList" border style="width: 100%;">
        <el-table-column prop="childrenName" header-align="center" align="center" label="姓名"></el-table-column>
        <el-table-column prop="idCard" header-align="center" align="center" label="身份证">
           <template slot-scope="scope">
                   <span>{{scope.row.idCard||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" header-align="center" align="center" label="年龄"></el-table-column>
        <el-table-column prop="gender" header-align="center" align="center" label="性别">
           <template slot-scope="scope">
                   <span>{{scope.row.gender==1?"男":"女"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="birthDate" header-align="center" align="center" label="出生日期"></el-table-column>
        <el-table-column
          prop
          label="操作"
          width="100"
          v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="childrenUpdate(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              style="padding:0px"
              @click="childrenDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <topTip v-if="this.archivesState==1">
        <template>
          <el-col :span="8" style="text-align: left;" class="top-tip">
            <span style="color: #417095;font-size: 16px;font-weight: bolder;">其他附件上传</span>
          </el-col>
        </template>
      </topTip>
      <el-row style="margin-left: 3%;" v-if="this.archivesState==1">
        <el-col :span="24">
          <div class="wenjian">其他附件</div>
          <div v-if="this.$route.query.archivesState=='2'" style="margin-bottom: 20px;">
            <!-- <span class="yt-read-text" style="margin-left:20px">暂无附件</span> -->
            <!-- <img :src="otherAttrStr" alt style="height: 150px;width: 150px;" /> -->
               <upload
              :fileList="ruleFormTwo.otherAttrStr"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false" 
              :photoUpload="'2'"
              :oneOrMany="true"
               :class="{hide:hideUploadEdit,hide2:hideUploadEdit2}"
            ></upload>
          </div>
          <div v-else>
            <!-- <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus"></i>
            </el-upload>-->
            <upload
              @upload="uploadotherAttrStr"
              @delFile="delFileotherAttrStr"
              :fileList="ruleFormTwo.otherAttrStr"
              :listType="'picture-card'"
              :fileTypeBool="1"
              :disabled="false"
              :photoUpload="'2'"
              :oneOrMany="false"
            ></upload>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表单区域弹出框END -->
    <div
      style="text-align: center;padding-bottom:20px"
      v-if="this.$route.query.archivesState=='1'||!this.$route.query.archivesState"
    >
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--primary"
        @click="saveFormData"
      >
        <span>保存</span>
      </button>
      <button
        type="button"
        class="el-button yt-bottom-btn el-button--default"
        @click="resetFormData"
      >
        <span>取消</span>
      </button>
    </div>
    <div style="text-align: center;padding-bottom:20px" v-if="this.$route.query.archivesState=='2'">
      <button type="button" class="el-button yt-bottom-btn el-button--default" @click="exit">
        <span>关闭</span>
      </button>
    </div>
    <!-- 学历教育弹出框START -->
    <el-dialog
      title="学历教育"
      :visible.sync="academicDialog"
      :close-on-click-modal="false"
      :showClose="false"
      width="400px"
    >
      <el-form
        :model="studyExperienceListStr"
        :rules="academicRules"
        ref="studyExperienceListStr"
        label-width="120px"
      >
        <el-row>
          <el-col>
            <el-form-item label="学习开始日期：" prop="startDate">
              <el-date-picker
                v-model="studyExperienceListStr.startDate"
                :picker-options="startDate"
                type="date"
                placeholder="请选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                style="width:80%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="学习结束日期：" prop="endDate">
              <el-date-picker
                v-model="studyExperienceListStr.endDate"
                :picker-options="endDate"
                type="date"
                placeholder="请选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                  style="width:80%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="毕业院校：" prop="school">
            <el-input v-model="studyExperienceListStr.school" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="专业：" prop="major">
            <el-input v-model="studyExperienceListStr.major" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="学历：" prop="education">
            <el-select
              v-model="studyExperienceListStr.education"
              @change="geteducation"
              placeholder="请选择"
            >
              <el-option
                v-for="item in geteducationList"
                :key="item.value"
                :label="item.disvalue"
                :value="item.value"
                  style="width:80%"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveAcademic('studyExperienceListStr')">保存</el-button>
          <el-button @click="closeAcademic('studyExperienceListStr')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 学历教育弹出框END -->
    <!-- 工作经历弹出框START -->
    <el-dialog
      title="工作经历"
      :visible.sync="workDialog"
      :close-on-click-modal="false"
      :showClose="false"
      width="400px"
    >
      <el-form
        :model="workExperienceListStr"
        :rules="workRules"
        ref="workExperienceListStr"
        label-width="120px"
      >
        <el-row>
          <el-col>
            <el-form-item label="工作开始日期：" prop="startDate">
              <el-date-picker
                v-model="workExperienceListStr.startDate"
                type="date"
                :picker-options="startDate"
                placeholder="请选择日期"
          
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                  style="width:80%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="工作结束日期：" prop="endDate">
              <el-date-picker
                v-model="workExperienceListStr.endDate"
                type="date"
                :picker-options="endDate"
                placeholder="请选择日期"
            
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                  style="width:80%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="工作单位：" prop="workUnits">
            <el-input v-model="workExperienceListStr.workUnits" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="职位：" prop="position">
            <el-input v-model="workExperienceListStr.position" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveWork('workExperienceListStr')">保存</el-button>
          <el-button @click="closeWork('workExperienceListStr')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 工作经历弹出框END -->
    <!-- 主要家庭成员弹出框START -->
    <el-dialog
      title="主要家庭成员"
      :visible.sync="familyDialog"
      :close-on-click-modal="false"
      :showClose="false"
      width="400px"
    >
      <el-form
        :model="familyMemberListStr"
        :rules="familyRules"
        ref="familyMemberListStr"
        label-width="120px"
      >
        <el-row>
          <el-form-item label="姓名：" prop="familyMember">
            <el-input
              v-model="familyMemberListStr.familyMember"
              placeholder="请输入"
              style="width:80%"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="与本人关系：" prop="relation">
            <el-input v-model="familyMemberListStr.relation" placeholder="父子/母子/兄弟/姐弟/夫妻等" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="工作单位：" prop="workUnits">
            <el-input v-model="familyMemberListStr.workUnits" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="联系方式：" prop="contactInformation">
            <el-input
              v-model="familyMemberListStr.contactInformation"
              placeholder="请输入"
              style="width:80%"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="紧急联系人：" prop="isContact">
            <el-select v-model="familyMemberListStr.isContact" placeholder="请选择">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveFamily('familyMemberListStr')">保存</el-button>
          <el-button @click="closeFamily('familyMemberListStr')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 主要家庭成员弹出框END -->
    <!-- 子女情况弹出框START -->
    <el-dialog
      title="子女情况"
      :visible.sync="childrenDialog"
      :close-on-click-modal="false"
      :showClose="false"
      width="400px"
    >
      <el-form
        :model="childrenInfoListStr"
        :rules="childrenRules"
        ref="childrenInfoListStr"
        label-width="100px"
        :label-position="labelPosition"
      >
        <el-row>
          <el-form-item label="姓名：" prop="childrenName">
            <el-input
              v-model="childrenInfoListStr.childrenName"
              placeholder="请输入"
              style="width:80%"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="身份证：" prop="idCard">
            <el-input v-model="childrenInfoListStr.idCard" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="年龄：" prop="age">
            <el-input v-model="childrenInfoListStr.age" placeholder="请输入" style="width:80%"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="性别：" prop="gender">
            <el-radio-group v-model="childrenInfoListStr.gender">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出生日期：" prop="birthDate">
            <el-date-picker
              v-model="childrenInfoListStr.birthDate"
              type="date"
              placeholder="请选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
                style="width:80%"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="saveChildren('childrenInfoListStr')">保存</el-button>
          <el-button @click="closeChildren('childrenInfoListStr')">关闭</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 子女情况弹出框END -->
  </div>
</template>

<script>
//一级标题
import topTip from "@/components/topTip";
//二级标题
import secondLevel from "@/components/secondLevel";
//提交附件
import upload from "@/components/upload";
//查看附件
import lookFiles from "@/components/lookFiles.vue";
//axios接口组件
import axios from "@/service/http";
//配置文件
import { option } from "@/static/config";
//copy组件
import { cloneData } from "../../static/commonTool";
export default {
  data() {
    return {
      // 开始时间
      startDate: {
        disabledDate: (time) => {
          //学历开始时间
          let endDateVal = this.studyExperienceListStr.endDate;
          //工作开始时间
          let Dateend = this.studyExperienceListStr.endDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
          if (Dateend) {
            return time.getTime() > new Date(Dateend).getTime();
          }
        },
      },
      //结束时间
      endDate: {
        disabledDate: (time) => {
          //学历结束时间
          let beginDateVal = this.studyExperienceListStr.startDate;
          //工作结束时间
          let Datestart = this.workExperienceListStr.startDate;
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
          if (Datestart) {
            return (
              time.getTime() <
              new Date(Datestart).getTime() - 1 * 24 * 60 * 60 * 1000
            );
          }
        },
      },
        hideUploadEdit:true,//上传附件加号大盒子
        hideUploadEdit2:true,//上传附件图片上的删除按钮
      formData: {
        realName: "", //人名
        workState: "", //工作状态
        employDate: "", //入职时间
        enterpriseMailbox: "", //企业邮箱
        landline: "", //座机号
        workNum: "", //工号

        idCard: "", //身份证号
        gender: "", //性别
        birthDate: "", //出生日期
        age: "", //年龄
        cellPhone: "", //联系方式
        nation: "", //民族
        nationName: "", //民族名字
        marriage: "", //婚姻状况
        marriageName: "", //婚姻状况名字
        education: "", //最终(高)学历
        educationName: "", //最终(高)学历名字
        politicalStatus: "", //政治面貌
        politicalStatusName: "", //政治面貌名字
        empartyDate: "", //入党时间
        empartyPlace: "", //党籍(关系)所在地
        nativePlace: "", //籍贯
        nativePlaceName: "", //籍贯名字
        householdRegistrationNature: "", //户口性质
        householdRegistrationCity: "", //户籍城市
        householdRegistrationCityName: "", //城市名字
        foreignLanguageLevel: "", //外语水平
        archivesPlace: "", //档案所在地
        workHoursDate: "", //参加工作时间
        yearDateNumber: "", //年假天数
        homeAddress: "", //家庭住址
        Specialty: "",
        politicalStatusvalue: "", //政治面貌value值
        archivesPlacevalue: "", //存档档案value值
        nativePlacevalue: "", //籍贯value值
        educationvalue: "", //学历value值
        marriagevalue: "", //婚姻状况value值
        nationvalue: "", //民族value值
        jworkStateobvalue: "", //工作状态value值
        deptPositionListStr: [], //部门组织集合字符串
        backIdCardPhotoId: [], //身份证照片反面Id
        personnelPhotoId: [], //一寸照ID
        studyExperienceAttrStr: [], //学历教育附件ID
        workExperienceAttrStr: [], //工作经历附件ID
        otherAttrStr: [], //其他附件ID字符串
        expenseFlieList: [],
        fileList: "", //身份证正面图片显示详情
        fileListTwo: "", //身份证反面图片显示详情
        photograph: "", //一寸照片图片
        dimission: "", //离职附件
        workExperienceAttrStr: "", //其他
        moreNotifyObject: [
          {
            deptName: "",
            positionName: "",
            type: "",
          },
        ],
      },
    
      formLabel:"入职时间：",
      moreNotifyObjects: [],
      ruleForm: {
        realName: "", //人名
        workState: "", //工作状态
        employDate: "", //入职时间
        enterpriseMailbox: "", //企业邮箱
        landline: "", //座机号
        workNum: "", //工号

        idCard: "", //身份证号
        gender: "", //性别
        birthDate: "", //出生日期
        age: "", //年龄
        cellPhone: "", //联系方式
        nation: "", //民族
        marriage: "", //婚姻状况
        education: "", //最终(高)学历
        politicalStatus: "", //政治面貌
        empartyDate: "", //入党时间
        empartyPlace: "", //党籍(关系)所在地
        nativePlace: "", //籍贯
        nativePlaceName: "", //籍贯名字
        householdRegistrationNature: "", //户口性质
        householdRegistrationCity: "", //户籍城市
        householdRegistrationCityName: "", //城市名字
        foreignLanguageLevel: "", //外语水平
        archivesPlace: "", //档案所在地
        workHoursDate: "", //参加工作时间
        yearDateNumber: "", //年假天数
        homeAddress: "", //家庭住址
        Specialty: "",
        politicalStatusvalue: "", //政治面貌value值
        archivesPlacevalue: "", //存档档案value值

        nativePlacevalue: "", //籍贯value值
        educationvalue: "", //学历value值
        marriagevalue: "", //婚姻状况value值
        nationvalue: "", //民族value值
        jworkStateobvalue: "", //工作状态value值
        deptPositionListStr: [], //部门组织集合字符串
        backIdCardPhotoId: [], //身份证照片反面Id
        personnelPhotoId: [], //一寸照ID
        studyExperienceAttrStr: [], //学历教育附件ID
        workExperienceAttrStr: [], //工作经历附件ID
        otherAttrStr: [], //其他附件ID字符串

        expenseFlieList: [],
         moreNotifyObject: [
          {
            deptName: "",
            positionName: "",
            type: "",
          },
        ],
      },
      ruleFormTwo: {
        fileList: [], //身份证正面
        fileListTwo: [], //身份证背面
        photograph: [], //一寸照片
        education: [], //学历附件
        dimission: [], //离职附件
        otherAttrStr: [], //其他附件ID字符串
      },
      rules: {
        realName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        workState: [
          { required: true, message: "请选择工作状态", trigger: "change" },
        ],
        employDate: [
          { required: true, message: "请选择日期", trigger: "change" },
        ],
        deptName: [
          { required: true, message: "请选择部门组织", trigger: "change" },
        ],
        idCard: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          { validator: this.ifCards, trigger: "blur" },
        ],
        cellPhone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
            { validator: this.checkPhone, trigger: "blur" },
        ],
        marriage: [
          { required: true, message: "请选择婚姻状况", trigger: "blur" },
        ],
        education: [
          { required: true, message: "请选择最终学历", trigger: "blur" },
        ],
        politicalStatus: [
          { required: true, message: "请选择政治面貌", trigger: "blur" },
        ],
        nativePlace: [
          { required: true, message: "请选择籍贯", trigger: "blur" },
        ],
        householdRegistrationNature: [
          { required: true, message: "请选择户口性质", trigger: "blur" },
        ],
        householdRegistrationCity: [
          { required: true, message: "请选择户籍城市", trigger: "blur" },
        ],
        homeAddress: [
          { required: true, message: "请输入家庭住址", trigger: "blur" },
        ],
      },
      personalSpecialty: [],
      personalSpecialtys: [],
      dialogImageUrl: "",
      getID: "",
      getIDTwo: "",
      getIDThree: "",
      dialogVisible: false,
      //学历教育弹出框是否显示
      academicDialog: false,
      //工作经历弹出框是否显示
      workDialog: false,
      //主要家庭成员弹出框是否显示
      familyDialog: false,
      //子女情况弹出框是否显示
      childrenDialog: false,
      //学历教育列表数据
      academicList: [],
      //工作经历列表数据
      workList: [],
      //主要家庭成员列表数据
      familyList: [],
      //子女情况列表数据
      childrenList: [],
      //学历教育列表index值
      academicListIndex: null,
      //工作经历列表index值
      workListIndex: null,
      //主要家庭成员列表index值
      familyListIndex: null,
      //子女情况列表index值
      childrenListIndex: null,
      //学历教育表单
      studyExperienceListStr: {},
      //工作经历表单
      workExperienceListStr: {},
      //主要家庭成员表单
      familyMemberListStr: {},
      //子女情况表单
      childrenInfoListStr: {},
      //学历教育列表编辑
      editAcademic: false,
      //工作经历列表编辑
      editWork: false,
      //主要家庭成员列表编辑
      editFamily: false,
      //子女情况列表编辑
      editChildren: false,
      //弹出框表单域标签的位置
      labelPosition: "right",
      //学历教育弹出框表单必填验证
      academicRules: {
        startDate: [
          { required: true, message: "请选择学习开始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择学习结束日期", trigger: "change" },
        ],
        school: [
          { required: true, message: "请输入毕业院校", trigger: "change" },
        ],
        education: [
          { required: true, message: "请输入学历", trigger: "change" },
        ],
      },
      //工作经历弹出框表单必填验证
      workRules: {
        startDate: [
          { required: true, message: "请选择工作开始日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择工作结束日期", trigger: "change" },
        ],
        workUnits: [
          { required: true, message: "请输入工作单位", trigger: "change" },
        ],
      },
      //主要家庭成员弹出框表单必填验证
      familyRules: {
        familyMember: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        relation: [
          { required: true, message: "请输入与本人关系", trigger: "change" },
        ],
        isContact: [
          { required: true, message: "请输入紧急联系人", trigger: "change" },
        ],
        contactInformation: [
          { required: true, message: "请输入联系方式", trigger: "change" },
        ],
      },
      //子女情况弹出框表单必填验证
      childrenRules: {
        childrenName: [
          { required: true, message: "请输入姓名", trigger: "change" },
        ],
        age: [{ required: true, message: "请输入年龄", trigger: "change" }],
        gender: [{ required: true, message: "请输入性别", trigger: "change" }],
        birthDate: [
          { required: true, message: "请输入出生日期", trigger: "change" },
        ],
      },

      // props: {
      //   value: "value",
      //   label:  "label",

      //   children:'children',

      // },
      //个人信息附件
      hideJust: false,
      hideBack: false,
      hideOne: false,
      limitCount: 1,
      //查看详情
      archivesState: 1,

      tissueList: [], //组织部门下拉框
      positionList: [], //岗位
      workStateList: [], //工作状态
      nationList: [], //民族
      marriageList: [], //婚姻
      educationList: [], //学历
      geteducationList: [], //弹窗新增学校教育学历
      politicalStatusList: [], //政治面貌
      registeredResidenceList: [], //户口性质
      fileLocationList: [], // 存档单位
      abilityList: [], //  个人特长
      personalSpecialtyvalue: "", //个人特长value值
      nativeList: [], //籍贯
      disvaluelast: false, //判断个人特长其他
      context: "", //显示其他汉字
      deptId: "", //组织部门id
      positionId: "", //岗位id
      positionIds: "",
      deptIds: "",
      station: [],
      options: [
        {
          label: "",
        },
      ], //籍贯城市
      val: [],
      vals: [],
      valstwo: [],
      nativePlace: "", //籍贯
      nativePlaceName: "", //籍贯名字
      householdRegistrationCity: "", //城市vualue
      householdRegistrationCityName: "", //城市名字
      depList: [],
    };
  },
  components: {
    topTip,
    secondLevel,
    upload,
    lookFiles,
  },
  watch:{
    nativePlace(){
      if (this.$refs.der) {
        this.$refs.der.dropDownVisible = false
      }
    },
householdRegistrationCity(){
   if (this.$refs.cascader) {
        this.$refs.cascader.dropDownVisible = false
      }
},
  },
  mounted() {
    
    this.gettissue();
    this.getDictInfoListByDictTypeCode();
    this.getProAreaInfo();
  },

  methods: {
    //座机验证
    land(val) {
      var local = /0\d{2}-\d{7,8}/;
      var checkNum = local.test(this.ruleForm.landline);
      if (!checkNum) {
        this.ruleForm.landline = "";
      }
    },
    //新增组织部门岗位
    addUser() {
     this.ruleForm.moreNotifyObject.push({
        deptId: '',
        deptName: "",
        positionId: '',
        positionName: "",
        positionList: []
      });
      this.$forceUpdate()
    },
    //删除组织部门岗位
    deleteRules(item, index) {
      this.index = this.ruleForm.moreNotifyObject.indexOf(item);
      if (index !== -1) {
        this.ruleForm.moreNotifyObject.splice(index, 1);
      }
      this.$forceUpdate()
    },
    // 上传附件身份证原件照片正面
    uploadPicture(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.fileList = this.forSetPage(file);
      // this.ruleFormTwo.fileListTwo = this.forSetPage(file);
      console.log("撒旦撒是", this.ruleFormTwo.fileList[0].fileId);
    },
    // 删除附件身份证原件照片正面
    delFileBtnPicture(fileList) {
      this.ruleFormTwo.fileList = this.forSetPage(fileList);
      // this.ruleFormTwo.fileListTwo = this.forSetPage(fileListTwo);
    },
    // 上传附件身份证原件照片背面
    uploadTwo(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.fileListTwo = this.forSetPage(file);
    },
    // 删除附件身份证原件照片背面
    delFileTwo(fileListTwo) {
      this.ruleFormTwo.fileListTwo = this.forSetPage(fileListTwo);
    },
    // 上传附件一寸照片
    uploadphotograph(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.photograph = this.forSetPage(file);
    },
    // 删除附件一寸照片
    delphotograph(photograph) {
      this.ruleFormTwo.photograph = this.forSetPage(photograph);
    },
    // 上传附件学历/学位证件照片
    uploadeducation(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.education = this.forSetPage(file);
    },
    // 删除附件学历/学位证件照片
    deleducation(education) {
      this.ruleFormTwo.education = this.forSetPage(education);
    },
    // 上传附件离职证明
    uploaddimission(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.dimission = this.forSetPage(file);
    },
    // 删除附件离职证明
    deldimission(dimission) {
      this.ruleFormTwo.dimission = this.forSetPage(dimission);
    },
    // 上传附件其他附件
    uploadotherAttrStr(file) {
      // var data = eval("(" + file + ")");
      this.ruleFormTwo.otherAttrStr = this.forSetPage(file);
    },
    // 删除附件其他附件
    delFileotherAttrStr(otherAttrStr) {
      this.ruleFormTwo.otherAttrStr = this.forSetPage(otherAttrStr);
    },
    //附件循环设置
    forSetPage(list) {
      let newList = [];
      list.forEach((n) => {
        newList.push({
          fileId: n.fileId,
          fileName: n.fileName,
          name: n.fileName,
        });
      });
      return newList;
    },
    // 附件上传图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 身份证验证
    async ifCards(rule, value, callback) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(value)) {
        await this.go(value.length);
        callback();
      } else {
        callback(new Error("身份证号码不正确"));
      }
    },
    //手机号验证
     checkPhone(rule, value, callback){
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg =/^[1][3,4,5,6,7,8,9][0-9]{9}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
     },

    // 实现自动生成生日，性别，年龄
    go(val) {
      let iden = this.ruleForm.idCard;
      let sex = null;
      let birth = null;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if (val === 18) {
        age = myDate.getFullYear() - iden.substring(6, 10) - 1;
        sex = iden.substring(16, 17);
        birth =
          iden.substring(6, 10) +
          "-" +
          iden.substring(10, 12) +
          "-" +
          iden.substring(12, 14);
        if (
          iden.substring(10, 12) < month ||
          (iden.substring(10, 12) == month && iden.substring(12, 14) <= day)
        )
          age++;
      }
      if (val === 15) {
        age = myDate.getFullYear() - iden.substring(6, 8) - 1901;
        sex = iden.substring(13, 14);
        birth =
          "19" +
          iden.substring(6, 8) +
          "-" +
          iden.substring(8, 10) +
          "-" +
          iden.substring(10, 12);
        if (
          iden.substring(8, 10) < month ||
          (iden.substring(8, 10) == month && iden.substring(10, 12) <= day)
        )
          age++;
      }

      if (sex % 2 === 0) sex = "1";
      else sex = "2";
      this.ruleForm.gender = sex;
      this.ruleForm.age = age;
      this.ruleForm.birthDate = birth;
    },

    //获取下拉框字段集合
    getDictInfoListByDictTypeCode() {
      // let that =this;
      // let path;
      // path={
      //   workState,
      // }
      axios
        .post(
          option.base_path + "manpower/personnel/getDictInfoListByDictTypeCode",
          {
            dictTypeCode:
              "ability,native,workState,gender,marriage,nation,politicalStatus,education,nature,fileLocation,registeredResidence",
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            let dataList = [];
            res.data.data.forEach((item, index) => {
              if (item.dictTypeCode == "workState") {
                this.workStateList.push(item);
              } else if (item.dictTypeCode == "nation") {
                this.nationList.push(item);
              } else if (item.dictTypeCode == "marriage") {
                this.marriageList.push(item);
              } else if (item.dictTypeCode == "education") {
                this.educationList.push(item);
                this.geteducationList.push(item);
              } else if (item.dictTypeCode == "politicalStatus") {
                this.politicalStatusList.push(item);
              } else if (item.dictTypeCode == "registeredResidence") {
                this.registeredResidenceList.push(item);
              } else if (item.dictTypeCode == "fileLocation") {
                this.fileLocationList.push(item);
              } else if (item.dictTypeCode == "ability") {
                this.abilityList.push(item);
              } else if (item.dictTypeCode == "native") {
                this.nativeList.push(item);
              }
            });
            console.log(res, "asd");
          }
        });
    },
    //工作状态
    onworkState(val) {
      this.workStateList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.jworkStateobvalue = item.disvalue;
          this.ruleForm.jworkStateob = item.value;
        }
        this.getWorkNum();
      });
    },
    //民族
    onNation(val) {
      this.nationList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.nationvalue = item.disvalue;
          this.ruleForm.nation = item.value;
        }
      });
    },
    //婚姻状况
    onMarriage(val) {
      this.marriageList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.marriagevalue = item.disvalue;
          this.ruleForm.marriage = item.value;
        }
      });
    },
    //学历
    oneducation(val) {
      this.educationList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.educationvalue = item.disvalue;
          this.ruleForm.education = item.value;
        }
      });
    },
    //新增学校教育学历
    geteducation(val) {
      this.geteducationList.forEach((item) => {
        if (item.value == val) {
          this.studyExperienceListStr.educationvalue = item.disvalue;
          this.studyExperienceListStr.education = item.value;
        }
      });
    },
    //政治面貌
    onpoliticalStatus(val) {
      this.politicalStatusList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.politicalStatusvalue = item.disvalue;
          this.ruleForm.politicalStatus = item.value;
        }
      });
    },
    //用户性质
    onregisteredResidence(val) {
      this.registeredResidenceList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.householdRegistrationNature = item.disvalue;
          // this.ruleForm.householdRegistrationNature = "5";
        }
      });
    },
    //存档档案
    onfileLocation(val) {
      this.fileLocationList.forEach((item) => {
        if (item.value == val) {
          this.ruleForm.archivesPlacevalue = item.disvalue;
          this.ruleForm.archivesPlace = item.value;
        }
      });
    },
    //个人特长
    onability(val) {
      console.log(this.personalSpecialty, val, "val");

      let that = this;
      // let arr =[];
      this.personalSpecialty = [];
      val.map((v) => {
        this.abilityList.forEach((item) => {
          if (item.value === v) {
            if (v === "6") {
              this.personalSpecialty.push({
                specialSkillValue: item.value,
                context: this.context,
              });
            } else {
              this.personalSpecialty.push({
                specialSkillValue: item.value,
                context: item.disvalue,
              });
            }
          }
        });
      });
      console.log(this.personalSpecialty, this.personalSpecialtyvalue);
      let isTrue = false;

      val.forEach((i) => {
        if (i === "6") {
          isTrue = true;
        }
      });
      if (isTrue) {
        that.disvaluelast = true;
      } else {
        that.disvaluelast = false;
      }

      // console.log(this.personalSpecialtyvalue);
    },
    //籍贯
    onNative(val) {
      this.valstwo = this.getCascaderObj(val, this.options);
      let city = [];
      let cityName = [];
      this.valstwo.forEach((i) => {
        //城市value
        city.push(i.value);
        //城市名字
        cityName.push(i.label);
      });
      console.log(this.vals, "vals");
      this.nativePlace = city.join("/");

      //  this.ruleForm.nativePlace= val;

      this.ruleForm.nativePlaceName = cityName.join("/");
      // this.ruleForm.nativePlace = val;
    },
    //获取所有省市区
    getProAreaInfo() {
      axios.post(option.base_path + "db/area/getProAreaInfo").then((res) => {
        if (res.data.flag == 0) {
          this.options = res.data.data;


// for (let val in this.options)
// {
 
//  val['children'].forEach(item => {
  
//   delete item.children
//  })
//  console.log(item,"asddfghaaaassbbbbbbbbbbb")
// }




        }
      });
    },
    //根据获取地区的id获取区域名
    handleChange(val) {
      this.vals = this.getCascaderObj(val, this.options);
      let cityTwo = [];
      let cityNameTwo = [];
      this.vals.forEach((i) => {
        //城市value
        cityTwo.push(i.value);
        //城市名字
        cityNameTwo.push(i.label);
      });
      console.log(this.vals, "vals");
      this.householdRegistrationCity = cityTwo.join("/");
      this.ruleForm.householdRegistrationCity = this.householdRegistrationCity;
      this.ruleForm.householdRegistrationCityName = cityNameTwo.join("/");
      this.ruleForm.householdRegistrationCity = val;
      console.log(
        this.householdRegistrationCity,
        this.householdRegistrationCityName
      );
    },
    getCascaderObj(val, opt) {
      if (val && val.length > 0) {
        return val.map((value, index, array) => {
          for (var itm of opt) {
            if (itm.value == value) {
              opt = itm.children;
              return itm;
            }
          }
          return null;
        });
      } else {
        return null
      }
    },

    //组织部门下拉框
    gettissue() {
      axios
        .post(option.base_path + "manpower/dept/getAllDeptPosition")
        .then((res) => {
          if (res.data.flag == 0) {
            this.tissueList = res.data.data;
            console.log(this.tissueList, "bumen");
          }
          this.getPersonnelArchivesEnterInfo();
        });
    },
    // //动态新增部门
    onSelectTwo(item) {
      this.tissueList.forEach((v) => {
        if (v.deptId == item.deptId) {
          item.deptName = v.deptName;
          item.deptId =v.deptId
          // = v.deptName;
          item.positionList = v.positionList;
           if(item.positionList.length>=0){
         
            item.positionName =""
           item.positionId=""
          }
        }
      });
      // this.onJobTwo();
      this.$forceUpdate()
    },
    // //动态新增岗位
    onJobTwo(item, index) {

      item.positionList.map((n) => {
        if (n.positionId == item.positionId) {
          // this.positionIds = n.positionId;
        
          item.positionName =n.positionName
          item.positionId = n.positionId;
          // item.positionName =n.positionName
        }
        // console.log(this.positionId, this.ruleForm.positionName)
      });
      this.ruleForm.moreNotifyObject[index] = item
      this.$forceUpdate()
    },
    /**
     * 取消
     */
    resetFormData() {
      this.$confirm("确定返回吗，所填写信息将不会保存", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$router.push({
            path: "/personnelArchives/personFileQuery",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //关闭
    exit() {
      this.$router.push({
        path: "/personnelArchives/personFileQuery",
      });
    },
    //计算时间
    workDate() {
      let dates = new Date(this.ruleForm.workHoursDate).getFullYear(); //得到年份;
      let now = new Date().getFullYear();
      let yearDays = now - dates;
      if (yearDays >= 1 && yearDays < 10) {
        this.ruleForm.yearDateNumber = "5";
      } else if (yearDays >= 10 && yearDays < 20) {
        this.ruleForm.yearDateNumber = "10";
      }else if ( yearDays >= 20) {
        this.ruleForm.yearDateNumber = "15";
      } else {
        this.ruleForm.yearDateNumber = "0";
      }
      console.log(dates);
      console.log(yearDays);
    },
    //学历教育新增
    addAcademic() {
      this.studyExperienceListStr = {};
      this.academicDialog = true;
      this.editAcademic = false;
    },
    //工作经历新增
    addWork() {
      this.workExperienceListStr = {};
      this.workDialog = true;
      this.editWork = false;
    },
    //主要家庭成员新增
    addFamily() {
      this.familyMemberListStr = {};
      this.familyDialog = true;
      this.editFamily = false;
    },
    //子女情况新增
    addChildren() {
      this.childrenInfoListStr = {};
      this.childrenDialog = true;
      this.editChildren = false;
    },
    //学历教育弹出框关闭按钮
    closeAcademic() {
      this.academicDialog = false;
      this.$refs.studyExperienceListStr.resetFields();
    },
    //工作经历弹出框关闭按钮
    closeWork() {
      this.workDialog = false;
      this.$refs.workExperienceListStr.resetFields();
    },
    //主要家庭成员弹出框关闭按钮
    closeFamily() {
      this.familyDialog = false;
      this.$refs.familyMemberListStr.resetFields();
    },
    //子女情况关闭按钮
    closeChildren() {
      this.childrenDialog = false;
      this.$refs.childrenInfoListStr.resetFields();
    },
    //学历教育弹出框保存按钮
    saveAcademic() {
      //新增还是修改
      if (this.editAcademic == true) {
        this.academicDialog = false;
        this.editAcademic = false;
        this.academicList.splice(this.academicListIndex, 1);
        this.academicList.splice(this.academicListIndex, 0, {
          education: this.studyExperienceListStr.education,
           educationName:this.studyExperienceListStr.educationvalue,
          school: this.studyExperienceListStr.school,
          endDate: this.studyExperienceListStr.endDate,
          startDate: this.studyExperienceListStr.startDate,
          major: this.studyExperienceListStr.major,
        });
        this.$refs.studyExperienceListStr.resetFields();
      } else {
        this.$refs.studyExperienceListStr.validate((valid) => {
          if (valid) {
            this.academicDialog = false;
            //学历教育列表显示数据
            this.academicList.push({
              education: this.studyExperienceListStr.education,
               educationName:this.studyExperienceListStr.educationvalue,
              school: this.studyExperienceListStr.school,
              endDate: this.studyExperienceListStr.endDate,
              startDate: this.studyExperienceListStr.startDate,
              major: this.studyExperienceListStr.major,
            });
            this.$refs.studyExperienceListStr.resetFields();
          }
        });
      }
    },
    //工作经历弹出框保存按钮
    saveWork() {
      //新增还是修改

      if (this.editWork == true) {
        this.editWork = false;
        this.workDialog = false;
        this.workList.splice(this.workListIndex, 1);
        this.workList.splice(this.workListIndex, 0, {
          position: this.workExperienceListStr.position,
          workUnits: this.workExperienceListStr.workUnits,
          endDate: this.workExperienceListStr.endDate,
          startDate: this.workExperienceListStr.startDate,
        });
        this.$refs.workExperienceListStr.resetFields();
      } else {
        this.$refs.workExperienceListStr.validate((valid) => {
          if (valid) {
            this.workDialog = false;
            //工作经历列表显示数据

            this.workList.push({
              position: this.workExperienceListStr.position,
              workUnits: this.workExperienceListStr.workUnits,
              endDate: this.workExperienceListStr.endDate,
              startDate: this.workExperienceListStr.startDate,
            });
            this.$refs.workExperienceListStr.resetFields();
          }
        });
      }
    },
    //主要家庭成员弹出框保存按钮
    saveFamily() {
      //新增还是修改
      if (this.editFamily == true) {
        this.editFamily = false;
        this.familyDialog = false;
        this.familyList.splice(this.familyListIndex, 1);
        this.familyList.splice(this.familyListIndex, 0, {
          contactInformation: this.familyMemberListStr.contactInformation,
          isContact: this.familyMemberListStr.isContact,
          familyMember: this.familyMemberListStr.familyMember,
          relation: this.familyMemberListStr.relation,
          workUnits: this.familyMemberListStr.workUnits,
        });
        this.$refs.familyMemberListStr.resetFields();
      } else {
        this.$refs.familyMemberListStr.validate((valid) => {
          if (valid) {
            this.familyDialog = false;
            //主要家庭成员列表显示数据
            this.familyList.push({
              contactInformation: this.familyMemberListStr.contactInformation,
              isContact: this.familyMemberListStr.isContact,
              familyMember: this.familyMemberListStr.familyMember,
              relation: this.familyMemberListStr.relation,
              workUnits: this.familyMemberListStr.workUnits,
            });
            this.$refs.familyMemberListStr.resetFields();
          }
        });
      }
    },
    //子女情况弹出框保存按钮
    saveChildren() {
      //新增还是修改
      if (this.editChildren == true) {
        this.editChildren = false;
        this.childrenDialog = false;
        this.childrenList.splice(this.childrenListIndex, 1);
        this.childrenList.splice(this.childrenListIndex, 0, {
          age: this.childrenInfoListStr.age,
          birthDate: this.childrenInfoListStr.birthDate,
          gender: this.childrenInfoListStr.gender,
          idCard: this.childrenInfoListStr.idCard,
          childrenName: this.childrenInfoListStr.childrenName,
        });
        this.$refs.childrenInfoListStr.resetFields();
      } else {
        this.$refs.childrenInfoListStr.validate((valid) => {
          if (valid) {
            this.childrenDialog = false;
            //子女情况列表显示数据
            this.childrenList.push({
              age: this.childrenInfoListStr.age,
              birthDate: this.childrenInfoListStr.birthDate,
              gender: this.childrenInfoListStr.gender,
              idCard: this.childrenInfoListStr.idCard,
              childrenName: this.childrenInfoListStr.childrenName,
            });
            this.$refs.childrenInfoListStr.resetFields();
          }
        });
      }
    },
    //学历教育列表修改
    academicUpdate(index, row) {
      this.academicDialog = true;
      this.editAcademic = true;
      this.studyExperienceListStr = {
        education: "",
        school: "",
        endDate: "",
        startDate: "",
        major: "",
      
      };
      this.studyExperienceListStr.educationvalue = row.educationName;
      this.studyExperienceListStr.education = row.education;
      this.studyExperienceListStr.school = row.school;
      this.studyExperienceListStr.endDate = row.endDate;
      this.studyExperienceListStr.startDate = row.startDate;
      this.studyExperienceListStr.major = row.major;
      this.academicListIndex = index;
    },
    //工作经历列表修改
    workUpdate(index, row) {
      this.workDialog = true;
      this.editWork = true;
      this.workExperienceListStr = {
        position: "",
        workUnits: "",
        endDate: "",
        startDate: "",
      };
      this.workExperienceListStr.position = row.position;
      this.workExperienceListStr.workUnits = row.workUnits;
      this.workExperienceListStr.endDate = row.endDate;
      this.workExperienceListStr.startDate = row.startDate;
      this.workListIndex = index;
    },
    //主要家庭成员列表修改
    familyUpdate(index, row) {
      this.familyDialog = true;
      this.editFamily = true;
      this.familyMemberListStr = {
        isContact: "",
        contactInformation: "",
        familyMember: "",
        relation: "",
        workUnits: "",
      };
      this.familyMemberListStr.contactInformation = row.contactInformation;
      this.familyMemberListStr.isContact = row.isContact;
      this.familyMemberListStr.familyMember = row.familyMember;
      this.familyMemberListStr.relation = row.relation;
      this.familyMemberListStr.workUnits = row.workUnits;
      this.familyListIndex = index;
    },
    //子女情况列表修改
    childrenUpdate(index, row) {
      this.childrenDialog = true;
      this.editChildren = true;
      this.childrenInfoListStr = {
        age: "",
        birthDate: "",
        gender: "",
        idCard: "",
        childrenName: "",
      };
      this.childrenInfoListStr.age = row.age;
      this.childrenInfoListStr.birthDate = row.birthDate;
      this.childrenInfoListStr.gender = row.gender;
      this.childrenInfoListStr.idCard = row.idCard;
      this.childrenInfoListStr.childrenName = row.childrenName;
      this.childrenListIndex = index;
    },
    //学历教育列表删除
    academicDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.academicList.splice(index, 1);
      });
    },
    //工作经历列表删除
    workDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.workList.splice(index, 1);
      });
    },
    //主要家庭成员列表删除
    familyDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.familyList.splice(index, 1);
      });
    },
    //子女情况列表删除
    childrenDel(index, row) {
      this.$confirm(`确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        this.childrenList.splice(index, 1);
      });
    },
    /**
     * 保存信息
     */
    saveFormData() {
      // this.onNative();
      // this.handleChange();
      (this.ruleForm.studyExperienceListStr = JSON.stringify(
        this.academicList
      )), //弹窗教育
        (this.ruleForm.workExperienceListStr = JSON.stringify(this.workList)), //工作经历集合
        (this.ruleForm.familyMemberListStr = JSON.stringify(this.familyList)), //主要家庭成员wo
        (this.ruleForm.childrenInfoListStr = JSON.stringify(this.childrenList)), //子女情况集合
        (this.ruleForm.justIdCardPhotoId = this.ruleFormTwo.fileList
          .map((v) => v.fileId)
          .join(",")); //身份证照片正面
      this.ruleForm.backIdCardPhotoId = this.ruleFormTwo.fileListTwo
        .map((v) => v.fileId)
        .join(","); //身份证照片背面
      this.ruleForm.personnelPhotoId = this.ruleFormTwo.photograph
        .map((v) => v.fileId)
        .join(","); //一寸照ID
      this.ruleForm.studyExperienceAttrStr = this.ruleFormTwo.education
        .map((v) => v.fileId)
        .join(","); //学历教育附件ID
      this.ruleForm.workExperienceAttrStr = this.ruleFormTwo.dimission
        .map((v) => v.fileId)
        .join(","); //工作经历附件ID
      this.ruleForm.otherAttrStr = this.ruleFormTwo.otherAttrStr
        .map((v) => v.fileId)
        .join(","); //其他附件ID字符串
      //籍贯
      this.valstwo = this.getCascaderObj(this.ruleForm.nativePlace,this.options);
      let cityTwo = [];
      let cityNameTwo = [];
      if (this.valstwo && this.valstwo.length > 0) {
        this.valstwo.forEach((i) => {
          //城市value
          cityTwo.push(i.value);
          //城市名字
          cityNameTwo.push(i.label);
        });
      }
        this.ruleForm.nativePlace = cityTwo.join("/");  
      //省城市
     
        this.vals = this.getCascaderObj(this.ruleForm.householdRegistrationCity,this.options);
        let city = [];
        let cityName = [];
        if (this.vals && this.vals.length > 0) {
          this.vals.forEach((i) => {
            //城市value
            city.push(i.value);
            //城市名字
            cityName.push(i.label);
          });
        }
        this.ruleForm.householdRegistrationCity = city.join("/");
    
      // //部门组织和岗位
      if (this.ruleForm.moreNotifyObject && this.ruleForm.moreNotifyObject.length > 0) {
        this.ruleForm.moreNotifyObject.map((item, index) => {
          if (index === 0) {
            this.depList.push({
              deptId: item.deptId,
              positionId: item.positionId,
              type: "MAIN_JOB",
            });
          } else {
            this.depList.push({
              deptId: item.deptId,
              positionId: item.positionId,
              type: "PART_TIME",
            });
          }
        });
      }
       this.ruleForm.deptPositionListStr = JSON.stringify(this.depList);
     
  
      //个人特点
      this.personalSpecialty.map((v) => {
        if (v.specialSkillValue === "6") {
          v.context = this.context;
        }
      });
      this.ruleForm.specialSkillListStr = JSON.stringify(
        this.personalSpecialty
      );
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          axios
            .post(
              option.base_path + "manpower/personnel/saveOrUpdatePersonnelInfo",
              this.ruleForm
            )
            .then((res) => {
              if (res.data.flag == 0) {
                console.log(res);
                this.$router.push({
                  path: "/personnelArchives/personFileQuery",
                });
              } else {
                console.log("error submit!!");
              }
            });
        }
      });
    },
    //修改页面数据
    //查看详情
    getPersonnelArchivesEnterInfo() {
      axios
        .post(
          option.base_path + "manpower/personnel/getDetailInfoByPersonnelId",
          {
            personnelId: this.$route.query.personnelId,
          }
        )
        .then((res) => {
          if (res.data.flag == 0) {
            this.formData = res.data.data.basePersonnelInfo;
            this.ruleForm = res.data.data.basePersonnelInfo;
            this.academicList = res.data.data.studyExperienceList; //弹窗教育

            this.workList = res.data.data.workExperienceList; //工作经历集合
            this.familyList = res.data.data.familyMemberList; //主要家庭成员
            this.childrenList = res.data.data.childrenInfoList; //子女情况集合

            let City =
              res.data.data.basePersonnelInfo.householdRegistrationCity;
            let CityTwo = res.data.data.basePersonnelInfo.nativePlace;
            this.ruleForm.householdRegistrationCity = City.split("/");
            this.ruleForm.nativePlace = CityTwo.split("/");
            console.log(this.ruleForm.householdRegistrationCity, "city");

            this.context = res.data.data.basePersonnelInfo.specialSkillContent;
         
            this.ruleForm.moreNotifyObject = res.data.data.deptPositionList;
  
            if(this.ruleForm.moreNotifyObject.length!==0){
                //部门和岗位
            res.data.data.deptPositionList.map((m,i)=>{
              this.tissueList.forEach((v) => {
                if (v.deptId == m.deptId) {
                  m.positionList = v.positionList;
                   }
               });
            })

            this.ruleForm.moreNotifyObject = res.data.data.deptPositionList;
            }else{
              this.addUser();
            }
           


            //修改入职时间名字
            if(res.data.data.basePersonnelInfo.workState == 2) {
              this.formLabel="挂职时间："
            } else if(res.data.data.basePersonnelInfo.workState == 3) {
               this.formLabel="挂靠时间："
            }else if(res.data.data.basePersonnelInfo.workState == 0) {
             this.formLabel="离职时间："
            }
            //身份证正面附件
            let rForm = this.ruleFormTwo;
             if(res.data.data.basePersonnelInfo.justIdCardPhotoId!==""){
               rForm.fileList.push({
              fileId: res.data.data.basePersonnelInfo.justIdCardPhotoId,
              fileName: res.data.data.basePersonnelInfo.justIdCardPhotoName,
            });
              this.ruleFormTwo = rForm;
            }
           
          
            // this.fileList =
            //   option.base_path +
            //   "fileUpDownload/download?pkId=" +
            //   res.data.data.basePersonnelInfo.justIdCardPhotoId +
            //   "&isDownload=false";
            //身份证反面附件
            if(res.data.data.basePersonnelInfo.backIdCardPhotoId!==""){
            rForm.fileListTwo.push({
              fileId: res.data.data.basePersonnelInfo.backIdCardPhotoId,
              fileName: res.data.data.basePersonnelInfo.backIdCardPhotoName,
            });
            }
            // this.fileListTwo =
            //   option.base_path +
            //   "fileUpDownload/download?pkId=" +
            //   res.data.data.basePersonnelInfo.backIdCardPhotoId +
            //   "&isDownload=false";

            //一寸照片
             if(res.data.data.basePersonnelInfo.personnelPhotoId!==""){
            rForm.photograph.push({
              fileId: res.data.data.basePersonnelInfo.personnelPhotoId,
              fileName: res.data.data.basePersonnelInfo.personnelPhotoName,
            });
             }
            // this.photograph =
            //   option.base_path +
            //   "fileUpDownload/download?pkId=" +
            //   res.data.data.basePersonnelInfo.personnelPhotoId +
            //   "&isDownload=false";
            //学历附件
            let stu = res.data.data.studyExperienceAttrList;
               if(stu.length!==0){
            stu.forEach((n) => {
              rForm.education.push({
                fileId: n.attId,
                fileName: n.naming,
              });
              // this.education =
              //   option.base_path +
              //   "fileUpDownload/download?pkId=" +
              //   n.attId +
              //   "&isDownload=false";
            });
               }else{
              this.education=""
            }
            //工作经历
            let work = res.data.data.workExperienceAttrList;
             if(work.length!==0){
            work.forEach((n) => {
              rForm.dimission.push({
                fileId: n.attId,
                fileName: n.naming,
              });
              // this.dimission =
              //   option.base_path +
              //   "fileUpDownload/download?pkId=" +
              //   n.attId +
              //   "&isDownload=false";
            });
             }else{
              this.dimission=""
            }
            //其他
            let other = res.data.data.otherAttrList;
            if(other.length!==0){
           other.forEach((n) => {
              rForm.otherAttrStr.push({
                fileId: n.attId,
                fileName: n.naming,
              });
              // this.otherAttrStr =
              //   option.base_path +
              //   "fileUpDownload/download?pkId=" +
              //   n.attId +
              //   "&isDownload=false";
            });
            }else{
              this.otherAttrStr=""
            }
            
            //个人特长
            this.personalSpecialtys = res.data.data.basePersonnelInfo.specialSkillListStr.split(
              ","
            );
            this.onability(this.personalSpecialtys);
            // let isTrue = false
            // this.personalSpecialtys.forEach(i=>{
            //   if(i === '6'){
            //     isTrue = true
            //   }
            // })
            // if (isTrue) {
            //   this.disvaluelast =true
            // } else {
            //   this.disvaluelast =false
            // }
            //this.personalSpecialty=res.data.data.basePersonnelInfo.specialSkillListStrName;
            console.log(this.formData, "res");
          }
        });
    },
    // 获取工号
    getWorkNum() {
      let that = this;
      axios
        .post(option.base_path + "manpower/personnel/getWorkNum")
        .then((res) => {
          if (this.ruleForm.realName != "") {
            if (res.data.flag == 0) {
              let szm = this.getFirstLetter(
                that.ruleForm.realName
              )[0].toString();
              let workNum = "";
              //获取工作性质
              let workState = that.ruleForm.workState;
              var workData = res.data.data;
              if (
                res.data == "" ||
                res.data == null ||
                res.data == "null" ||
                typeof res.data == "undefined"
              ) {
                workData = "0001";
              }
              //判断工作性质1在职2挂职3挂靠6实习
              if (workState == "2") {
                workNum = "91" + workData;
                that.formLabel="挂职时间："
              }
              if (workState == "3") {
                workNum = "92" + workData;
                 that.formLabel="挂靠时间："
              }
              if (workState == "0") {
                workNum = szm + workData;
                 that.formLabel="离职时间："
              }
              if(workState == "1"){
                 workNum = szm + workData;
                 that.formLabel="入职时间："
              }

              that.ruleForm.workNum = workNum.toString();
            }
          }
        });
    },
    //参数,中文字符串
    //返回值:拼音首字母串数组
    makePy(str) {
      if (typeof str != "string")
        throw new Error(-1, "函数makePy需要字符串类型参数!");
      var arrResult = new Array(); //保存中间结果的数组
      for (var i = 0, len = str.length; i < len; i++) {
        //获得unicode码
        var ch = str.charAt(i);
        //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
        arrResult.push(this.checkCh(ch));
      }
      //处理arrResult,返回所有可能的拼音首字母串数组
      return this.mkRslt(arrResult);
    },

    checkCh(ch) {
      var uni = ch.charCodeAt(0);
      //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
      if (uni > 40869 || uni < 19968) return ch; //dealWithOthers(ch);
      //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
      return this.oMultiDiff[uni]
        ? this.oMultiDiff[uni]
        : this.strChineseFirstPY.charAt(uni - 19968);
    },

    mkRslt(arr) {
      var arrRslt = [""];
      for (var i = 0, len = arr.length; i < len; i++) {
        var str = arr[i];
        var strlen = str.length;
        if (strlen == 1) {
          for (var k = 0; k < arrRslt.length; k++) {
            arrRslt[k] += str;
          }
        } else {
          var tmpArr = arrRslt.slice(0);
          arrRslt = [];
          for (k = 0; k < strlen; k++) {
            //复制一个相同的arrRslt
            var tmp = tmpArr.slice(0);
            //把当前字符str[k]添加到每个元素末尾
            for (var j = 0; j < tmp.length; j++) {
              tmp[j] += str.charAt(k);
            }
            //把复制并修改后的数组连接到arrRslt上
            arrRslt = arrRslt.concat(tmp);
          }
        }
      }
      return arrRslt;
    },
    /**
     * 生成与中文字符串相对映的拼音首字母串
     */
    getFirstLetter(letter) {
      // 汉字拼音首字母列表 本列表包含了20902个汉字,用于配合 ToChineseSpell
      //函数使用,本表收录的字符的Unicode编码范围为19968至40869, XDesigner 整理
      this.strChineseFirstPY =
        "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";

      //此处收录了375个多音字,数据来自于http://www.51window.net/page/pinyin
      this.oMultiDiff = {
        "19969": "DZ",
        "19975": "WM",
        "19988": "QJ",
        "20048": "YL",
        "20056": "SC",
        "20060": "NM",
        "20094": "QG",
        "20127": "QJ",
        "20167": "QC",
        "20193": "YG",
        "20250": "KH",
        "20256": "ZC",
        "20282": "SC",
        "20285": "QJG",
        "20291": "TD",
        "20314": "YD",
        "20340": "NE",
        "20375": "TD",
        "20389": "YJ",
        "20391": "CZ",
        "20415": "PB",
        "20446": "YS",
        "20447": "SQ",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20504": "TC",
        "20608": "KG",
        "20854": "QJ",
        "20857": "ZC",
        "20911": "PF",
        "20985": "AW",
        "21032": "PB",
        "21048": "XQ",
        "21049": "SC",
        "21089": "YS",
        "21119": "JC",
        "21242": "SB",
        "21273": "SC",
        "21305": "YP",
        "21306": "QO",
        "21330": "ZC",
        "21333": "SDC",
        "21345": "QK",
        "21378": "CA",
        "21397": "SC",
        "21414": "XS",
        "21442": "SC",
        "21477": "JG",
        "21480": "TD",
        "21484": "ZS",
        "21494": "YX",
        "21505": "YX",
        "21512": "HG",
        "21523": "XH",
        "21537": "PB",
        "21542": "PF",
        "21549": "KH",
        "21571": "E",
        "21574": "DA",
        "21588": "TD",
        "21589": "O",
        "21618": "ZC",
        "21621": "KHA",
        "21632": "ZJ",
        "21654": "KG",
        "21679": "LKG",
        "21683": "KH",
        "21710": "A",
        "21719": "YH",
        "21734": "WOE",
        "21769": "A",
        "21780": "WN",
        "21804": "XH",
        "21834": "A",
        "21899": "ZD",
        "21903": "RN",
        "21908": "WO",
        "21939": "ZC",
        "21956": "SA",
        "21964": "YA",
        "21970": "TD",
        "22003": "A",
        "22031": "JG",
        "22040": "XS",
        "22060": "ZC",
        "22066": "ZC",
        "22079": "MH",
        "22129": "XJ",
        "22179": "XA",
        "22237": "NJ",
        "22244": "TD",
        "22280": "JQ",
        "22300": "YH",
        "22313": "XW",
        "22331": "YQ",
        "22343": "YJ",
        "22351": "PH",
        "22395": "DC",
        "22412": "TD",
        "22484": "PB",
        "22500": "PB",
        "22534": "ZD",
        "22549": "DH",
        "22561": "PB",
        "22612": "TD",
        "22771": "KQ",
        "22831": "HB",
        "22841": "JG",
        "22855": "QJ",
        "22865": "XQ",
        "23013": "ML",
        "23081": "WM",
        "23487": "SX",
        "23558": "QJ",
        "23561": "YW",
        "23586": "YW",
        "23614": "YW",
        "23615": "SN",
        "23631": "PB",
        "23646": "ZS",
        "23663": "ZT",
        "23673": "YG",
        "23762": "TD",
        "23769": "ZS",
        "23780": "QJ",
        "23884": "QK",
        "24055": "XH",
        "24113": "DC",
        "24162": "ZC",
        "24191": "GA",
        "24273": "QJ",
        "24324": "NL",
        "24377": "TD",
        "24378": "QJ",
        "24439": "PF",
        "24554": "ZS",
        "24683": "TD",
        "24694": "WE",
        "24733": "LK",
        "24925": "TN",
        "25094": "ZG",
        "25100": "XQ",
        "25103": "XH",
        "25153": "PB",
        "25170": "PB",
        "25179": "KG",
        "25203": "PB",
        "25240": "ZS",
        "25282": "FB",
        "25303": "NA",
        "25324": "KG",
        "25341": "ZY",
        "25373": "WZ",
        "25375": "XJ",
        "25384": "A",
        "25457": "A",
        "25528": "SD",
        "25530": "SC",
        "25552": "TD",
        "25774": "ZC",
        "25874": "ZC",
        "26044": "YW",
        "26080": "WM",
        "26292": "PB",
        "26333": "PB",
        "26355": "ZY",
        "26366": "CZ",
        "26397": "ZC",
        "26399": "QJ",
        "26415": "ZS",
        "26451": "SB",
        "26526": "ZC",
        "26552": "JG",
        "26561": "TD",
        "26588": "JG",
        "26597": "CZ",
        "26629": "ZS",
        "26638": "YL",
        "26646": "XQ",
        "26653": "KG",
        "26657": "XJ",
        "26727": "HG",
        "26894": "ZC",
        "26937": "ZS",
        "26946": "ZC",
        "26999": "KJ",
        "27099": "KJ",
        "27449": "YQ",
        "27481": "XS",
        "27542": "ZS",
        "27663": "ZS",
        "27748": "TS",
        "27784": "SC",
        "27788": "ZD",
        "27795": "TD",
        "27812": "O",
        "27850": "PB",
        "27852": "MB",
        "27895": "SL",
        "27898": "PL",
        "27973": "QJ",
        "27981": "KH",
        "27986": "HX",
        "27994": "XJ",
        "28044": "YC",
        "28065": "WG",
        "28177": "SM",
        "28267": "QJ",
        "28291": "KH",
        "28337": "ZQ",
        "28463": "TL",
        "28548": "DC",
        "28601": "TD",
        "28689": "PB",
        "28805": "JG",
        "28820": "QG",
        "28846": "PB",
        "28952": "TD",
        "28975": "ZC",
        "29100": "A",
        "29325": "QJ",
        "29575": "SL",
        "29602": "FB",
        "30010": "TD",
        "30044": "CX",
        "30058": "PF",
        "30091": "YSP",
        "30111": "YN",
        "30229": "XJ",
        "30427": "SC",
        "30465": "SX",
        "30631": "YQ",
        "30655": "QJ",
        "30684": "QJG",
        "30707": "SD",
        "30729": "XH",
        "30796": "LG",
        "30917": "PB",
        "31074": "NM",
        "31085": "JZ",
        "31109": "SC",
        "31181": "ZC",
        "31192": "MLB",
        "31293": "JQ",
        "31400": "YX",
        "31584": "YJ",
        "31896": "ZN",
        "31909": "ZY",
        "31995": "XJ",
        "32321": "PF",
        "32327": "ZY",
        "32418": "HG",
        "32420": "XQ",
        "32421": "HG",
        "32438": "LG",
        "32473": "GJ",
        "32488": "TD",
        "32521": "QJ",
        "32527": "PB",
        "32562": "ZSQ",
        "32564": "JZ",
        "32735": "ZD",
        "32793": "PB",
        "33071": "PF",
        "33098": "XL",
        "33100": "YA",
        "33152": "PB",
        "33261": "CX",
        "33324": "BP",
        "33333": "TD",
        "33406": "YA",
        "33426": "WM",
        "33432": "PB",
        "33445": "JG",
        "33486": "ZN",
        "33493": "TS",
        "33507": "QJ",
        "33540": "QJ",
        "33544": "ZC",
        "33564": "XQ",
        "33617": "YT",
        "33632": "QJ",
        "33636": "XH",
        "33637": "YX",
        "33694": "WG",
        "33705": "PF",
        "33728": "YW",
        "33882": "SR",
        "34067": "WM",
        "34074": "YW",
        "34121": "QJ",
        "34255": "ZC",
        "34259": "XL",
        "34425": "JH",
        "34430": "XH",
        "34485": "KH",
        "34503": "YS",
        "34532": "HG",
        "34552": "XS",
        "34558": "YE",
        "34593": "ZL",
        "34660": "YQ",
        "34892": "XH",
        "34928": "SC",
        "34999": "QJ",
        "35048": "PB",
        "35059": "SC",
        "35098": "ZC",
        "35203": "TQ",
        "35265": "JX",
        "35299": "JX",
        "35782": "SZ",
        "35828": "YS",
        "35830": "E",
        "35843": "TD",
        "35895": "YG",
        "35977": "MH",
        "36158": "JG",
        "36228": "QJ",
        "36426": "XQ",
        "36466": "DC",
        "36710": "JC",
        "36711": "ZYG",
        "36767": "PB",
        "36866": "SK",
        "36951": "YW",
        "37034": "YX",
        "37063": "XH",
        "37218": "ZC",
        "37325": "ZC",
        "38063": "PB",
        "38079": "TD",
        "38085": "QY",
        "38107": "DC",
        "38116": "TD",
        "38123": "YD",
        "38224": "HG",
        "38241": "XTC",
        "38271": "ZC",
        "38415": "YE",
        "38426": "KH",
        "38461": "YD",
        "38463": "AE",
        "38466": "PB",
        "38477": "XJ",
        "38518": "YT",
        "38551": "WK",
        "38585": "ZC",
        "38704": "XS",
        "38739": "LJ",
        "38761": "GJ",
        "38808": "SQ",
        "39048": "JG",
        "39049": "XJ",
        "39052": "HG",
        "39076": "CZ",
        "39271": "XT",
        "39534": "TD",
        "39552": "TD",
        "39584": "PB",
        "39647": "SB",
        "39730": "LG",
        "39748": "TPB",
        "40109": "ZQ",
        "40479": "ND",
        "40516": "HG",
        "40536": "HG",
        "40583": "QJ",
        "40765": "YQ",
        "40784": "QJ",
        "40840": "YK",
        "40863": "QJG",
      };
      var str = letter.trim().substring(0, 1);

      if (str == "") return;
      var arrRslt = this.makePy(str);
      return arrRslt;
    },
  },
};
</script>
<style scoped>
.readTxt {
  color: gray;
  font-weight: 500;
  font-size: 12px;
}
.el-icon-plus {
  width: 100%;
  text-align: center;
}
.wenjian {
  margin-bottom: 10px;
}
.yt-read-text {
  color: #003465;
  font-weight: bold;
}
.addgo {
  font-size: 32px;
  position: relative;
  cursor: pointer;
}
.jian {
  position: relative;
  left: 11px;
}
 /* @media screen and (max-width: 1316px) {
.empartyDate,
.empartyPlace,
.workHoursDate{
  width: 100%;
}
} */
/* @media screen and (min-width: 1317px) {
.empartyDate,
.empartyPlace,
.workHoursDate{
  width: 84%;
}
}  */


</style>
<style>
/* .hide .el-upload--picture-card {
  display: none;
} */
.el-upload {
  text-align: center;
}
.hide .el-upload--picture-card {
  display: none;
}
.hide2 .el-upload-list__item-delete .el-icon-delete{
    /* visibility: hidden; */
     display: none;
    
}
</style>
