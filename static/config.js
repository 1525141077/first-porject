export var option = {
	base_path:'http://192.168.1.164:8082/projectDb/',//http://jsh.yitian-tech.com:9998/projectDb/
	base_path:'http://jsh.yitian-tech.com:9998/projectDb/',//http://jsh.yitian-tech.com:9998/projectDb/
	//base_path:'http://192.168.1.120:8080/projectDb/',//http://jsh.yitian-tech.com:9998/projectDb/
	websit_path:'http://192.168.1.151:8020/webCriterion/website/',//前台文件路径
	websit_ip:'http://192.168.1.151:3333/',//前台ip地址
	workFlow: 'http://jsh.yitian-tech.com:48385/ims-act/', // 工作流请求配置
	//前端首页
	// websit_index: $websit_path + 'index.html',
	logoutUrl: 'http://jsh.yitian-tech.com:9998/projectDb/login/toLogout?logoutUrl=http://jsh.yitian-tech.com:9100/ims-cas/logout?service=http://jsh.yitian-tech.com:9998/projectDb/index.jsp',
	//logoutUrl: 'http://192.168.1.120:8080/projectDb/login/toLogout?logoutUrl=http://jsh.yitian-tech.com:9100/ims-cas/logout?service=http://192.168.1.120:8080/projectDb/index.jsp',
	//menu_path:'http://192.168.1.63:9000/ims/index/getChildMenusByUserToTreeMap',//左侧菜单数据配置参数json为静态资源数据,可改为接口
	//menu_path: 'http://192.168.1.151:3333/json/menuData.json',
	menu_path: 'http://jsh.yitian-tech.com:9998/projectDb/index/getChildMenusByUserToTreeMap',
	// parent_action_path: $yt_themeCss_path + 'parentAction.html',
	systemCode:'',//系统code
	is_origin: true,
	ytAclCookieKey: 'yitianSSODynamicKey'
}