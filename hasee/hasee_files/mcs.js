/////////////////////////////constant////////////////////////////////////

/**
 * 第三方参数(CRM/用户标识/配置)
 * @type {Object}
 */
var jiaxinThirdJson = {
    // crm:{},
    // session:{},
    // cid:"",
    // setting:{}
};
var jiaxinPreInitWindow = false;

/**
 * 消息类型
 * @type {Object}
 */
var NOTIFY_TYPE = {
    REQUEST: 1,
    QUEUE: 2,
    AGENT: 3,
    ROBOT: 4,
    TRANSFERED: 5,
    END: 6,
    REC_MSG: 7,
    SESS_INFO: 8,
    SEND_MSG: 9,
    DEPART_SESSION: 10,
    CONNECT: 11,
    SATISFY: 12,
    MSG_CENTER: 13
}
/**
 * 系统提示
 * @type {Object}
 */
var JIAXIN_VISITOR_TEXT = {
    REQUEST_ERROR: "请求不可用",
    INIT_DATA_ERROR: "获取初始化数据失败[1]",
    INIT_DATA_ERROR2: "获取初始化数据失败[2]",
    INIT_CONFIG_ERROR: "获取配置数据失败"
}
/**
 * 中文文本
 * @type {Object}
 */
var JIAXIN_TEXT_CN = {
    NOTIFICATION: "消息提醒",
    NEW_MESSAGE: "【您有新消息】",
    NEW_LEAVE_MESSAGE: "【您有新留言】",
    UNREAD_LEAVE_MESSAGE: "您有未读留言,请到消息箱查看",
    BTN_TEXT: "立即咨询"
}
/**
 * 英文文本
 * @type {Object}
 */
var JIAXIN_TEXT_EN = {
    NOTIFICATION: "Notifications",
    NEW_MESSAGE: "【New message】",
    NEW_LEAVE_MESSAGE: "【New Leave Message】",
    UNREAD_LEAVE_MESSAGE: "You have unread message, please check the message center",
    BTN_TEXT: "Consult now"
}
var JIAXIN_TEXT = JIAXIN_TEXT_CN;

/**
 * 终端的类型
 * @type {Object}
 */
var JIAXIN_DIALOG_MODE = {
    MULTI_CHAT: 2,
    NEW_WINDOW: 1,
    DIV: 0
}
/**
 * 终端的类型
 * @type {Object}
 */
var JIAXIN_TERMINAL_TYPE = {
    PC: 0,
    MOBILE: 1
}
/**
 * 返回结果
 * @type {Object}
 */
var JIAXIN_OPT_RESULT = {
    SUCCESS: 0,
    ERROR: 1
}

/////////////////////////////access////////////////////////////////////
// value
var jiaxinOriginalTitle = document.title;
var jiaxinLocationHref = window.location.href;
// status 
var jiaxinWindow = null;
var jiaxinTitleTimer = null;
var envPath = "";
var smallIframe = null;
var jumping = null;
var url = "";
var jiaxinMcsConfig = {
    // jiaxinBoot Params
    jiaxinUrl: "",
    json: {
        orgName: "",
        appName: "",
        appChannel: ""
    },
    jiaxinDomain: "",
    quoteUrl: "",
    isDevMode: false,
    isOnekey: false,
    // jiaxinAddUrlParams
    jiaxinSearchReferrer: "",
    thirdOpenId: "",
    thirdAppId: "",
    // jiaxinSetCustomId 
    thirdPartyId: "",
    unReadNum: 0,
    jiaxinIframeLoaded: false,
    // jiaxinGetEnvVersion
    env: '',
    // jiaxinTogglerDiv
    thirdLucencyData: "",
    // jiaxinSetAppChannel
    appChannel: null,
    // jiaxinProduct
    productData: null,
    // jiaxinAppendStyleParams
    lang: "cn",
    printlog: false,
    visited: false,
    robotSatisfy: "",
    newWindowOpen:false
};

// jiaxinCreatePanel
var jiaxinMcsFixedBtn = null;
var jiaxinMcsFixedDialog = null;
var FixedBtnStyle = null;
var FixedDialogStyle = null;
var FixDialogWidth = null;
// 记录是否点击最小化按钮
var jiaxinMinimize = false;

/**
 * 入口函数
 */
(function() {
    jiaxinBoot("mcs.js");
    jiaxinAddUrlParams();
    jiaxinCreatePanel(jiaxinMcsConfig);
    jiaxinGetInitData();
    if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', jiaxinMcsMessageHandler, false);
    } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', jiaxinMcsMessageHandler);
    }
})();


/////////////////////////////request data////////////////////////////////////
/**
 * 拼接URL基础参数
 * @return {String} [基础参数]
 */
function jiaxinJoinBaseParams() {
    var params = "";
    if (jiaxinMcsConfig.json.id) {
        params += "&orgName=" + jiaxinMcsConfig.json.id;
    }
    if (jiaxinMcsConfig.json.appName) {
        params += "&appName=" + jiaxinMcsConfig.json.appName;
    }
    if (jiaxinMcsConfig.appChannel) {
        jiaxinMcsConfig.json.appChannel = jiaxinMcsConfig.appChannel;
    }
    if (jiaxinMcsConfig.json.appChannel) {
        params += "&appChannel=" + jiaxinMcsConfig.json.appChannel;
    }
    if(jiaxinMcsConfig.json.thirdTerminal){
    	params += "&thirdTerminal=" + jiaxinMcsConfig.json.thirdTerminal;
    }
    if (jiaxinMcsConfig.quoteUrl) {
        params += "&quoteUrl=" + jiaxinMcsConfig.quoteUrl;
    }
    if (jiaxinMcsConfig.isDevMode) {
        params += "&devMode=" + jiaxinMcsConfig.isDevMode;
    }
    if (jiaxinMcsConfig.printlog) {
    	params += "&print=" + jiaxinMcsConfig.printlog;
    }
    if (jiaxinMcsConfig.robotSatisfy) {
    	params += "&robotSatisfy=" + jiaxinMcsConfig.robotSatisfy;
    }
    //自动发起视频
    if (jiaxinMcsConfig.autoVideo) {
        params += "&autoVideo=" + jiaxinMcsConfig.autoVideo;
    }
     if (jiaxinMcsConfig.ishq) {
        params += "&ishq=" + jiaxinMcsConfig.ishq;
    }
    return params;
}
/**
 * 拼接URL样式参数
 * @return {String} [样式参数]
 */
function jiaxinJoinStyleParams() {
    var params = "";
    if (jiaxinMcsConfig.bg) {
        params += "&bg=" + jiaxinMcsConfig.bg;
    }
    if (jiaxinMcsConfig.dialogLogo) {
        params += "&dialogLogo=" + jiaxinMcsConfig.dialogLogo;
    }
    if (jiaxinMcsConfig.dialogType) {
        params += "&dialogType=" + jiaxinMcsConfig.dialogType;
    }
    if (jiaxinMcsConfig.mode) {
        params += "&dialogMode=" + jiaxinMcsConfig.mode;
    }
    if (jiaxinMcsConfig.lang) {
        params += "&lang=" + jiaxinMcsConfig.lang;
    }
    if (jiaxinMcsConfig.privateType) {
        params += "&privateType=" + jiaxinMcsConfig.privateType;
    }

    if (jiaxinMcsConfig.blinkTitle) {
        params += "&blinkTitle=" + jiaxinMcsConfig.blinkTitle;
    }

    if (FixDialogWidth && jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.DIV ) {
        params += "&FixDialogWidth=" + FixDialogWidth;
    }
    
    if(jiaxinMcsConfig.bgColor){
    	params += "&bgColor=" + jiaxinMcsConfig.bgColor;
    }
    
    if(jiaxinMcsConfig.fzColor){
    	params += "&fzColor=" + jiaxinMcsConfig.fzColor;
    }

    return params;
}
/**
 * 拼接URL第三方配置参数
 * @return {String} [配置参数]
 */
function jiaxinJoinThridParam() {
    var params = "";
    if (jiaxinMcsConfig.thirdPartyId) {
        params += "&thirdPartyId=" + jiaxinMcsConfig.thirdPartyId;
    }
    if (jiaxinMcsConfig.thirdOpenId) {
        params += "&thirdOpenId=" + jiaxinMcsConfig.thirdOpenId;
    }
    if (jiaxinMcsConfig.thirdLucencyData) {
        params += "&thirdExtendData=" + encodeURIComponent(jiaxinMcsConfig.thirdLucencyData);
    }
    if (jiaxinMcsConfig.thirdUsername) {
        params += "&thirdUsername=" + jiaxinMcsConfig.thirdUsername;
    }
    if (jiaxinMcsConfig.thirdPassword) {
        params += "&thirdPassword=" + jiaxinMcsConfig.thirdPassword;
    }
    if (jiaxinMcsConfig.onlyshow == true) {
        params += "&onlyshow=" + jiaxinMcsConfig.onlyshow;
    }
    if (jiaxinThirdJson) {
        params += "&thirdJson=" + encodeURIComponent(encodeURIComponent(JSON.stringify(jiaxinThirdJson)));
    }
    return params;
}
/**
 * 拼接URL商品参数
 * @return {String} [商品参数]
 */
