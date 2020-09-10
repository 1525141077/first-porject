import { allHeight } from '../../../../common/yt-common.js'
import {
    serveApi
} from '../../../../../../service/paths.js';
export default {
    data() {
        return {
            //左菜单高度方法值
            publicHeight: allHeight.getHeight(),
            form: {
                name: '',
                region: '',
                startData: '',
                startMoney: '',
                endMoney: ''
            },
            labelPosition: 'right',
            tableData: []
        }
    },
    mounted() {
        // allHeight.getHeight();
        this.myApplicationAppInfo();
    },
    created() { },
    methods: {
        resetForm(form) {
            this.$refs[form].resetFields();
        },
        //获取左菜单数据
        myApplicationAppInfo: function () {
            var me = this;
            //调用axios.get方法
            //"CASPARAMS":"OFF_INDEX"
            serveApi.myApplicationAppInfo({
                startDate: '',
                endDate: '',
                queryParams: '',
                formType: '',
                startAmount: '',
                endAmount: '',
                pageIndex: 1,
                pageNum: 15,
            })
                .then(function (data) {
                    //赋值全局变量数据
                    me.tableData = data.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
}