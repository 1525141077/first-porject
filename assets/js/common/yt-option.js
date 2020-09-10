/**
 * base_path : 接口访问路径
 * 
 * websit_path : 前端服务路径
 * 
 * 
 * menu_data:一级菜单 数据
 * 
 * 
 * menu_data_two:二级菜单数据
 * 
 * 
 * is_origin:是否是跨域访问 true/false
 * 
 */
var $yt_option = {
	/*项目路径*/
	base_path: 'http://coso.yitian-tech.com:5656/coso/',
	base_rll_path: 'http://coso.yitian-tech.com:5656/coso-rll/',//风险库项目后台访问地址
	websit_path: 'http://localhost:8020/coso/website/',
	websit_rll_path: 'http://localhost:8020/coso-rll/website/',//风险库项目前台访问地址
	websit_index: 'http://localhost:8020/coso/website/index.html',
	workFlow: 'http://coso.yitian-tech.com:6002/coso-act/restful/workFlow/', //工作流请求配置
	indexUrl: '', //点击首页跳转地址配置
	logoutUrl: 'http://coso.yitian-tech.com:5656/coso/login/toLogout?logoutUrl=http://coso.yitian-tech.com:6001/coso-cas/logout?service=http://coso.yitian-tech.com:5656/coso/website/index.html',
	//menu_path:'http://192.168.1.50:8020/coso/website/resources/js/common/menuDataTest.json',//左侧菜单数据配置参数json为静态资源数据,可改为接口
	menu_path: 'http://coso.yitian-tech.com:5656/coso/index/getChildMenusByUserToTreeMap',
	version_code: '2018010801', //资源文件版本号配置参数
	parent_action_path: 'http://localhost:8020/coso/website/parentAction.html', //父级页面地址
	is_origin: true
}		