function jiaxinJoinProductParam() {
    var params = "";
    if (jiaxinMcsConfig.productData) {
        params += "&product=" + encodeURIComponent(JSON.stringify(jiaxinMcsConfig.productData));
    }    
    if (jiaxinMcsConfig.advertData) {
        params += "&advert=" + encodeURIComponent(JSON.stringify(jiaxinMcsConfig.advertData));
    }
    
    return params;
}
/**
 * 兼容IE8的Ajax封装函数
 * @param  {Object} opt                 [请求参数]
 * @param  {Boolean} forceXDomainRequest [强制使用IE8请求]
 */
function jiaxinAjax(opt, forceXDomainRequest) {
    var xmlHttp = null;
    var xmlHttpType = null;
    var seed = new Date().getTime();
    opt = opt || {};
    opt.method = opt.method.toUpperCase();
    if(opt.method == "GET"){
        opt.url = opt.url+"&seed="+seed || '';
    }else{
        opt.url = opt.url || '';
    }
    opt.async = opt.async || true;
    opt.success = opt.success || function () {};
    opt.error = opt.error || function () {};
    opt.args  =  opt.args || null;
    
    if(window.XMLHttpRequest && !forceXDomainRequest) {
        xmlHttp = new XMLHttpRequest();
        xmlHttpType = "XMLHttpRequest";
    }else if(window.XDomainRequest){
        xmlHttp = new XDomainRequest();
        xmlHttpType = "XDomainRequest";
    }
    if(xmlHttpType == "XDomainRequest"){
        xmlHttp.onload = function(){
            opt.success(xmlHttp.responseText);
        }
        xmlHttp.onerror = function(){
            opt.error();
        }
        xmlHttp.open(opt.method, opt.url);
        if(!opt.args){
            xmlHttp.send();
        }else{
            xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded;charset=UTF-8");
            xmlHttp.send(opt.args);
        }
    }else if(xmlHttpType = "XMLHttpRequest"){
    	try {
            xmlHttp.open(opt.method, opt.url, opt.async);
            if(!opt.args){
                xmlHttp.send();
            }else{
                xmlHttp.setRequestHeader("CONTENT-TYPE","application/x-www-form-urlencoded;charset=UTF-8");
                xmlHttp.send(opt.args);
            }
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    opt.success(xmlHttp.responseText);
                }
            }
    	} catch (e) {
    		jiaxinAjax(opt, true);
    	}
    }else{
        opt.error();
    }
}
/**
 * JSON解析
 * @param  {String} response [需要解析的res]
 * @return {Oject}           [解析完成的JSON]
 */
function jiaxinParse(response) {
    var res;    
    if (typeof(JSON) == 'undefined'){   
         res = eval("("+response+")");    
    }else{  
         res = JSON.parse(response); 
    } 
    return res;
}

/**
 * 获取初始化数据
 * @param  {Function} cb [回调参数]
 */
function jiaxinGetInitData(cb) {
    var configUrl = jiaxinMcsConfig.jiaxinDomain + 'rest/webaccess/getConfigForMcs?orgName=' + jiaxinMcsConfig.json.id;
    jiaxinAjax({
        method: 'GET',
        url: configUrl,
        async: true,
        success: function (response) {
            var envData = jiaxinParse(response);
            jiaxinMcsConfig.env = envData.receipt.env;
            if (!jiaxinMcsConfig.isDevMode) {
                envPath = jiaxinMcsConfig.env + "/";
            }
            var initUrl = jiaxinMcsConfig.jiaxinDomain + envPath + "rest/user/init?currentDevice=" + jiaxinGetCurrentDevice() + jiaxinJoinBaseParams();
            jiaxinAjax({
                method: 'GET',
                url: initUrl,
                async: true,
                success: function (response) {
                	var flag;
                    var jiaxinInitJson =  jiaxinParse(response);
                    if(vl(jiaxinInitJson.data.domainNames)){
                    	flag = false;
                    	var domainNameList = jiaxinInitJson.data.domainNames;
                    	for(var i=0;i<domainNameList.length;i++){
                    		if(window.location.hostname==domainNameList[i]){
                    			flag = true;
                    			break;
                    		}
                    	}
                    }else{
                    	flag = true;
                    }
                    if(flag){
                	 	jiaxinAppendStyleParams(jiaxinInitJson.data)
	                    jiaxinInitStyle(jiaxinInitJson.data);
	                    jiaxinMcsConfig.blinkTitle = jiaxinInitJson.data.blinkTitle;
	                    jiaxinMcsConfig.autoInvite = jiaxinInitJson.data.autoInvite;
	                    //防止微信端多次跳转获取openid
	                    if(!isWeiXinBrowser()){
	                        jiaxinSetUrlOfIframeAfter2();
	                    }
	                    //获取未读留言的数量
	                    jiaxinGetUnreadCount();
	                    //对于微信授权验证成功之后过来，需要主动打开聊天窗口
	                    if ( jiaxinLocationHref.indexOf("appid") >= 0 ) {
	                        if(jiaxinLocationHref.indexOf("jxopenid") >= 0 || jiaxinMcsConfig.wechat){
	                            jiaxinTogglerDiv();
	                        }
	                    }
	                    //自动打开页面
	                    if(jiaxinLocationHref.indexOf("appid") < 0 && jiaxinMcsConfig.autoOpen){
	                    		jiaxinTogglerDiv();
	                    }
	                    if (jiaxinMcsConfig.isOnekey === true && (jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.NEW_WINDOW || jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.MULTI_CHAT) ) {
	                        window.location = jiaxinGetUrl(true);
	                    }
	                    //标题闪烁
	                    if(jiaxinMcsConfig.blinkTitle){
	                        window.onfocus = jiaxinStopTitle;
	                        window.onmouseenter =jiaxinStopTitle;
	                    }
	                    if( jiaxinMcsConfig.autoInvite == 1 && !jiaxinMobileClient()){
	                        autoInvite(jiaxinInitJson.data);
	                    }
	                    if(cb){
	                      cb(JIAXIN_OPT_RESULT.SUCCESS, response);
	                    }
                    }
                },
                error: function(response){
                }
            });
        },
        error: function(response){
        }
    });

   
}

/**
 * 获取版本信息
 * @param  {Function} cb [回调函数]
 */
function jiaxinGetEnvVersion(cb) {
    url = jiaxinMcsConfig.jiaxinDomain + 'rest/webaccess/getConfigForMcs?orgName=' + jiaxinMcsConfig.json.id;
    jiaxinAjax({
        method: 'GET',
        url: url,
        async: true,
        success: function (response) {
              cb(JIAXIN_OPT_RESULT.SUCCESS, response);
        },
        error: function(response){
        }
    });
}

/////////////////////////////logic////////////////////////////////////

/**
 * 获取初始URL中的参数
 * @param  {String} key [文件名]
 */
