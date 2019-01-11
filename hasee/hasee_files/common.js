/*--------------------------------------------------------------------
Global style sheet

version:    	1.1
author:     	yyhuaisha
email:       	2433273227@qq.com
last modified:	2015.04.09
Powered By www.	toprand.com
--------------------------------------------------------------------*/
function alert(msg) {
    (function (d) {
        d['okValue'] = '确定';
        d['cancelValue'] = '取消';
        d['title'] = '消息';
    })(art.dialog.defaults);
    art.alert(msg);
}

var checklogin;
$(function () {
    $("#btngopage").click(function () {
        var pageindex = $("#pageindex").val().trim();
        if (pageindex != "") {
            if (!isNum(pageindex)) {
                pageindex = 1;
            }
            var pageurl = document.location.href;
            var linkurl = "";
            if (pageurl.indexOf("?") > -1) {
                linkurl = pageurl.substr(0, pageurl.indexOf("?") + 1);
                var linkurlparam = "";
                var paraminfo = pageurl.substr(pageurl.indexOf("?") + 1);
                var params = paraminfo.split("&");
                for (var i = 0; i < params.length; i++) {
                    var paramitem = params[i].split("=");
                    if (paramitem[0] != "pg") {
                        linkurlparam += paramitem[0] + "=" + paramitem[1] + "&";
                    }
                }
                if (linkurlparam != "") {

                    linkurlparam += "pg=" + pageindex;
                    linkurl += linkurlparam;
                }
                else {
                    linkurl += "pg=" + pageindex;
                }
            }
            else {
                linkurl = pageurl;
                linkurl += "?pg=" + pageindex;
            }

            window.location.href = linkurl;
        }

    });

    //$("#chkIsRead").change(function () {
    //    if ($(this).prop("checked")) {
    //        $(".reg .reg_btn").removeAttr("disabled");
    //    }
    //    else {
    //        $(".reg .reg_btn").attr("disabled", "disabled");
    //    }
    //});

    $("#txtSearchKeyword").keydown(function (event) {
        if (event.keyCode == 13) {
            //$("#btnSearch").click();
            var keyword = $("#txtSearchKeyword").val().trim();
            window.location.href = "/product/prolist.aspx?keyword=" + keyword;
            return false;
        }
    });

    $("#btnSearch").click(function () {
        var keyword = $("#txtSearchKeyword").val().trim();
        window.location.href = "/product/prolist.aspx?keyword=" + keyword;
    });

});