function jiaxinBoot(key) {
    
    var scripts = document.scripts;
    var scriptsLen = scripts.length;
    var jiaxinUrl0 = '';
    for ( var i = 0; i < scriptsLen; i++) {
        if (scripts[i].src.indexOf(key) > 0) {
            jiaxinUrl0 = scripts[i].src;
        }
    }
    if(!jiaxinUrl0){
        jiaxinUrl0 = jiaxinLocationHref;
    }

    var params = {};
    var jiaxinDomain0 = "";
    if (jiaxinUrl0) {
        var idx = jiaxinUrl0.indexOf("?");
        params.src = jiaxinUrl0.slice(0, idx);

        var paramsInUrl = jiaxinUrl0.slice(idx + 1).split("&");
        for (var i = 0, l = paramsInUrl.length; l > i; i++) {
            var tmp = paramsInUrl[i].split("=");
            params[tmp[0]] = tmp.length > 1 ? tmp[1] : "";
            if(tmp[1] == 'true'){
                if (tmp[0] == 'devMode') {
                    jiaxinMcsConfig.isDevMode = true;
                }
                if (tmp[0] == 'onekey') {
                    jiaxinMcsConfig.isOnekey = true;
                }
                if (tmp[0] == 'printlog') {
                    jiaxinMcsConfig.printlog = true;
                }
                if (tmp[0] == 'wechat') {
                    jiaxinMcsConfig.wechat = true;
                }
                if (tmp[0] == 'autoOpen') {
                    jiaxinMcsConfig.autoOpen = true;
                }
                //自动发起视频
                if (tmp[0] == 'autoVideo') {
                    jiaxinMcsConfig.autoVideo = true;
                }
               //从js获取ishq
                if (tmp[0] == 'ishq') {
                    jiaxinMcsConfig.ishq = true;
                }
				//强制新窗口打开
                if (tmp[0] == 'newWindowOpen') {
                    jiaxinMcsConfig.newWindowOpen = true;
                }
            }
            if (tmp[0] == 'bgColor') {
                jiaxinMcsConfig.bgColor = tmp[1];
            }
            if (tmp[0] == 'fzColor') {
                jiaxinMcsConfig.fzColor = tmp[1];
            }
        }

        if (jiaxinUrl0.split(key).length > 1) {
            jiaxinDomain0 = jiaxinUrl0.split(key)[0];
        } else {
            jiaxinDomain0 = jiaxinUrl0.split("/index")[0];
        }
    }

    jiaxinMcsConfig.jiaxinUrl = jiaxinUrl0;
    jiaxinMcsConfig.json = params;
    jiaxinMcsConfig.jiaxinDomain = jiaxinDomain0;
    jiaxinMcsConfig.quoteUrl = window.location.origin;

    if (!jiaxinMcsConfig.quoteUrl) {
      jiaxinMcsConfig.quoteUrl = window.location.protocol + "//" 
        + window.location.hostname 
        + (window.location.port ? ':' + window.location.port : '');
    }
}

/**
 * 获取数据来源
 */
function jiaxinAddUrlParams() {    
    jiaxinMcsConfig.thirdOpenId = jiaxinGetQueryString("jxopenid");
    jiaxinMcsConfig.thirdAppId = jiaxinGetQueryString("appid");
    jiaxinMcsConfig.robotSatisfy = jiaxinGetQueryString("robotSatisfy");
}
/**
 * 获取界面参数
 */
function jiaxinAppendStyleParams(jiaxinStyleJson) {
    if (jiaxinStyleJson.lang) {
        jiaxinMcsConfig.lang = jiaxinStyleJson.lang; //语言
    }
    JIAXIN_TEXT = (jiaxinMcsConfig.lang == 'cn')? JIAXIN_TEXT_CN : JIAXIN_TEXT_EN;
    jiaxinMcsConfig.mode = jiaxinStyleJson.DialogMode; //窗口类型（新窗口/当前页面）
    jiaxinMcsConfig.dialogType = jiaxinStyleJson.DialogType; //窗口模式
    jiaxinMcsConfig.btnType = jiaxinStyleJson.type; //按钮类型
    jiaxinMcsConfig.bg = jiaxinStyleJson.DialogBgcolor;
    jiaxinMcsConfig.dialogLogo = jiaxinStyleJson.DialogLogo;
    jiaxinMcsConfig.privateType = jiaxinStyleJson.privateType;
}
/**
 * 获取来源数据
 * @return {String} [来源信息]
 */
function jiaxinGetSearchReferrer() {
    var refer = '';
    var sosuo = '';
    var grep = '';
    var str = '';
    var keyword = '';
    try {
        refer = document.referrer;
        if (refer) {
            sosuo = refer.split(".")[1];
            switch (sosuo) {
                case "baidu":
                    grep = /wd\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "google":
                    grep = /wd\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "sogou":
                    grep = /query\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "soso":
                    sosuo = "other";
                    grep = /query\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "bing":
                    sosuo = "other";
                    grep = /q\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "yahoo":
                    sosuo = "other";
                    grep = /p\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                case "so":
                    sosuo = "other";
                    grep = /q\=.*/i;
                    str = refer.match(grep)
                    if (str) {
                        str = str[0];
                        keyword = str.split("=")[1].split("&")[0];
                    }
                    break;
                default:
                    sosuo = '';
            }
        }
    } catch (e) {

    }

    keyword = encodeURIComponent(keyword);

    if (refer) {
        if (sosuo) {
            jiaxinSetCookie('com.jiaxincloud.mcs.cookie.engine', sosuo);
            jiaxinSetCookie('com.jiaxincloud.mcs.cookie.engineKey', keyword);
        } else {
            sosuo = jiaxinGetCookie('com.jiaxincloud.mcs.cookie.engine');
            keyword = jiaxinGetCookie('com.jiaxincloud.mcs.cookie.engineKey');
        }

    } else {
        jiaxinSetCookie('com.jiaxincloud.mcs.cookie.engine', '');
        jiaxinSetCookie('com.jiaxincloud.mcs.cookie.engineKey', '');
    }

    var pageUrl = '';
    var pageTitle = '';

    try {
        pageUrl = encodeURIComponent(encodeURIComponent(jiaxinLocationHref.substring(0, 500)));
        if(jiaxinThirdJson && jiaxinThirdJson.session && jiaxinThirdJson.session.pageTitle) {
        	pageTitle = encodeURIComponent(encodeURIComponent(jiaxinThirdJson.session.pageTitle));
        } else {
        	pageTitle = encodeURIComponent(encodeURIComponent(jiaxinOriginalTitle));
        }
    } catch (e) {

    }
    var v = "";
    if(sosuo) {
    	v = v + '&engine=' + sosuo;
    }
    if(keyword) {
    	v = v + '&engineKey=' + keyword;
    }
    if(pageTitle) {
    	v = v + '&pageTitle=' + pageTitle;
    }
    if(pageUrl) {
    	v = v + '&pageUrl=' + pageUrl;
    }
    return v;
}
/**
 * 订阅-发布 函数
 */
function JiaxinCallback() {
    this.handlers = {};
}

JiaxinCallback.prototype = {
    // 订阅事件
    on: function(eventType, handler) {
        var self = this;
        if (!(eventType in self.handlers)) {
            self.handlers[eventType] = [];
        }
        self.handlers[eventType].push(handler);
        return this;
    },
    // 发布事件
    emit: function(eventType) {
        var self = this;
        var handlerArgs = Array.prototype.slice.call(arguments, 1);
        if( self.handlers[eventType]){
            for (var i = 0; i < self.handlers[eventType].length; i++) {
            self.handlers[eventType][i].apply(self, handlerArgs);
          }
        }
        return self;
    },
    // 删除订阅事件
    off: function(eventType, handler) {
        var currentEvent = this.handlers[eventType];
        var len = 0;
        if (currentEvent) {
            len = currentEvent.length;
            for (var i = len - 1; i >= 0; i--) {
                if (currentEvent[i] === handler) {
                    currentEvent.splice(i, 1);
                }
            }
        }
        return this;
    }
};

var jiaxinCallback = new JiaxinCallback();

/**
 * 处理佳信客服postMessage的消息
 * @param  {e} e [postMessage事件参数]
 */
function jiaxinMcsMessageHandler(e) {
    if (jiaxinMcsConfig.jiaxinUrl.indexOf((e.origin).split('://')[1]) < 0) {
        return;
    }

    if ("togglerDiv" == e.data) {
        jiaxinTogglerDiv();
        jiaxinMinimize = true;
        //微信浏览器调用关闭
        if(isWeiXinBrowser()){
        	try{
        		WsCloseWindow();	
        	}catch(e){
        		
        	}
        }
    } else if ("visitorSendMsg" == e.data) {
        jiaxinSetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie', true);
    } else if ("initIframe" == e.data) {
        jiaxinClearUrlOfIframe();
        jiaxinTogglerDiv();
        jiaxinSetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie', '');
        jiaxinMinimize = false;
        //微信浏览器调用关闭
        if(isWeiXinBrowser()){
       		try{
        		WsCloseWindow();	
        	}catch(e){
        		
        	}	
        }
    } else if ("messageTips" == e.data) {
        if (!jiaxinMobileClient() && isHidden()) {
            jiaxinStopTitle();
            jiaxinShowTitle("msg");
        }
        if (jiaxinMcsFixedBtn.innerHTML == '') {
            return;
        }
        if (jiaxinButtonShowed()) {
            var jiaxinMcsBadge = document.getElementById("jiaxin-mcs-badge");
            jiaxinMcsConfig.unReadNum = jiaxinMcsConfig.unReadNum + 1;
            if (jiaxinMcsBadge) {
                jiaxinMcsBadge.innerHTML = jiaxinMcsConfig.unReadNum;

                if (jiaxinMcsConfig.unReadNum == 1) {
                    jiaxinMcsBadge.style.display = "block";
                }
            } else {
                jiaxinMcsConfig.unReadNum = 1;
                var jiaxinMcsBadgePos = '';
                if (jiaxinMcsConfig.btnType == 1) {
                    jiaxinMcsBadgePos = 'right: 0';
                } else if (jiaxinMcsConfig.btnType == 2) {
                    jiaxinMcsBadgePos = 'left: 30px';
                }
                jiaxinMcsFixedBtn.innerHTML = '<p id="jiaxin-mcs-badge" style="' + jiaxinMcsBadgePos + '">1</p>' + jiaxinMcsFixedBtn.innerHTML;
            }
        }
        jiaxinSetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie', true);
    } else if( "videoBig" == e.data ){
        FixedDialogStyle.width = (parseInt(FixDialogWidth)+565)+"px"
    }else if( "videoSmall" == e.data ){
        FixedDialogStyle.width = FixDialogWidth;
    }else {
        var jiaxinInitJson = jiaxinParse(e.data);
        if (jiaxinInitJson.from == "notify") {
            doCallback(jiaxinInitJson);
        } else if (jiaxinInitJson.from == "logic") {
            jiaxinSetCookie("jiaxin.mcs.username", jiaxinInitJson.username);
        }
    }

}

/**
 * 回调注册事件
 * @param  {Object} jiaxinInitJson [系统参数]
 */
function doCallback(jiaxinInitJson) {
    switch (jiaxinInitJson.type) {
        case NOTIFY_TYPE.REQUEST:
            jiaxinCallback.emit("request", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.QUEUE:
            jiaxinCallback.emit("queueInfo", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.AGENT:
            jiaxinCallback.emit("sessionAgentAccepted", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.ROBOT:
            jiaxinCallback.emit("sessionRobotAccepted", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.TRANSFERED:
            jiaxinCallback.emit("sessionTransfered", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.END:
            jiaxinCallback.emit("sessionEnd", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.REC_MSG:
            jiaxinCallback.emit("recMsg", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.SEND_MSG:
            jiaxinCallback.emit("sendMsg", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.SESS_INFO:
            jiaxinCallback.emit("sessionInfo", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.DEPART_SESSION:
            jiaxinCallback.emit("departSession", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.CONNECT:
            jiaxinCallback.emit("connect", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.SATISFY:
            jiaxinCallback.emit("satisfy", jiaxinInitJson);
            break;
        case NOTIFY_TYPE.MSG_CENTER:
            jiaxinCallback.emit("leaveword", jiaxinInitJson);
            if(!jiaxinMobileClient()&& (jiaxinButtonShowed() || isHidden())){
                jiaxinShowTitle("leaveMsg");
                showMsgNotificationOfJiaxin(jiaxinInitJson);
            }
            break;        
    }
}
/**
 * 获取未读留言
 */
function jiaxinGetUnreadCount() {
//处于非聊天状态下才获取未读留言数（也就是首次进入时）
    if (!jiaxinGetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie') && !jiaxinMcsConfig.iframeShowed){
        var jiaxinMcsUsername = jiaxinGetCookie('jiaxin.mcs.username');
        if(vl(jiaxinMcsUsername)){//存在username才请求
            if (!jiaxinMcsConfig.isDevMode) {//如果不是开发环境，那么就需要去到指定的环境
                envPath =  jiaxinMcsConfig.env + "/";
            }
            var url = jiaxinMcsConfig.jiaxinDomain + envPath + "/rest/msgbox/getUnreadCount?orgName=" + jiaxinMcsConfig.json.id + "&appName=" + jiaxinMcsConfig.json.appName + "&username=" + jiaxinMcsUsername;
            jiaxinAjax({
                method: 'GET',
                url: url,
                async: true,
                success: function (response) {
                     var jiaxinMsgData = jiaxinParse(response);
                            jiaxinMsgData.receipt.code = 0;
                            jiaxinMsgData.receipt.userId = jiaxinMcsUsername;
                            jiaxinCallback.emit("leaveword", jiaxinMsgData.receipt);

                            if(jiaxinMsgData.receipt.unreadCount > 0 && vl(window.Notification)){
                                var notifyJson = {};
                                notifyJson.icon = "image/agent.png";
                            
                                notifyJson.title = JIAXIN_TEXT.NOTIFICATION;
                                notifyJson.msg = JIAXIN_TEXT.UNREAD_LEAVE_MESSAGE;
                                
                                showMsgNotificationOfJiaxin(notifyJson);
                            }
                },
                error: function(response){
                }
            });
        }
    }

}
/**
 * 获取要跳转的目标页面的完整URL
 * @param  {Boolean} alone [是否为新窗口]
 * @return {String}       [完整路径]
 */
function jiaxinGetUrl(alone) {
	jiaxinMcsConfig.jiaxinSearchReferrer = jiaxinGetSearchReferrer();
	
    var file = ""; //这里实际上会跳转到默认文件index.html
    if (jiaxinMobileClient()) {
        file = "mobile.html";
    } else {
        if (alone === true) {
            file = "";
        } else {
            file = "small.html";
        }
    }
    if (!jiaxinMcsConfig.isDevMode) {
        envPath = jiaxinMcsConfig.env + "/";
    }
    url = jiaxinMcsConfig.jiaxinDomain + envPath + file + '?' + jiaxinJoinThridParam() + jiaxinJoinProductParam() + jiaxinJoinStyleParams() + jiaxinJoinBaseParams() + jiaxinMcsConfig.jiaxinSearchReferrer;
    if (alone === true) {
        url = url + "&alone=1";
    }
    if (jiaxinGetQueryString('ishq')){
        url = url + "&ishq=" + jiaxinGetQueryString('ishq');
    }

    if (jiaxinGetQueryString('autoVideo')) {
        url = url + "&autoVideo=" + jiaxinGetQueryString('autoVideo');
    }
    return url;
}
/**
 * 设置目标页面
 */
function jiaxinSetUrlOfIframe() {
    //微信访问时跳转到权限验证的界面
    if (jiaxinLocationHref.indexOf("appid") >= 0 && jiaxinLocationHref.indexOf("openid") < 0 && isWeiXinBrowser()) {
        var appid = jiaxinLocationHref.split('appid=')[1];
        if (jiaxinMcsConfig.jiaxinDomain.indexOf("jiaxincloud") >= 0) {
            window.location = ("https://wechat.jiaxincloud.com/userAuth.jsp?appid=" + appid + "&jxhref=" + jiaxinLocationHref);
        } else {
            window.location = ("https://wechat.jiaxinyun.com/userAuth.jsp?appid=" + appid + "&jxhref=" + jiaxinLocationHref);
        }
    } else {
        smallIframe.src = jiaxinGetUrl(false);
        jiaxinMcsConfig.jiaxinIframeLoaded = true;
    }
}

/**
 * 如果已经加载过客服，则在后台先自动加载
 */
function jiaxinSetUrlOfIframeAfter2() {
    if (jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.DIV) {
        if (jiaxinGetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie') && !jiaxinMcsConfig.iframeShowed) {
            jumping = setTimeout(function() {
                jiaxinSetUrlOfIframe();
            }, 500);
        }
    }
}
/**
 * 清空加载过客服的记录）
 */
function jiaxinClearUrlOfIframe() {
    jiaxinMcsConfig.jiaxinIframeLoaded = false;
}

/////////////////////////////util////////////////////////////////////
/**
 * 判空
 * @param  {String} value 
 * @return {Boolean}       [是否为空]
 */
function vl(value) {
    return value != null && value != 'undefined' && value !== '' && !(typeof value == 'undefined') && value !== " ";
}
/**
 * 判断是否为空对象
 * @param  {Object}  e [对象]
 * @return {Boolean}   [是否为空]
 */
function isEmptyObject(e) {  
    var t;  
    for (t in e)  
        return !1;  
    return !0  
} 
/**
 * 获取URL的参数
 * @param  {String} name [参数名]
 * @return {String}      [对应值]
 */
function jiaxinGetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
/**
 * 判断是否为移动设备
 * @return {Boolean} []
 */
function jiaxinMobileClient() {
    return jiaxinGetCurrentDevice() == JIAXIN_TERMINAL_TYPE.MOBILE;
}
/**
 * 判断是否为微信浏览器
 * @return {Boolean} []
 */
function isWeiXinBrowser() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
/**
 * 设置Cookie的值
 * @param  {String} name  [名称]
 * @param  {String} value [值]
 */
function jiaxinSetCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 1 * 60 * 60 * 1000); //毫秒为单位 :保存2个小时
    document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=" + exp.toGMTString();

}
/**
 * 获取Cookie的值
 * @param  {String} name [名称]
 * @return {String}      [值]
 */
function jiaxinGetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return decodeURIComponent(arr[2]);
    } else {
        return null;
    }
}

/**
 * 判别请求的终端的类型
 * @return {Number} [终端类型]
 */
function jiaxinGetCurrentDevice() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return JIAXIN_TERMINAL_TYPE.MOBILE;
    }else{
        return JIAXIN_TERMINAL_TYPE.PC;
    }
}

/////////////////////////////showing////////////////////////////////////
/**
 * 显示客服按钮
 */
function jiaxinButtonShowed() {
    return FixedBtnStyle.display == "block";
}
/**
 * 隐藏客服按钮
 */
function jiaxinDialogShowed() {
    return FixedDialogStyle.display == "block";
}
/**
 * 创建客服面板
 * @param  {Object} jiaxinMcsConfig [mcs配置]
 */
function jiaxinCreatePanel(jiaxinMcsConfig) {
    // 1、获取第三方引入页面body或document原始
    var bodys = document.getElementsByTagName('body');
    var jiaxin_containerElement = null;
    if (bodys.length <= 0 || jiaxinMobileClient()) {
        jiaxin_containerElement = document.documentElement;
    } else {
        jiaxin_containerElement = bodys[0];
    }

    // 2、body中追加样式文件
    var mobileCssStr = '#jiaxin-mcs-fixed-dialog{z-index: 999999;display:none;overflow:hidden;background-color:transparent;box-shadow:0 0 20px 0 rgba(0,0,0,.15);background-color:transparent}.jiaxin-mcs-fixed-dialog{bottom:0;right:60px;width:100%;height:100%}#jiaxin-mcs-fixed-dialog iframe{z-index: 9999;clear:both;position: fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;border:0;padding:0;margin:0;float:none;background:0}#jiaxin-mcs-fixed-btn{clear:both;display:none;position:fixed;width:auto;color:#fff;cursor:pointer;height:auto;z-index: 999999}.jiaxin-mcs-fixed-btn{bottom:150px;right:0;background-color:#00a4f5;font-size:16px}#jiaxin-mcs-fixed-btn img{clear:both;width:20px;height:20px}#jiaxin-mcs-fixed-btn div{clear:both;display:block;width:18px;padding:0 10px 10px 10px;margin-top:10px;text-align:center;overflow-x:hidden;line-height:1.428571429;word-break:break-all;word-wrap:break-word;letter-spacing:24px;font-family:Arial,"Microsoft YaHei","微软雅黑",sans-serif}#jiaxin-mcs-fixed-btn span{clear:both;display:block;float:left;height:40px;margin:0 10px;line-height:40px;overflow-y:hidden;font-family:Arial,"Microsoft YaHei","微软雅黑",sans-serif}#jiaxin-mcs-fixed-btn span img{margin-bottom:-3px;margin-right:2px}#jiaxin-mcs-fixed-btn a{clear:both;display:block;width:50px;height:50px;border:1px solid rgba(0,0,0,.1);border-radius:25px;box-shadow:0 0 14px 0 rgba(0,0,0,.16);cursor:pointer;text-decoration:none}#jiaxin-mcs-fixed-btn a img{clear:both;position:absolute;top:15px;left:15px;width:20px;height:20px}#jiaxin-mcs-badge{background-color:#FF2254;border-radius:4px;position:absolute;top:-35px;font-size:10px;font-style:normal;text-align:center;min-width:20px;padding:5px;}';

    var pcCssStr = '#jiaxin-mcs-fixed-dialog{z-index: 999999;position:fixed; display:none;overflow:hidden;background-color:transparent;box-shadow:0 0 20px 0 rgba(0,0,0,.15);background-color:transparent}.jiaxin-mcs-fixed-dialog{bottom:0;right:60px;width:360px;height:480px}#jiaxin-mcs-fixed-dialog iframe{clear:both;position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%;border:0;padding:0;margin:0;float:none;background:0}#jiaxin-mcs-fixed-btn{clear:both;display:none;position:fixed;width:auto;color:#fff;cursor:pointer;height:auto;z-index: 999999}.jiaxin-mcs-fixed-btn{bottom:150px;right:0;background-color:#00a4f5;font-size:16px;}#jiaxin-mcs-fixed-btn img{clear:both;width:20px;height:20px;vertical-align: inherit !important;}#jiaxin-mcs-fixed-btn div{clear:both;display:block;width:18px;padding:0 10px 10px 10px;margin-top:10px;text-align:center;overflow-x:hidden;line-height:1.428571429;word-break:break-all;word-wrap:break-word;letter-spacing:24px;}#jiaxin-mcs-fixed-btn span{font-family:Arial,"Microsoft YaHei","微软雅黑",sans-serif;clear:both;display:block;float:left;height:40px;margin:0 10px;line-height:40px;overflow-y:hidden;}#jiaxin-mcs-fixed-btn span img{margin-bottom:-3px;margin-right:2px}#jiaxin-mcs-fixed-btn a{clear:both;display:block;width:50px;height:50px;border:1px solid rgba(0,0,0,.1);border-radius:25px;box-shadow:0 0 14px 0 rgba(0,0,0,.16);cursor:pointer;text-decoration:none}#jiaxin-mcs-fixed-btn a img{clear:both;position:absolute;top:15px;left:15px;width:20px;height:20px}#jiaxin-mcs-badge{background-color:#FF2254;border-radius:4px;position:absolute;top:-35px;font-size:10px;font-style:normal;text-align:center;min-width:20px;padding:5px;} .jiaxin-mcs-move-bar{position:fixed;z-index:9999999;height:60px;right:230px;width:260px; cursor:move;}';
     
    if (document.createStyleSheet) { //兼容ie8
        var $style = document.createStyleSheet();
        if (jiaxinMobileClient()) {
            $style.cssText = mobileCssStr; //要添加的css
        } else {
            $style.cssText = pcCssStr; //要添加的css
        }
    } else {
        var $style = document.createElement("style");
        if (jiaxinMobileClient()) {
            $style.innerHTML = mobileCssStr;
        } else {
            $style.innerHTML = pcCssStr;
        }
        jiaxin_containerElement.appendChild($style);
    }

    var jiaxin_fixed_dialog_div = document.createElement('div');
    jiaxin_fixed_dialog_div.setAttribute("id", "jiaxin-mcs-fixed-dialog");
    jiaxin_fixed_dialog_div.setAttribute("class", "jiaxin-mcs-fixed-dialog");


    var jiaxin_dialog_iframe = document.createElement("iframe");
    jiaxin_dialog_iframe.setAttribute("id", "jiaxin-mcs-iframe");
    jiaxin_dialog_iframe.setAttribute("allow", "microphone");
    jiaxin_dialog_iframe.setAttribute("frameborder", "0");
    jiaxin_fixed_dialog_div.appendChild(jiaxin_dialog_iframe);

    // 3、body中添加聊天弹框div
    jiaxin_containerElement.appendChild(jiaxin_fixed_dialog_div);

    var jiaxin_fixed_btn_div = document.createElement('div');
    jiaxin_fixed_btn_div.setAttribute("id", "jiaxin-mcs-fixed-btn");
    jiaxin_fixed_btn_div.setAttribute("class", "jiaxin-mcs-fixed-btn");
    jiaxin_fixed_btn_div.onclick = jiaxinTogglerDiv;

    var $btnDiv = document.createElement("div");
    $btnDiv.innerHTML = "在线客服";
    jiaxin_fixed_btn_div.appendChild($btnDiv);

    // 4、body中追加客服按钮
    jiaxin_containerElement.appendChild(jiaxin_fixed_btn_div);

    // 5、添加拖动元素
    var jiaxin_move_div = document.createElement('div');
    jiaxin_move_div.setAttribute("id", "jiaxin-mcs-move-bar");
    jiaxin_move_div.setAttribute("class", "jiaxin-mcs-move-bar");
    jiaxin_fixed_dialog_div.appendChild(jiaxin_move_div);
    dragElement("jiaxin-mcs-move-bar", "jiaxin-mcs-fixed-dialog");

    // 缓存元素和style
    jiaxinMcsFixedBtn = document.getElementById("jiaxin-mcs-fixed-btn");
    jiaxinMcsFixedDialog = document.getElementById("jiaxin-mcs-fixed-dialog");
    smallIframe = document.getElementById("jiaxin-mcs-iframe");

    FixedBtnStyle =  jiaxinMcsFixedBtn.style;
    FixedDialogStyle =  jiaxinMcsFixedDialog.style;
}

 /**
  * 界面切换操作
  * @param  {String} thirdWorkgroupId [废弃的参数，传递空值即可]
  * @param  {Object} thirdLucencyData [透传的数据（给到扩展模块使用）]
  * @param  {Object} thirdJson        [扩展的业务数据（采用json格式，包括crm等）---这个参数也可以通过jiaxinInit方法进行传入]
  */
function jiaxinTogglerDiv(thirdWorkgroupId, thirdLucencyData, thirdJson) {
    if (thirdJson) {
        jiaxinThirdJson = thirdJson;
    }
    if (thirdLucencyData) {
        jiaxinMcsConfig.thirdLucencyData = thirdLucencyData;
        //防止巴图鲁刷新页面获取不到extendData;
        if (jiaxinMcsConfig.mode != JIAXIN_DIALOG_MODE.NEW_WINDOW && jiaxinMcsConfig.mode != JIAXIN_DIALOG_MODE.MULTI_CHAT) {
        	jiaxinSetUrlOfIframe();
        }
    }
    //微信浏览器仅支持当前窗口打开
    if ((jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.NEW_WINDOW || jiaxinMcsConfig.mode == JIAXIN_DIALOG_MODE.MULTI_CHAT)   && (!isWeiXinBrowser()||jiaxinMcsConfig.newWindowOpen)) {
        var src = jiaxinGetUrl(true);
        if (jiaxinMobileClient()) {
        	window.open(src, "newwindow", "toolbar=no, menubar=no, scrollbars=no, resizable=no, Resizable=no, location=no, status=no");
        } else {
                var defHeight = 600;
                var defWidth = 770;
                if(jiaxinMcsConfig.mode == 2){
                     defWidth = 870;
                }
                if(jiaxinWindow == null || jiaxinWindow.closed){
                    var h = jiaxinThirdJson && jiaxinThirdJson.setting && jiaxinThirdJson.setting.windowHeight ? jiaxinThirdJson.setting.windowHeight : defHeight; 
                    var w = jiaxinThirdJson && jiaxinThirdJson.setting && jiaxinThirdJson.setting.windowWidth ? jiaxinThirdJson.setting.windowWidth : defWidth;
                    //获得窗口的垂直位置 
                    var iTop = (window.screen.availHeight  - h) / 2; 
                    //获得窗口的水平位置 
                    var iLeft = (window.screen.availWidth  - w) / 2; 
                   
                    jiaxinWindow = window.open(src, "newwindow", "height=" + h + ", width=" + (w + 10) + ", toolbar=no, menubar=no, ,top="+ iTop + ",left=" + iLeft +",scrollbars=no, resizable=no, Resizable=no, location=no, status=no");
                }else{
                	 if (jiaxinWindow && jiaxinPreInitWindow) {
                		 jiaxinWindow.location.href = src;
                		 jiaxinPreInitWindow = false;
                     } else {
                    	 jiaxinWindow.focus();
                     }
                }
        	}
    } else {
        if (jiaxinButtonShowed()) {
            var jiaxinMcsBadge = document.getElementById("jiaxin-mcs-badge");
            if ((!jiaxinMcsConfig.jiaxinIframeLoaded || !isEmptyObject(jiaxinThirdJson) || (vl(jiaxinMcsConfig.productData)&&vl(jiaxinMcsConfig.productData.jx_order_id)))&&!jiaxinMinimize) {
                if (jumping) {
                    clearTimeout(jumping);
                    jumping = null;
                }
                //如果处于聊天当中，则不再加载页面
                if (!jiaxinMcsConfig.unReadNum || jiaxinMcsConfig.unReadNum == 0 || (vl(jiaxinMcsConfig.productData)&&vl(jiaxinMcsConfig.productData.jx_order_id))) {
                    jiaxinSetUrlOfIframe();
                }
            }
            if (jiaxinMobileClient()) {
                document.body.style.display = "none";
            }
            FixedBtnStyle.display = "none";
            FixedDialogStyle.display = "block";
            if (jiaxinMcsBadge) {
                jiaxinMcsBadge.style.display = "none";
            }
        } else {
            if (window.jumpLink) {
                iframeJumpLinkHandle(window.jumpLink);
            } else {
                if (jiaxinMobileClient()) {
                    document.body.style.display = "block";
                }
                FixedDialogStyle.display = "none";
                FixedBtnStyle.display = "block";
            }
        }

        jiaxinMcsConfig.unReadNum = 0;
        jiaxinStopTitle();
    }
    // 如果有邀请框，点击联系客服后要关闭
    if(jiaxinMcsConfig.autoInvite == 1){
        jiaxinMcsConfig.visited = true;
        var jiaxin_invite_panel = document.getElementById("jiaxin-invite-panel");
        if(jiaxin_invite_panel){
            jiaxin_invite_panel.style.display = "none";
        }
    }
}

function iframeJumpLinkHandle() {
    smallIframe.src = window.jumpLink;
    FixedBtnStyle.display = "block";
    window.jumpLink = '';
}

/**
 * 界面初始化设置（用户配置）
 * @param  {Object} jiaxinStyleJson [用户配置参数]
 */
function jiaxinInitStyle(jiaxinStyleJson) {
    jiaxinMcsFixedBtn.className = '';
    if (jiaxinMobileClient() && jiaxinStyleJson.type == '1') {
        FixedBtnStyle.left = '0px';
        FixedBtnStyle.width = '100%';
    } else {
        if (jiaxinStyleJson.leftOrRight == 'left') {
            FixedBtnStyle.left = jiaxinStyleJson.marginSide + 'px';
        } else {
            FixedBtnStyle.right = jiaxinStyleJson.marginSide + 'px';
        }
    }

    FixedBtnStyle.bottom = jiaxinStyleJson.marginBottom + 'px';

    var isInitBtn = jiaxinMcsConfig.json.init;
    if (isInitBtn != null && isInitBtn == 'false') {
        jiaxinMcsFixedBtn.innerHTML = '';
    } else {
        if (jiaxinStyleJson.ChatButton == '0' || jiaxinStyleJson.ChatButton == 0) {
            jiaxinMcsFixedBtn.innerHTML = '';
        } else {
            if (jiaxinStyleJson.type == '3') {
                jiaxinMcsFixedBtn.innerHTML = '<div><img src="' + jiaxinMcsConfig.jiaxinDomain + 'image/' + jiaxinStyleJson.icon + '"> <p>' + jiaxinStyleJson.onlineText + '</p></div>';
                FixedBtnStyle.backgroundColor = jiaxinStyleJson.bgcolor;
                if (jiaxinStyleJson.leftOrRight == 'left') {
                    FixedBtnStyle.left = '0px';
                } else {
                    FixedBtnStyle.right = '0px';
                }
            } else if (jiaxinStyleJson.type == '1') {
                if (jiaxinMobileClient()) {
                    jiaxinMcsFixedBtn.innerHTML = '<span style="text-align:center;float: none;" ><img src="' + jiaxinMcsConfig.jiaxinDomain + 'image/' + jiaxinStyleJson.icon + '"> ' + jiaxinStyleJson.onlineText + '</span>';
                } else {
                    jiaxinMcsFixedBtn.innerHTML = '<span><img src="' + jiaxinMcsConfig.jiaxinDomain + 'image/' + jiaxinStyleJson.icon + '"> ' + jiaxinStyleJson.onlineText + '</span>';
                }
                FixedBtnStyle.backgroundColor = jiaxinStyleJson.bgcolor;
            } else if (jiaxinStyleJson.type == '2') {
                jiaxinMcsFixedBtn.innerHTML = '<a style="background-color:' + jiaxinStyleJson.bgcolor + '"  ><img src="' + jiaxinMcsConfig.jiaxinDomain + 'image/' + jiaxinStyleJson.icon + '"> </a>';
            }
        }
    }

    jiaxinMcsFixedDialog.className = '';

    if (jiaxinMobileClient()) {
        FixedDialogStyle.left = "-1px";
        FixedDialogStyle.top = "-1px";
        FixedDialogStyle.width = '100%';
        if (window.innerHeight) {
            FixedDialogStyle.height = window.innerHeight + 'px';
        } else if ((document.body) && (document.body.clientHeight)) {
            FixedDialogStyle.height = document.body.clientHeight + 'px';
        }
    } else {
        var jiaxinMoveBarStyle = document.getElementById("jiaxin-mcs-move-bar").style;
        // 侧栏窗口
        if (jiaxinStyleJson.DialogType == '3') {
            FixedDialogStyle.width = '320px';
            FixedDialogStyle.height = '100%';
            if (jiaxinStyleJson.DialogPosition == 'left') {
                FixedDialogStyle.left = '0px';
            } else {
                FixedDialogStyle.right = '0px';
            }
            FixedDialogStyle.bottom = '0px';
            jiaxinMoveBarStyle.display = "none";
        } else {
            // 标准窗口
            if (jiaxinStyleJson.DialogType == '2') {
                if(jiaxinStyleJson.privateType == "anlai"){
                     FixedDialogStyle.width = '440px';
                     FixedDialogStyle.height = '500px';
                }else{
                     FixedDialogStyle.width = '600px';
                     FixedDialogStyle.height = '430px';
                }
                jiaxinMoveBarStyle.width = "500px"
            } else {
                // 迷你窗口
                FixedDialogStyle.width = '360px';
                FixedDialogStyle.height = '480px';
            }
            if (jiaxinStyleJson.DialogPosition == 'center') {
                FixedDialogStyle.left = "50%";
                FixedDialogStyle.marginLeft = "-300px";
                FixedDialogStyle.top = "50%";
                FixedDialogStyle.marginTop = "-200px";
            } else {
                if (jiaxinStyleJson.DialogPosition == 'right') {
                    FixedDialogStyle.right = jiaxinStyleJson.DialogMarginSide + 'px';
                } else {
                    FixedDialogStyle.left = jiaxinStyleJson.DialogMarginSide + 'px';
                }
                FixedDialogStyle.bottom = jiaxinStyleJson.DialogMarginBottom + 'px';
            }
        }
    }
    FixDialogWidth = FixedDialogStyle.width;
    FixedBtnStyle.display = "block";
    FixedDialogStyle.display = "none";
}

/**
 * 有新消息时在title处闪烁提示
 * @param  {String} msg [显示的消息]
 */
function jiaxinShowTitle(msg) {
    if(!jiaxinMcsConfig.blinkTitle){
        return;
    }
    var step = 0;
    var _title = document.title;
    if (!jiaxinTitleTimer) {
        jiaxinTitleTimer = setInterval(function() {
            step++;
            if (step == 3) {
                step = 0;
            } else if (step == 1) {
                document.title = '【　　　　　】' + _title
            } else if (step == 2) {
                if( msg == "msg"){
                    document.title = JIAXIN_TEXT.NEW_MESSAGE + _title;
                }else if( msg == "leaveMsg"){
                    document.title = JIAXIN_TEXT.NEW_LEAVE_MESSAGE + _title;
                }
            }
        }, 500);
    }
}
/**
 * 判断是否在当前页
 * @return {Boolean} [是否在当前页面]
 */
function isHidden(){
    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
    return document[hiddenProperty];
}
/**
 * 标题停止闪烁
 */
function jiaxinStopTitle() {
    if (jiaxinTitleTimer) {
        clearInterval(jiaxinTitleTimer);
        jiaxinTitleTimer = null;
        document.title = jiaxinOriginalTitle;
    }
}

/**
 * 浏览器弹框提醒
 * @param  {Object} notifyJson [弹窗内容]
 */
function showMsgNotificationOfJiaxin(notifyJson) {
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (!jiaxinMcsConfig.isDevMode) {
        envPath = jiaxinMcsConfig.env + "/" ;
    }
    if (Notification && Notification.permission === "granted") {
        var notify = new Notification(notifyJson.title, {
            body: notifyJson.msg,
            icon: jiaxinMcsConfig.jiaxinDomain + envPath + notifyJson.icon
        });
        notify.onshow = function() {
            setTimeout(notify.close.bind(notify), 3000);
        };
    } else if (Notification && Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            // If the user said okay
            if (status === "granted") {
                var notify = new Notification(notifyJson.title, {
                    body: notifyJson.msg,
                    icon: jiaxinMcsConfig.jiaxinDomain + path + notifyJson.icon
                });
                notify.onshow = function() {
                    setTimeout(notify.close.bind(notify), 3000);
                };
            } else {
                return false
            }
        });
    } else {
        return false;
    }
}

/**
 * V3.4.3
 * 提供给第三方调用，传递会话的业务参数
 * @param {Object} json{cid:"xa", crm.name:"tester", session.pageTitle:"testpage", setting.windowHeight:200, setting.windowWidth:300}
 */
function jiaxinInit(json){
	jiaxinThirdJson = json;
}

/////////////////////////////other////////////////////////////////////
/**
 * 第三方传入了的客户id
 * @param {String} id
 */
function jiaxinSetCustomId(id) {
    jiaxinMcsConfig.thirdPartyId = id;
    //V3.4.3
    jiaxinThirdJson.cid = id;
}

////////////////////////////////////////////第三方方法调用//////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 巴图鲁接口调用
 * @param  {String} uesername [description]
 * @param  {String} token     [description]
 */
function jiaxinSetAccount(uesername, token) {
    if (uesername) {
        jiaxinMcsConfig.thirdUsername = uesername;
    }
    if (token) {
        jiaxinMcsConfig.thirdPassword = token;
    }
}
/**
 * 清空Cookie
 */
function jiaxinClearCookies() {
    jiaxinClearUrlOfIframe();
    jiaxinSetCookie(jiaxinMcsConfig.json.id + 'com.jiaxincloud.mcs.cookie', '');
}

/**
 * 修改渠道号方法
 * @param  {String} appChannel [渠道号]
 */
function jiaxinSetAppChannel(appChannel) {
    jiaxinMcsConfig.onlyshow = true;
    oneAppChannel = true;
    jiaxinAppChannel = jiaxinGetCookie('com.jiaxincloud.appChannel');
    jiaxinSetCookie('com.jiaxincloud.appChannel', appChannel);
    if (oneAppChannel && jiaxinAppChannel != appChannel) {
        jiaxinMcsConfig.onlyshow = true;
    } else {
        jiaxinMcsConfig.onlyshow = false;
        jiaxinGetCookie('com.jiaxincloud.appChannel', appChannel);
    }
    jiaxinMcsConfig.appChannel = appChannel;
    jiaxinClearCookies();

    // 取企业属于哪个集群
    jiaxinGetEnvVersion(function(result, responseText) {
        if (JIAXIN_OPT_RESULT.SUCCESS == result) {
            var envData =  jiaxinParse(responseText);
            jiaxinMcsConfig.env = envData.receipt.env;

            //获取企业的基础信息，然后初始化界面
            jiaxinGetInitData(function(result, responseText) {
                if (JIAXIN_OPT_RESULT.SUCCESS == result) {
                    var initData = jiaxinParse(responseText);
                    if (initData.code == JIAXIN_OPT_RESULT.SUCCESS) {
                        jiaxinAppendStyleParams(initData.data);
                        jiaxinInitStyle(initData.data);
                        jiaxinTogglerDiv("", jiaxinMcsConfig.thirdLucencyData);
                    } else {
                        alert(JIAXIN_VISITOR_TEXT.INIT_DATA_ERROR2);
                    }
                } else {
                    alert(JIAXIN_VISITOR_TEXT.INIT_DATA_ERROR);
                }
            });
        }
    });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * 天安接口调用
 * 调用例子：jiaxinSaveCustomerInfo('543E469B9A66F4C4D170EDF0C1D28761','20160330115400','408099','工作','公众','http:/www.baidu.com','','');
 * @param token
 * @param timestamp
 * @param customID
 * @param city
 * @param carNo
 * @param productNo
 * @param customerSrc
 * @param webpage
 */
function jiaxinSaveCustomerInfo(token, timestamp, customID, city, carNo, productNo, customerSrc, webPage, orderNo) {
    if (customID == null || customID == '') {
        return;
    }
    var customInfo = {};
    customInfo.token = token;
    customInfo.timestamp = timestamp;
    customInfo.customID = customID;
    customInfo.city = city;
    customInfo.carNo = carNo;
    customInfo.productNo = productNo;
    customInfo.customerSrc = customerSrc;
    customInfo.webPage = webPage;
    customInfo.orderNo = orderNo;
    for(var i in customInfo){
        if(customInfo.hasOwnProperty(i)){
            customInfo[i] = encodeURIComponent(customInfo[i]);
        }
    }
    var args = "token=" + customInfo.token + "&timestamp=" + customInfo.timestamp + "&customID=" + customInfo.customID + "&city=" + customInfo.city + "&carNo=" + customInfo.carNo 
            + "&productNo=" + customInfo.productNo + "&customerSrc=" + customInfo.customerSrc + "&webPage=" + customInfo.webPage + "&orderNo=" + customInfo.orderNo;
    var url =  jiaxinMcsConfig.jiaxinDomain + envPath + "rest/user/jiaxinSaveCustomerInfo";
    jiaxinAjax({
        method: 'POST',
        url: url,
        args: args,
        async: true,
        success: function (response) {
            console.log("SaveCustomerInfo Success");
        },
        error: function(response){
            //SaveCustomerInfo Error
        }
    });
}

/**
 * 展示商品链接，需要在引用mcs.js后，马上执行
 * @param {Object} param
 */
function jiaxinProduct(param) {
    var productParam = {
        show: param.show,
        title: param.title,
        desc: param.desc,
        picture: param.picture,
        url: param.url,
        time: param.time,
        confirm: param.confirm,
        suborgId: param.suborgId,
        jx_order_status:param.jx_order_status,
        jx_amount:param.jx_amount,
        jx_order_id:param.jx_order_id
    }
    jiaxinMcsConfig.productData = productParam;
}

/**
 * 展示广告位，需要在引用mcs.js后，马上执行
 * @param {Object}  param
 */
function jiaxinAdvert(param) {
    if(param.type == 1){
        var advertParam = {
           type: param.type,
           msg: param.msg
        }
        jiaxinMcsConfig.advertData = advertParam;
    }else if(param.type == 8){
        var advertParam = {
           type: param.type,
           title: param.title,
           content: param.content,
           remoteurl: param.remoteurl,
           thumbremoteurl: param.thumbremoteurl,
           url : param.url,
           filename: param.filename,
           filesize: param.filesizes
        }
        jiaxinMcsConfig.advertData = advertParam;
    }
}

/**
 * 关闭窗口
 */
function jiaxinCloseWindow() {
	if (jiaxinWindow) {
		jiaxinWindow.close();
	}
}

/**
 * 打开窗口
 */
function jiaxinPreOpenWindow () {
	var defHeight = 600;
    var defWidth = 770;
    if(jiaxinMcsConfig.mode == 2){
         defWidth = 870;
    }
    
    var h = defHeight; 
    var w = defWidth;
    //获得窗口的垂直位置 
    var iTop = (window.screen.availHeight  - h) / 2; 
    //获得窗口的水平位置 
    var iLeft = (window.screen.availWidth  - w) / 2; 
   
    jiaxinWindow = window.open('', "newwindow", "height=" + h + ", width=" + (w + 10) + ", toolbar=no, menubar=no, ,top="+ iTop + ",left=" + iLeft +",scrollbars=no, resizable=no, Resizable=no, location=no, status=no");
    jiaxinPreInitWindow = true;
}

/**
 * 自动弹出客服
 * @param  {Object} data [自动邀请配置参数]
 */
function autoInvite(data){
    var inviteTime =  data.inviteTime * 1000;
    if(data.inviteType == 0 && data.DialogMode == JIAXIN_DIALOG_MODE.DIV){
        setTimeout(function(){
            showPopupWindow();
        }, inviteTime)
    }else if(data.inviteType == 1){
        showInviteWindow(data, inviteTime);
    }
}

/**
 * 弹出会话框
 */
function showPopupWindow(){
    // 未访问过客服才弹出
    if(!jiaxinMcsConfig.visited){
        jiaxinTogglerDiv();
    }
}

/**
 * 显示邀请框
 * @param  {Object} data       [自动邀请配置参数]
 * @param  {Number} inviteTime [邀请窗口弹出时间]
 */
function showInviteWindow(data, inviteTime){
    
    // 添加dom节点
    var bodyEle = document.getElementsByTagName('body')[0] || document.documentElement;
    var jiaxin_invite_panel = document.createElement('div');
    jiaxin_invite_panel.setAttribute("id", "jiaxin-invite-panel");
    jiaxin_invite_panel.setAttribute("class", "jiaxin-invite-panel");
    var panelStyle = jiaxin_invite_panel.style;
    bodyEle.appendChild(jiaxin_invite_panel);

    // 添加样式
    var inviteCssStr= '.jiaxin-invite-panel{ font-family:Arial,"Microsoft YaHei","微软雅黑",sans-serif; display:none; position: fixed; top: 45%; left: 50%; margin-top: -140px; margin-left: -165px; width: 330px; max-width: 400px; height: 280px; background: #fff; box-shadow: 0 0 20px 0 rgba(0,0,0,.15); border-radius: 3px;} .jiaxin-invite-msg{ width: 260px; margin: 0 auto; padding: 20px 0; font-size: 16px; color: #464545; vertical-align: middle; word-break:break-all} .jiaxin-invite-btn{ width: 184px; height: 36px; background: #23b7ef; color: #fff; text-align: center; line-height: 36px; border-radius: 3px; margin: 0 auto; cursor: pointer } .custom-image{ width: 100%; height: 100%; cursor: pointer;} .close-invite{ position: absolute; top: 0; right: 0; padding: 10px; cursor: pointer; opacity: 0.5; filter:alpha(opacity=50)} .close-invite:hover{opacity: 1; filter:alpha(opacity=100)}';
    var $style;
    if (document.createStyleSheet) { //兼容ie8
        $style = document.createStyleSheet();
        $style.cssText = inviteCssStr; //要添加的css
    } else {
        $style = document.createElement("style");
        $style.innerHTML = inviteCssStr;
        bodyEle.appendChild($style);
    }

    // 经典模式
    if(data.inviteMode == 0){
        jiaxin_invite_panel.innerHTML = "<img src='" + jiaxinMcsConfig.jiaxinDomain + "image/invite_bg.png' alt='background' /><div class='jiaxin-invite-msg'>"+data.inviteMsg+"</div><div class='jiaxin-invite-btn' id='inviteBtn'>"+JIAXIN_TEXT.BTN_TEXT+"</div><img src='" + jiaxinMcsConfig.jiaxinDomain + "image/common_cross.png' class='close-invite' id='closeInvite' alt='close' />"
        var inviteBtn = document.getElementById('inviteBtn');
        inviteBtn.onclick = function(){
            jiaxinTogglerDiv();
            panelStyle.display = "none";
        };
        setTimeout(function(){
            // 未访问过客服才弹出
            if(!jiaxinMcsConfig.visited){
                panelStyle.display = "block";
            }
        },inviteTime);
   }else if(data.inviteType == 1){
        // 自定义模式
        jiaxin_invite_panel.innerHTML = "<img class='custom-image' id='customImage' src='"+data.inviteImage+"'  alt='bg' /><img src='" + jiaxinMcsConfig.jiaxinDomain + "image/common_cross.png' class='close-invite' id='closeInvite' alt='close' />"
        panelStyle.width = "auto";
        panelStyle.height = "auto";
        panelStyle.opacity = "0";
        panelStyle.filter = "alpha(opacity=0)";
        panelStyle.background = "none";
        panelStyle.boxShadow = "none";
        var customImage = document.getElementById("customImage");
        setTimeout(function(){
            // 未访问过客服才弹出
            if(!jiaxinMcsConfig.visited){
                panelStyle.display = "block"
                if(customImage.clientWidth != 0){
                    showOnloadImage(panelStyle, customImage.clientWidth, customImage.clientHeight);
                }else{
                    // 当inviteTime为0 图片还未加载，clientWidth为0，需要监听处理
                    customImage.onload = function(){
                        showOnloadImage(panelStyle, customImage.clientWidth, customImage.clientHeight);
                    }
                }
                //点击图片联系客服
               customImage.onclick = function(){
                    jiaxinTogglerDiv();
                    panelStyle.display = "none";
               };
           }
        }, inviteTime);
   }
   // 关闭按钮
   var closeInviteEle = document.getElementById('closeInvite');
   closeInviteEle.onclick = function(){
        panelStyle.display = 'none';
   };
}
/**
 * 显示加载完成的图片
 * @param  {Object} panelStyle   [样式]
 * @param  {String} clientWidth  [宽]
 * @param  {String} clientHeight [高]
 */
function showOnloadImage(panelStyle, clientWidth, clientHeight){
    // 调整图片居中显示
    panelStyle.marginLeft = "-"+clientWidth/2+"px";
    panelStyle.marginTop = "-"+clientHeight/2+"px";
    panelStyle.opacity = "1";
    panelStyle.filter = "alpha(opacity=100)";
}

/**
 * 拖动元素
 * @param  {String} bar [顶部拖动的部分]
 * @param  {String} ele [被拖动的主体]
 */
function dragElement(bar, ele) {
  var elmnt = document.getElementById(bar);
  var container = document.getElementById(ele);

  var topPos = 0, leftPos = 0, clientX = 0, clientY = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    clientX = e.clientX;
    clientY = e.clientY;

    elmnt.style.width = container.style.width;
    elmnt.style.height = container.style.height;
 
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
  }

  function elementDrag(e) {
    e = e || window.event;
    leftPos = clientX - e.clientX;
    topPos = clientY - e.clientY;
    clientX = e.clientX;
    clientY = e.clientY;
    var top = container.offsetTop - topPos;
    var left = container.offsetLeft - leftPos;
    if(top < 0){
        top = 0;
    }
    if(left < 0){
        left = 0;
    }
    var conWidth = parseInt(container.style.width);
    var conHeight = parseInt(container.style.height);
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;  
    var clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    if((left + conWidth) > clientWidth){
        left = clientWidth - conWidth;
    }
    if((top + conHeight) > clientHeight){
        top = clientHeight - conHeight;
    }

    top += "px";
    left += "px";

    elmnt.style.top = top;
    elmnt.style.left = left;
    container.style.top = top;
    container.style.left = left;
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.style.width = parseInt(container.style.width)-130+"px";
    elmnt.style.height = "60px";
    elmnt.style.right = "220px"
  }
}