$(document).ready(function () {
    /*--回到顶部 开始--*/
     $(window).scroll(function() {
        var windowH = $(window).height() / 2;
        var thisH = $(document).scrollTop();
        if (thisH > windowH) {
            $('.backTop').fadeIn();
        }else {
            $('.backTop').fadeOut();
        }
     });
     $('.backTop').click(function() {
        $('html, body').animate({scrollTop: '0px'});
     });
      /*--回到顶部 结束--*/

    $(".nav_first_li").hover(function () {
        $(this).addClass('cur');
    });
    $(".nav_first_li").mouseleave(function () {//移出
        $(this).removeClass("cur");
    });
    $(".nav_ol dl").hide();
    $(".nav_ol li").mouseenter(function () {//移入
        $(this).addClass('cur').siblings("li").removeClass("cur");
        $(this).children("dl").show();
    });
    $(".nav_ol li").mouseleave(function () {//移出
        $(this).removeClass("cur");
        $(this).children("dl").hide();
    });
    // $(".prod_i_show td").hover(function () {
    //     $(this).addClass('cur').siblings("td").removeClass("cur");
    //     var index = $('.prod_i_show td').index(this); //获取当前<li>元素在全部 li 元素中的索引
    //     $('.prod_i_show li:eq(' + index + ')').show().siblings("li").hide();
    // });
    // $(".prod_i_show li").hide();
    // $(".prod_i_show li:eq(0)").show();

    if ($(".hdProDefaultAttr").length>0) {
        var defaultattr=$(".hdProDefaultAttr").val();
        if (defaultattr!="") {
            var defaultitems=defaultattr.split(",");
            for (var i = 0; i < defaultitems.length; i++) {
                $(".pro_attr li").each(function(){
                    if ($(this).find("a").attr("currid")==defaultitems[i]) {
                        $(this).addClass("cur");
                        return false;
                    }
                });
            }

            var proid = $("#hdProID").val();
            $.ajax({
                type: "post",
                url: "/product/ajax.ashx",
                async: false,
                data: { "type": "getattrprice", "proid": proid, "attrinfo": defaultattr },
                success: function (msg) {
                    var data = eval("(" + msg + ")");
                    if (data.code == "success") {
                        var price = data.price;
                        var stocks = data.stocks;
                        if (price != "") {
                            if ($(".prod_buy .prod_dl_a1").hasClass("seckill_end")) {
                                $(".prod_buy .prod_dl_a1").removeClass("seckill_end");
                            }
                            if ($(".prod_buy .prod_dl_a2").hasClass("seckill_end")) {
                                $(".prod_buy .prod_dl_a2").removeClass("seckill_end");
                            }
                            $(".prod_price b").html("￥" + price);
                        }
                        else {
                            if (!$(".prod_buy .prod_dl_a1").hasClass("seckill_end")) {
                                $(".prod_buy .prod_dl_a1").addClass("seckill_end");
                            }
                            if (!$(".prod_buy .prod_dl_a2").hasClass("seckill_end")) {
                                $(".prod_buy .prod_dl_a2").addClass("seckill_end");
                            }
                            var defaultprice = $("#hdProPrice").val();
                            $(".prod_price b").html("￥" + defaultprice);
                        }
                        if (stocks != "") {
                            $(".prod_dl_stock .prod_stock_num").html(stocks);
                        }
                        else {
                            var defaultstocks = $("#hdProStocks").val();
                            $(".prod_dl_stock .prod_stock_num").html(defaultstocks);
                        }
                    }
                }
            });
        }
    }

    $(".prod_buy .pro_attr li").click(function () {
        var checktype = $("#hdchecktype").val();
        if (checktype != "seckill") {
            if ($(this).hasClass("cur")) {
                $(this).removeClass("cur").siblings("li").removeClass("cur");
            }
            else {
                if (!$(this).hasClass("cur2")) {
                    $(this).addClass("cur").siblings("li").removeClass("cur");
                }
            }

            var chkattrinfo = "";
            $(".prod_buy .pro_attr").each(function () {
                if ($(this).find(".cur").length > 0) {
                    var attrname = $(this).attr("attrname");
                    var attrval = $(this).find(".cur a").attr("currid");
                    chkattrinfo += "," + attrval;
                }
            });
            if (chkattrinfo != "") {
                chkattrinfo = chkattrinfo.substr(1);
                var proid = $("#hdProID").val();
                $.ajax({
                    type: "post",
                    url: "/product/ajax.ashx",
                    async: false,
                    data: { "type": "getattrprice", "proid": proid, "attrinfo": chkattrinfo },
                    success: function (msg) {
                        var data = eval("(" + msg + ")");
                        if (data.code == "success") {
                            var datainfo = data.info; //获取其他属性是否可选择
                            if (datainfo != "") {
                                var itemlist = new Array();
                                itemlist = datainfo.split("$");
                                $(".prod_buy .pro_attr li").each(function () {
                                    //if ($(this).parent().find(".cur").length == 0) {
                                    if ($(".prod_buy .pro_attr .cur").length == 1) {
                                        if ($(this).parent().find(".cur").length == 0) {
                                            var currval = $(this).find("a").attr("currid");
                                            if (!itemlist.contains(currval)) {
                                                $(this).addClass("cur2");
                                            }
                                            else {
                                                $(this).removeClass("cur2");
                                            }
                                        }
                                        else {
                                            $(this).removeClass("cur2");
                                        }
                                    }
                                    else {
                                        var currval = $(this).find("a").attr("currid");
                                        if (!itemlist.contains(currval)) {
                                            $(this).addClass("cur2");
                                        }
                                        else {
                                            $(this).removeClass("cur2");
                                        }
                                    }
                                    //}
                                });
                            }
                            var price = data.price;
                            var stocks = data.stocks;
                            if (price != "") {
                                if ($(".prod_buy .prod_dl_a1").hasClass("seckill_end")) {
                                    $(".prod_buy .prod_dl_a1").removeClass("seckill_end");
                                }
                                if ($(".prod_buy .prod_dl_a2").hasClass("seckill_end")) {
                                    $(".prod_buy .prod_dl_a2").removeClass("seckill_end");
                                }
                                $(".prod_price b").html("￥" + price);
                            }
                            else {
                                if (!$(".prod_buy .prod_dl_a1").hasClass("seckill_end")) {
                                    $(".prod_buy .prod_dl_a1").addClass("seckill_end");
                                }
                                if (!$(".prod_buy .prod_dl_a2").hasClass("seckill_end")) {
                                    $(".prod_buy .prod_dl_a2").addClass("seckill_end");
                                }
                                var defaultprice = $("#hdProPrice").val();
                                $(".prod_price b").html("￥" + defaultprice);
                            }
                            if (stocks != "") {
                                $(".prod_dl_stock .prod_stock_num").html(stocks);
                            }
                            else {
                                var defaultstocks = $("#hdProStocks").val();
                                $(".prod_dl_stock .prod_stock_num").html(defaultstocks);
                            }
                        }
                        totalrecomtotal();
                    }
                });
            }
            else {
                $(".prod_buy .pro_attr li").removeClass("cur2");  //如果没有任何项被选中则全部设为可选
            }
        }
    });

    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
    $(".prod_recom .prod_re_l .prod_re_d input[type=checkbox]").change(function () {
        totalrecomtotal();
    });

    $(".prod_dl_stock input[type='text']").change(function () {
        stockControl();
    });

    $(".prod_dl_stock .prod_dl_bt").click(function () {
        var inputVal = $(".prod_dl_stock input[type='text']").val();
        if ($(".maxbuynum").length>0) {
            var maxbuynum=$(".maxbuynum").html();
            var stockVal = $(".prod_dl_stock .prod_stock_num").html();
            if (parseInt(maxbuynum)>parseInt(stockVal)) {
                maxbuynum=stockVal;
            }
		    if((parseInt(inputVal)+1) > parseInt(maxbuynum)){
			    inputVal=maxbuynum;
		    }
            else {
                inputVal++;
            }
        }
        else{
		    var stockVal = $(".prod_dl_stock .prod_stock_num").html();
		    if((parseInt(inputVal)+1) > parseInt(stockVal)){
			    inputVal=stockVal;
		    }
            else {
                inputVal++;
            }
        }
        //$(".prod_dl_stock :text").val("inputVal");
        $(".prod_dl_stock input[type='text']").val(inputVal);
        return inputVal;
    });
    $(".prod_dl_stock .prod_dl_bb").click(function () {
        var inputVal = $(".prod_dl_stock input[type='text']").val();
        if (inputVal > 1) {
            inputVal--;
            $(".prod_dl_stock input[type='text']").val(inputVal);
            return inputVal;
        }
    });

    $(".shop_car_tb1 .shop_car_br").click(function () {
        var inputVal = $(this).siblings("input[type='text']").val();
        inputVal++;
        $(this).siblings("input[type='text']").val(inputVal);
        return inputVal;
    });
    $(".shop_car_tb1 .shop_car_bl").click(function () {
        var inputVal = $(this).siblings("input[type='text']").val();
        if (inputVal > 1) {
            inputVal--;
            $(this).siblings("input[type='text']").val(inputVal);
            return inputVal;
        }
    });


    $(".prod_eval_td3  a").click(function () {
        $(this).addClass("cur").siblings("a").removeClass("cur");
    });
    $(".prod_con_d").css("height", "0");
    $(".prod_con_d:eq(0)").css("height", "auto");
    $(".prod_con_list li").click(function () {
        $(this).addClass("cur").siblings("li").removeClass("cur");
        var index = $('.prod_con_list li').index(this); //获取当前<li>元素在全部 li 元素中的索引
        $('.prod_con_d:eq(' + index + ')').css("height", "auto").siblings(".prod_con_d").css("height", "0");
    });
    var eval_sp1 = $(".prod_eval_sp1").html();
    var eval_sp2 = $(".prod_eval_sp2").html();
    var eval_sp3 = $(".prod_eval_sp3").html();
    $('.prod_eval_i1').css("width", eval_sp1 + "%");
    $('.prod_eval_i2').css("width", eval_sp2 + "%");
    $('.prod_eval_i3').css("width", eval_sp3 + "%");

    $(".prod_eval_list li").click(function () {
        $(this).addClass("cur").siblings("li").removeClass("cur");
    });
    $(".prod_eval_img img").click(function () {
        $(this).addClass("cur").siblings("img").removeClass("cur");
        var exal_img_src = $(this).attr("src");
        $(this).parents("li").find(".prod_eval_img_show").html("<img src=" + exal_img_src + ">");
        $(window.parent.document).find("#iframecomment").height($(document).height());
        //parent.document.getElementById('iframecomment').style.height = $(document).height();
    });

    $(".prod_eval_img_show").click(function () {
        $(this).parents("li").find(".prod_eval_img img").removeClass("cur");
        $(this).html("");
        $(window.parent.document).find("#iframecomment").height($(document).height());
        //parent.document.getElementById('iframecomment').style.height = $(document).height();
    });

    $(".prod_eval_d_scores").each(function () {
        var eval_sc_sp_text = $(this).find("span").text();
        if (eval_sc_sp_text == 1) { $(this).find("i").removeClass().addClass("eval_sc_p1"); }
        else if (eval_sc_sp_text == 2) { $(this).find("i").removeClass().addClass("eval_sc_p2"); }
        else if (eval_sc_sp_text == 3) { $(this).find("i").removeClass().addClass("eval_sc_p3"); }
        else if (eval_sc_sp_text == 4) { $(this).find("i").removeClass().addClass("eval_sc_p4"); }
        else if (eval_sc_sp_text == 5) { $(this).find("i").removeClass().addClass("eval_sc_p5"); };
    });

    //    $(".reo_p1 a").click(function () {
    //        if ($(this).hasClass('reo_at')) {
    //            $(this).removeClass('reo_at').addClass("reo_ab");
    //        }
    //        else if ($(this).hasClass('reo_ab')) {
    //            $(this).removeClass('reo_ab').addClass("reo_at");
    //        }
    //    });
    /*-------------fade_wechat点击空白关闭 start----------*/
    $(".fade").hide();
    $(".login_wechat").click(function () {
        var randnum = Math.random();
        var currlink = "http://shenzhoushopdemo.toprand.com.cn/mobile/wxloginresult.aspx?rand=" + randnum;
        var linkurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx98190c91ad436768&redirect_uri=" + encodeURIComponent(currlink) + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
        linkurl = encodeURIComponent(linkurl);
        $.ajax({
            type: "POST",
            url: "/login.aspx",
            async: false,
            data: { "type": "addloginitem", "randnum": randnum, LinkUrl: linkurl },
            success: function (msg) {
                msg = eval("(" + msg + ")");
                if (msg.code == "success") {
                    $("#loginqrcode").html("");
                    var logincontent = msg.msg;
                    //var logincontent = "http://t.cn/RLU11ji";
                    var loginqrcode = new QRCode(document.getElementById("loginqrcode"), {
                        width: 250, //设置宽高
                        height: 250
                    });
                    loginqrcode.makeCode(logincontent);

                    $(".fade").show();
                    checklogin = setInterval(function () {
                        CheckWXLoginStatus(randnum);
                    }, 1000);
                }
            }
        });
    });

    $(".fade div:not(.fade_wechat)").click(function () {
        clearInterval(checklogin);
        $(".fade").hide();
    });
    /*-------------fade_wechat点击空白关闭 end----------*/
    $(".shop_process li").each(function () {
        if ($(this).hasClass('cur')) {
            $(this).prevAll("li").addClass("cur");
        }
        if ($(".shop_process li:eq(3)").hasClass('cur')) {
            $(".shop_process").addClass("cur");
        }
    });
    $(".order_process li").each(function () {
        if ($(this).hasClass('cur')) {
            $(this).prevAll("li").addClass("cur");
        }
        if ($(".order_process li:eq(4)").hasClass('cur')) {
            $(".order_process").addClass("cur");
        }
    });

    $(".shop_car_tb1 tr").each(function () {
        if ($(this).find('input:checkbox').attr("checked")) {
            $(this).addClass("cur");
        } else {
            $(this).removeClass("cur");
        }
    });
    $(".shop_car_tb1 input:checkbox").click(function () {
        if ($(this).attr("checked")) {
            $(this).parents("tr").addClass("cur");
        } else {
            $(this).parents("tr").removeClass("cur");
        }
    });
    $(".sp_car_collect .title3 a:eq(0)").addClass('cur');
    $(".sp_car_collect .sp_collect_ul").hide();
    $(".sp_car_collect .sp_collect_ul:eq(0)").show();
    $(".sp_car_like .title3 a:eq(0)").addClass('cur');
    $(".sp_car_like .sp_collect_ul").hide();
    $(".sp_car_like .sp_collect_ul:eq(0)").show();
    $(".title3 a").click(function () {
        $(this).addClass('cur').siblings("a").removeClass("cur");
        var index = $('.title3 a').index(this); //获取当前<li>元素在全部 li 元素中的索引
        $('.sp_collect_ul:eq(' + index + ')').show().siblings(".sp_collect_ul").hide();
    });

    $(".addr_a_add").click(function () {
        $("#hdeditaddr").val("");
        $("#chkprovince").val("");
        $("#chkcity").val("");
        $("#chkcounty").val("");
        $("#txtstreet").val("");
        $("#txtlinkman").val("");
        $("#txtzipcode").val("");
        $("#txtlinkphone").val("");
        $("#chkdefault").prop("checked", false);
        $(".address_add").show();
    });
    $(".address li input:radio").click(function () {
        var proweight = $("#hdProWeight").val();
        if (proweight != "") {
            if ($(this).prop("checked")) {
                $("#hdChkAddr").val($(this).val());
                GetCarriageMoeny();
                $(this).parents("li").addClass("cur").siblings("li").removeClass("cur"); ;
            }
        }
        else {
            if ($(this).prop("checked")) {
                $("#hdChkAddr").val($(this).val());
                GetOrderCheckOutList($(this).val());
                $(this).parents("li").addClass("cur").siblings("li").removeClass("cur"); ;
            }
        }

    });
    $(".orders_d1 p").hide();
    $(".orders_d1 input:checkbox").click(function () {
        if ($(this).attr("checked")) {
            $(".orders_d1 p").show();
            $("#hdIsUseScore").val("1");
        } else {
            $(".orders_d1 p").hide();
            $("#hdIsUseScore").val("0");
            $(".orders_d1 input[type=text]").val("0");
            GetExpressPriceInfo();
        }
    });

    $(".orders_d1 input:text").blur(function () {
        var maxusescore = $(".orders_d1 em").html();
        if ($(this).val() == "") {
            $(this).val("0");
        }
        if (parseInt($(this).val()) > parseInt(maxusescore)) {
            $(this).val(maxusescore);
        }
        GetExpressPriceInfo();
    }).keyup(function () {
        $(this).val($(this).val().replace(/[^\d]/g, ''));
    });

    $(".pay_d1 dl").hide();
    $(".pay_p1").click(function () {
        if (!$(this).hasClass('cur')) {
            $(this).addClass("cur");
            $(".pay_d1 dl").show();
        } else {
            $(this).removeClass('cur');
            $(".pay_d1 dl").hide();
        }
    });

    $(".fade2").hide();
    $(".paym_d1 input:button,.order_tb2_cancel").click(function () {
        var orderid = $(".hdorderid").val();
        var paytype = $(".hdpaytype").val();
        window.open("/payonline/" + paytype + "/pay.aspx?orderid=" + orderid);
        $(".fade2").show();
    });
    $(".fade2_close,.fade2_order input:button,.fade2_order input:reset").click(function () {
        //$(".fade2").hide();
        window.location.href = window.location.href;
    });


    $(".collect_ul li").click(function () {
        if (!$(this).hasClass('cur')) {
            $(this).addClass("cur");
        } else {
            $(this).removeClass('cur');
        }
    });
    $(".collect_title_r label input:checkbox").click(function () {
        if ($(this).attr("checked")) {
            $(".collect_ul li").addClass("cur");
        } else {
            $(".collect_ul li").removeClass("cur");
        }
    });

    $(".integ_title_r li").click(function () {
        $(this).addClass("cur").siblings("li").removeClass("cur");
        window.location.href = "myscore.aspx?scoretype=" + $(this).attr("itemtype");
    });

    $(".a_set_up").click(function () {
        if ($(this).hasClass('cur')) {
            $(this).text("默认地址");
        } else {
            $(".a_set_up").removeClass("cur");
            $(this).addClass("cur");
            $(".a_set_up").text("设置默认");
            $(this).text("默认地址");
        };
    });

    $(".img_upload li img").click(function () {
        $(this).siblings("input:file").click();
        //var a1 = $(this).siblings("input:file").url();
    });
    $(".img_upload li input:file").change(function () {
        var upimg = $(this);
        var file = $(this).prop('files')[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        /*fileReader.onload = function(){
        $(this).siblings("img").src = fileReader.result;
        //document.getElementById("myImage").src= fileReader.result;
        };*/
        fileReader.onload = function () {
            $(upimg).parents("li").find("img").attr("src", fileReader.result);
            var itemindex = $(upimg).parents("li").index();
            $(".img_upload i em").html(itemindex+1);
            if (itemindex<2) {
                $(".img_upload li:eq("+(itemindex+1)+")").show();
            }
            //document.getElementById("myImage").src = fileReader.result;
        };
    });

    $(".comment_heart a").click(function () {
        $(this).addClass("cur").prevAll("a").addClass("cur");
        $(this).nextAll("a").removeClass("cur");
        a_index = $(this).index();
        var score = parseInt(a_index) + 1;
        $(".comment_heart i i").html(score);
        if (parseInt(score) < 2) {
            $(".comment_heart i em").html("差评");
        }
        else if (parseInt(score) > 1 && parseInt(score) <4) {
            $(".comment_heart i em").html("中评");
        }
        else {
            $(".comment_heart i em").html("好评");
        }
        $("#hdCommentScore").val(score);
    });

    $(".comment_tag a").click(function () {
        if ($(this).hasClass('cur')) {
            $(this).removeClass("cur");
        } else {
            if ($(".comment_tag .cur").length < 3) {
                $(this).addClass("cur");
            }
        };
    });

    /*$(".np_param").css("height","0");
    $(".np_picture").css("height","0");
    //$(".np_param").css("height","auto");
    $(".np_a_param,.new_pro_l2").click(function(){
    $(this).addClass("cur").siblings().removeClass("cur");
    $('.np_param').css("height","auto").siblings(".np_picture").css("height","0");
    });
    $(".np_a_picture,.new_pro_l3").click(function(){
    $(this).addClass("cur").siblings().removeClass("cur");
    $('.np_picture').css("height","auto").siblings(".np_param").css("height","0");
    });*/

    $(".np_param").hide;
    $(".np_picture").hide;
    $(".np_a_param,.new_pro_l2").click(function () {
        $(this).addClass("cur").siblings().removeClass("cur");
        $('.np_param').show().siblings(".np_picture").hide();
    });
    $(".np_a_picture,.new_pro_l3").click(function () {
        $(this).addClass("cur").siblings().removeClass("cur");
        $('.np_picture').show().siblings(".np_param").hide();
    });
    if ($(".np_a_param").hasClass('cur')) {
        $(this).siblings().removeClass("cur");
        $('.np_param').show().siblings(".np_picture").hide();
    }
    if ($(".np_a_picture").hasClass('cur')) {
        $(this).siblings().removeClass("cur");
        $('.np_picture').show().siblings(".np_param").hide();
    }

    if ($("div").hasClass('side')) {
        var oldSite = new Object();
        oldSite.top = $(".side").offset().top;

        $(window).scroll(function () {
            var scrolltop = $(document).scrollTop();
            var top = oldSite.top + scrolltop;
            /*$(".side").offset({ top: top });*/
            if (scrolltop > 400) {
                $('.side').fadeIn(2 * 1000);
                $('.side').css({
                    'top': 180 + 'px',
                });
            } else {
                $('.side').fadeOut(2 * 1000);
            }
        });
    }
    $(".sidetop").click(function () {//回到顶部
        $('html, body').animate({ scrollTop: 0 }, 'slow'); //slow(),减速
    });
    $(".sidestar").click(function () {//明星产品
        $('html, body').animate({ scrollTop: 770 }, 'slow');
    });

    $(".sideleftitem").click(function(){
        var scrollvalue=GetScrollValue($(".sideleftitem").index($(this)));
        $('html, body').animate({ scrollTop: scrollvalue }, 'slow');
    });
//    $(".sidenotebook").click(function () {//笔记本
//        $('html, body').animate({ scrollTop: 1460 }, 'slow');
//    });
//    $(".sidepcpad").click(function () {//PCpad
//        $('html, body').animate({ scrollTop: 2150 }, 'slow');
//    });
//    $(".sidedesktop").click(function () {//台式机、一体机
//        $('html, body').animate({ scrollTop: 2530 }, 'slow');
//    });
//    $(".sidesystem").click(function () {//准系统
//        $('html, body').animate({ scrollTop: 3220 }, 'slow');
//    });
//    $(".sidearound").click(function () {//周边
//        $('html, body').animate({ scrollTop: 3910 }, 'slow');
//    });

    $(".prod_city_div").hide();
    $(".prod_address").click(function () {
        if ($(".prod_city_div").is(':visible')) {
            $(".prod_city_div").hide();
            $(this).removeClass("cur");
        }
        else {
            $(".prod_city_div").show();
            $(this).addClass("cur");
        }
    });
    $("#s_province").change(function () {
        //if($("#s_city").val()!="地级市"){
        var val1 = $("#s_province").val();
        $("#s_city").change(function () {
            var val2 = $("#s_city").val();
            $(".prod_addr_b1").text(val1);
            $(".prod_addr_b2").text(val2);
            $(".prod_city_div").hide();
            $(".prod_address").removeClass("cur");
            GetProExpressMoney(val1, val2);
        });
    });

});

var JPlaceHolder = {
	    //检测
	    _check: function () {
	        return 'placeholder' in document.createElement('input');
	    },
	    //初始化
	    init: function () {
	        if (!this._check()) {
	            this.fix();
	        }
	    },
	    //修复
	    fix: function () {
	        jQuery(':input[placeholder]').each(function (index, element) {
	            var self = $(this), txt = self.attr('placeholder');
	            self.wrap($('<div></div>').css({ position: 'relative', zoom: '1', border: 'none', background: 'none', padding: 'none', margin: 'none' }));
	            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
	            var holder = $('<div></div>').text(txt).css({ position: 'absolute', left: pos.left, top: pos.top, height: h, paddingLeft: paddingleft, color: '#aaa',LineHeight:h }).appendTo(self.parent());
	            self.focusin(function (e) {
	                holder.hide();
	            }).focusout(function (e) {
	                if (!self.val()) {
	                    holder.show();
	                }
	            });
	            holder.click(function (e) {
	                holder.hide();
	                self.focus();
	            });
	        });
	    }
	};
	//执行
	jQuery(function () {
	    //JPlaceHolder.init();
	});

	function CheckLoginData() {
	    var username = $("#txtUserName").val().trim();
	    var pwd = $("#txtPwd").val().trim();
	    if (username == "") {
	        $("#logintips").html("用户名不能为空");
	        $("#txtUserName").focus();
	        return false;
	    }
	    else {
	        if (!checkMobile(username) && !checkEmail(username)) {
	            $("#logintips").html("用户名格式输入有误");
	            $("#txtUserName").select();
	            return false;
	        }
	    }
	    if (pwd == "") {
	        $("#logintips").html("登录密码不能为空");
	        $("#txtPwd").focus();
	        return false;
	    }
	    else {
	        if (pwd.length < 6) {
	            $("#logintips").html("登录密码输入有误");
	            $("#txtPwd").select();
	            return false;
	        }
	    }
	    $("#logintips").html("");
	    return true;
	}

	$(".reg .reg_btn").click(function () {
	    var username = $("#txtUserName").val().trim();
	    var pwd = $("#txtPwd").val();
	    var repwd = $("#txtRePwd").val();
	    var validatecode = $("#txtValidateCode").val().trim();
	    var isread = $("#chkIsRead").is(':checked')
	    if (CheckRegisterData(username, pwd, repwd, validatecode, isread)) {
	        $(".reg .reg_btn").attr("disabled", "disabled");
	        $("#tipsinfo").html("");
	        $.ajax({
	            type: "POST",
	            url: "/register.aspx",
	            async: false,
	            data: { "type": "memberregister", "username": username, "pwd": pwd, "validatecode": validatecode },
	            success: function (msg) {
	                $(".reg .reg_btn").removeAttr("disabled");
	                if (msg != "") {
	                    var data = eval("(" + msg + ")");
	                    if (data.code == "fail") {
	                        $("#tipsinfo").html(data.msg);
	                        $("#reflashcode").click();
	                    }
	                    else {
	                        $("#tipsinfo").html("注册成功！");
                            var returl=$("#hdreturl").val();
                            if (returl!="") {
                                window.location.href =returl;
                            }
                            else{
	                            window.location.href = "/member/index.aspx";
                            }
	                    }
	                }
	            }
	        });
	    }
	});

    $(".login_out").click(function () {
	    $.ajax({
	        type: "POST",
	        url: "/product/ajax.ashx",
	        cache: false,
	        data: { "type": "loginout" },
	        success: function (msg) {
	            if (msg == "success") {
	                //$(".head_link").html("<a style='color:Red' href='/index.aspx'>商城首页</a><a href='/login.aspx'>登录</a>|<a href='/register.aspx'>注册</a>|<a href='http://www.hasee.com/Chinese/sell/network.aspx?cid=105001003004001' target='_blank'>销售网点</a>|<a href='http://www.hasee.com/Chinese/service/network.aspx?cid=105001003003002' target='_blank'>服务网点</a>");	                
	                window.location.href = window.location.href;
	            }
	        }
	    });
	});

    function CheckRegisterData(username, pwd, repwd, validatecode, isread) {
	    if (username == "") {
	        $("#tipsinfo").html("用户名不能为空");
	        $("#txtUserName").focus();
	        return false;
	    }
	    else {
	        if (!checkMobile(username) && !checkEmail(username)) {
	            $("#tipsinfo").html("用户名格式输入有误");
	            $("#txtUserName").select();
	            return false;
	        }
	    }
	    if (pwd == "") {
	        $("#tipsinfo").html("密码不能为空");
	        $("#txtPwd").focus();
	        return false;
	    }
	    else {
	        if (pwd.length < 6 || pwd.length > 20) {
	            $("#tipsinfo").html("密码长度为6-20");
	            $("#txtPwd").select();
	            return false;
	        }
	    }
	    if (pwd != repwd) {
	        $("#tipsinfo").html("两次密码输入不一致");
	        $("#txtRePwd").select();
	        return false;
	    }
	    if (validatecode.length != 4) {
	        $("#tipsinfo").html("验证码输入有误");
	        $("#txtValidCode").select();
	        return false;
	    }
	    if (isread != true)
	    {
	        $("#tipsinfo").html("请阅读《神舟用户注册协议》");
	        return false;
	    }
	    return true;
	}

	function CheckWXLoginStatus(randnum) {
	    $.ajax({
	        type: "POST",
	        url: "/login.aspx",
	        async: false,
	        data: { "type": "chkloginstatus", "randnum": randnum },
	        success: function (msg) {
	            if (msg == "success") {
	                $(".fade div:not(.fade_wechat)").click();
	                window.location.href = window.location.href;
	            }
	        }
	    });
	}

	String.prototype.trim = function () { return this.replace(/^\s*|\s*$/g, ''); };
	function checkMobile(s) {
	    var myreg = /^1[35847]\d{9}$/;
	    if (myreg.test(s)) {
	        return true;
	    }
	    else {
	        return false;
	    }
	}

	function checkEmail(str) {
	    var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	    if (re.test(str)) {
	        return true;
	    } else {
	        return false;
	    }
	}

	function stockControl(){
	    if ($(".maxbuynum").length > 0) {//秒杀判断最大购买数量
            var maxbuynum=$(".maxbuynum").html();
            var stockVal = $(".prod_dl_stock .prod_stock_num").html();
		    var inputVal = $(".prod_dl_stock input[type=text]").val();
            if (parseInt(maxbuynum)>parseInt(stockVal)) {
                maxbuynum=stockVal;
            }
		    if(parseInt(inputVal) > parseInt(maxbuynum)){
			    $(".prod_dl_stock input[type=text]").val(maxbuynum);
			    return maxbuynum;
		    }
        }
        else{
		    var stockVal = $(".prod_dl_stock .prod_stock_num").html();
		    var inputVal = $(".prod_dl_stock input[type=text]").val();
		    if(parseInt(inputVal) > parseInt(stockVal)){
			    $(".prod_dl_stock input[type=text]").val(stockVal);
			    return stockVal;
		    }
        }
	}

	//_init_area();//产品详情页省市多级联动

	function isNum(a) {
	    var reg = /^d+$/
	    return reg.test(a);
	}

	function GetProExpressMoney(province, city) {
	    var proweight = $("#hdProWeight").val();
	    $.ajax({
	        type: "POST",
	        url: "/product/ajax.ashx",
	        async: false,
	        data: { Type: "getexpressmoney", Province: province, City: city, ProWeight: proweight },
	        success: function (data) {
	            data = eval("(" + data + ")");
	            if (data.code == "success") {
	                $(".prod_freight i").html("￥" + data.msg);
	            }
	        }
	    });
	}

    $(".prod_recom .prod_dl_a2").click(function () {
        var checkcount = $(".prod_recom .prod_re_d input[type=checkbox]:checked").length;
        if (checkcount > 0) {
            var gobuycommodity="";
            var mainproid=$("#hdProID").val();
            var mainproattr="";
            var attrinfo = "";
            $(".pro_attr").each(function () {
                if ($(this).find(".cur").length == 0) {
                    return false;
                }
                else {
                    var attritem = $(this).find(".cur a").attr("currid");
                    mainproattr += "," + attritem;
                }
            });
            if (mainproattr=="") {
                mainproattr= $(".hdProDefaultAttr").val();
            }
            else {
                mainproattr=mainproattr.substr(1);
            }
            AddMultipleItem(mainproid, 0, 1, mainproattr);

            gobuycommodity+= mainproid+"|"+mainproattr;

            $(".prod_recom .prod_re_d input[type=checkbox]:checked").each(function () {
                var attrinfo = $(this).parents("div").find(".hddefaultattr").val();
                var proid = $(this).parents("div").find(".hdtjproid").val();
                AddMultipleItem(proid, 0, 1, attrinfo);
                gobuycommodity+="$"+proid+"|"+attrinfo;
            });

            $.ajax({
                type:"POST",
                url:"/product/ajax.ashx",
                async:false,
                data:{"type":"savegobuy","gobuyinfo":gobuycommodity},
                success:function(msg){
                    if (msg=="success") {
                        window.open("/cart/ordercheckout.aspx");
                    }
                }
            });
        }
        else {
            alert("请选择配件！");
        }
    })

    //收藏按钮
//    $('.prod_collect').on('click', function() {
//        var sel = $(this).hasClass('prod_collect_sel');
//        if(!sel) {
//            $(this).addClass('prod_collect_sel');
//        }else {
//            $(this).removeClass('prod_collect_sel');
//        }
//    });

     /*查看商品下面的小图切片效果*/
    var tdWidth = $('.prod_i_show table tr td').width() + 2;
    var tdLen = $('.prod_i_show table tr td').length;
    var trWidth = tdWidth * tdLen + 'px';
    $('.prod_i_show table tr').width(trWidth);
    /*向左箭头*/
    $('.prev-btn').on('click', function() {
        var imgList = $('.prod_i_show table tr');
        var offset = ($('.prod_i_show table tr td').width()) * (-1);
        var lastImg = $('.prod_i_show table tr td').last();
        var ulL = $('.prod_i_show ul li').last();
        $('.prod_i_show ul').prepend(ulL);
        imgList.prepend(lastImg);
        imgList.css({'left': offset});
        imgList.stop().animate({
            left: '0px',
        });
    });
    /*向右箭头*/
    $('.next-btn').on('click', function() {
        nextpage();
    });
    /*动画函数*/
    function nextpage() {
        var imgList = $('.prod_i_show table tr');
        var offset = ($('.prod_i_show table tr td').width()) * (-1);
        imgList.animate({left: offset}, function() {
            var firstImg = $('.prod_i_show table tr td').first();
            imgList.stop().append(firstImg);
            var ulF = $('.prod_i_show ul li').first();
            $('.prod_i_show ul').append(ulF);
            imgList.css({'left': '0px'});
        });
    }

    function GetScrollValue(index){
        var scrollvalue=770+$(".star_single").height();
        if (index>0) {
            for (var i = index; i > 0; i--) {
                scrollvalue+=$(".menuicon_"+(i-1)).parent().height();
            }
        }
        return scrollvalue;
    }

    function totalrecomtotal()
    {
        var totalnum = $(".prod_recom .prod_re_l .prod_re_d input[type=checkbox]:checked").length;
        var totalmoney = parseFloat($(".prod_price b").html().replace("￥", ""));
        if (totalnum>0) {
            $(".prod_recom .prod_re_l .prod_re_d input[type=checkbox]:checked").each(function () {
                var currmoney = $(this).parent().find(".itemprice").html();
                totalmoney += parseFloat(currmoney);
            });
        }
        $(".prod_recom .prod_re_r .recommendnum").html(totalnum);
        $(".prod_recom .prod_re_r .recommendmoney").html(totalmoney.toFixed(2));
    }