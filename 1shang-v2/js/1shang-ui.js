/****表单验证start****/

//预定义正则
var reg={
	required : /[^(^\s*)|(\s*$)]/,//必填
	email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,//邮件
	phone : /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,//座机电话
	mobile : /^0?1(3|4|5|7|8)\d{9}$/,//手机
	number : /^\d+$/,//数字
	english : /^[A-Za-z]+$/,//字母
	chinese : /^[\u0391-\uFFE5]+$/,//中文
	bank : /^(\d{16}|\d{19})$/,//银行账户
	password : /^.{6,16}$/,//6位+密码
	complexity : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$///密码复杂度
};

var next = true;

//验证函数
$.fn.check =function()
{
	//alert(obj);
	//获取dataType和错误提示信息
	var datatype = $(this).attr('datatype');
	if(typeof(datatype) == "undefined") return true;
	var errmsg = $(this).attr('errmsg');
	if(typeof(errmsg) == "undefined") return true;
	var type = $(this).attr("type");
	
	//信息转化数组
	var datatypes = datatype.split('|');
	var errmsgs = errmsg.split('|');
	//非checkbox型
	if(type != "checkbox")
	{
		//遍历
		for(var i=0; i < datatypes.length; i++)
		{
			switch(datatypes[i]){
				//字段型判断
				case "required":
				case "email":
				case "phone":
				case "mobile":
				case "number":
				case "english":
				case "chinese":
				case "bank":
				case "password":
				case "complexity":			
				var _reg = eval(reg[datatypes[i]]);
				if(!_reg.test($(this).val()))
				{
					$(this).showErrorMsg(errmsgs[i]);
					next = false;
					//$(this).focus();
					return false;
				}
				else
				{
					next = true;
					$(this).hideErrorMsg();
				}
				break;
				case "phone-mobile":
				if(reg.phone.test($(this).val())||reg.mobile.test($(this).val()))
				{
					next = true;
					$(this).hideErrorMsg();
				}
				else
				{
					$(this).showErrorMsg(errmsgs[i]);
					next = false;
					//$(this).focus();
					return false;					
				}
				break;
				
				//判断密码2次是否一致
				case "repassword":
				var _id = $(this).attr("pId");
				var reVal = $(this).val();
				var val = $("#"+ _id).val();
				if(reVal != val)
				{
					$(this).showErrorMsg(errmsgs[i]);
					next = false;
					//$(this).focus();
					return false;
				}
				else
				{
					next = true;
					$(this).hideErrorMsg();
				}
				break;
				
				default:
				console.warn("不正确的datatype");
				break;
			}
		}
	}
	else
	//checkbox型
	{
		var name = $(this).attr("name");
		var flag = 0; 
		$("input[name="+ name +"]:checkbox").each(function(){
			if($(this).attr("checked")) 
			{ 
				flag += 1; 
			} 
		});	
		if(flag >0) 
		{
			next = true;
			$(this).hideErrorMsg();
		} 
		else 
		{
			$(this).showErrorMsg(errmsg);
			next = false; 
			return false;
		}
	}
	
}
 

$.fn.checkForm = function(options)
{			
	var form=$(this);
	var elements = form.find('input[datatype]');
	
	var eachCheck = function()
	{
		next = true;
		elements.each(function(){
			if(next)
			$(this).check();
		});
	};

	elements.focus(function(){
		$(this).hideErrorMsg();
	});

	
	next = true;
	elements.each(function(){
		if(next)
		$(this).check();
	});	
	
	return next;	
}
//显示错误信息
$.fn.showErrorMsg = function(msg)
{
	var _this = this,
		_type = $(this).attr("errtype");
	if(typeof(_this.get(0)) == "undefined") {return false;}
	//判断元素类型	
	if(_this.get(0).type == "hidden")
	{
		layer.alert(msg,3,"错误",function(){
			layer.close(layer.index);
		});
	}
	/*else if(_this.get(0).type == "checkbox" || _this.get(0).type == "radio")
	{
	}*/
	else
	{
		if(_type == "pop")
		{
			var $parent = $(_this).parent(),
				_html = "";
				_html += '<div class="popErrBox">';
                _html += '<span class="errContent">' + msg + '</span><em></em>';
				_html += '</div>';
			$parent.addClass("popParent");
			$parent.append(_html);
			if(_this.get(0).type == "checkbox" || _this.get(0).type == "radio")
			{
				$parent.find(".popErrBox").css({"left":"-22px","top":"-20px"});				
			}
		}
		else
		{
			layer.alert(msg,3,"错误",function(){
				layer.close(layer.index);
			});
		}
	}
}
//隐藏错误信息
$.fn.hideErrorMsg = function()
{
	var _this = this,
		_type = $(this).attr("errtype");
	if(typeof(_this.get(0)) == "undefined") {return false;}
	//判断元素类型	
	if(this.get(0).type == "hidden")
	{
		
	}
	/*else if(this.get(0).type == "checkbox" || this.get(0).type == "radio")
	{

	}*/
	else
	{
		if(_type == "pop")
		{
			$(_this).siblings(".popErrBox").remove();
		}
	}
}
/****表单验证end****/

/****jCheckBox start****/
//checkbox
$.fn.checkbox = function(options){
	var defaults = {     
	  };      
  	var opts = $.extend(defaults, options); 
	this.each(function(){
		var $this = $(this),
			checkName = $this.attr("checkName"),
			checkBox = $("input[name='" + checkName + "']");
		//点击事件
		$this.find("li").click(function(){
			var _this = $(this),
				_checkid = _this.attr("checkid"),
				_index = _this.index();
			if(_this.hasClass("selected"))
			{
				_this.removeClass("selected");
				$("#" + _checkid).attr("checked", false);
			}
			else
			{
				_this.addClass("selected");
				$("#" + _checkid).attr("checked", true);
			}
		});
	});
};
/****jCheckBox end****/

/****图片滚动 start****/
$.fn.picScroll = function(options){
	var _this = this,
		defaults = {width:150},
		opts = $.extend(defaults, options);
	_this.each(function(){
		var $this = $(this),
			_width = opts.width,
			_leftBtn = $this.find(".turnLeft"),
			_rightBtn = $this.find(".turnRight"),
			_picBox = $this.find(".turnContent"),
			_picUl = $this.find("ul"),
			_length = $this.find("ul li").length;
		_leftBtn.click(function(){
			$this.find("ul li").eq(_length-1).prependTo(_picUl);
			_picUl.css("left",0 - _width)
				  .animate(
					{left: 0},
					1000,
					function(){
			});
		});
		_rightBtn.click(function(){
			_picUl.animate(
				{left: 0 - _width},
				1000,
				function(){
					$this.find("ul li").eq(0).appendTo(_picUl);
					_picUl.css("left",0);				
			});
		});				
	}); 
};
/****图片滚动 end****/

/****select start****/
$.fn.jSelect = function(options){
	
	var _this = this,
		defaults = {},
		_length = _this.length,
		opts = $.extend(defaults, options);
	
	//向上滑动
	var switch_current=-1;
	var _height=$(_this).height();
	function switchUp(optionBox,selectBox){
		if(optionBox.hasClass("switchUp")){
			var zIndex = selectBox.parent("dd").css("z-index");
			selectBox.parent("dd").css("z-index",_length+1);
			switch_current=zIndex;
			
			var height = optionBox.height()+_height+2;
			optionBox.css("margin-top",0-height);
		}
	}
	
	function fold(optionBox,selectBox){
		if(optionBox.hasClass("switchUp")&&switch_current!=-1){
			selectBox.parent("dd").css("z-index",switch_current);
			switch_current=-1;
		}
	}
	
	_selectBoxArr = new Array();
	_this.each(function(i){
		var $this = $(this),
			_hidden = $this.siblings("input[type='hidden']"),
			_optionList = $this.siblings(".optionBox");
		_selectBoxArr.push($this);
		//自上而下z-index定位
		$this.parent("dd").css("z-index",_length - i);
		//绑定点击事件
		$this.click(function(){
			var _self = this;
			_optionList.show();
			switchUp(_optionList,$this);//向上展开
		});
		_optionList.find("li").click(function(){
			var _val = $(this).html();
			$this.html(_val);
			_hidden.val(_val);
			fold(_optionList,$this);//收起
		});
	});
	$(document).mouseup(function(e){
		if($(e.target).parent(".optionBox").length==0){
			$(".optionBox").hide(); 
		}
		for(var i=0;i<_selectBoxArr.length;i++){
			if(_selectBoxArr[i].parent("dd").css("z-index")==(_length+1) && switch_current!=-1){
				_selectBoxArr[i].parent("dd").css("z-index",switch_current)
				switch_current=-1;
			}
		}
	});	
};
/****select end****/

/***轮播***/
(function(jQuery){
jQuery.fn.th_focus_swing = function(options)
	{
		var defaults = {
			time		:5000,		//轮换秒数
            index		:1,			//默认第几张		
			speed		:500,		//切换时间
			dis			:693,
			splits 		:1			//总标签
		};
		var opts = jQuery.extend(defaults, options);
		
		var _index = opts.index;
		var _time = opts.time;
		var _speed = opts.speed;
		var _dis = opts.dis;
		var _splits = opts.splits;
		
		var _this = jQuery(this);
		
		var node_ul = _this.find(".contentimg");	
		var node_li = node_ul.find("li");
		var node_li_desc = jQuery(".contentdesc").find("li");
		var node_li_nav = jQuery(".mfoc_nav").find("li");
		
		var li_len = node_li.length;
		
		var _countIndex = (node_li.length/opts.split -  1)    
		var _start_left = node_ul.css("left");                
 		
		var _timer = setInterval(show, _time);

        init();
		//alert(1);
		function init() {
			node_ul.mouseover(function() {
				_timer = clearInterval(_timer);
			}).mouseout(function() {
				_timer = setInterval(show, _time);
			});
			node_li_desc.mouseover(function() {
				_timer = clearInterval(_timer);
			}).mouseout(function() {
				_timer = setInterval(show, _time);
			});
			
			node_li_nav.mouseover(function() {
				 node_ul.stop(true, true);
				 node_li_desc.stop(true, true);
				 node_li_desc.eq(_index-1).css("display", "none");
				 node_li_nav.eq(_index-1).removeClass("selected");
				 _index = parseInt(jQuery(this).attr("_index"));
				 node_li_desc.eq(_index-1).fadeIn(_speed);
				 node_li_nav.eq(_index-1).addClass("selected");
				 _left = -_dis*(_index - 1); 
				 node_ul.animate({"left": _left}, _speed);
				_timer = clearInterval(_timer);
			}).mouseout(function() {
				_timer = setInterval(show, _time);
			});
		}
		
		function show() {
                        //alert(2);
			node_ul.stop(true, true);
			node_li_nav.eq(_index-1).removeClass("selected");
			node_li_desc.eq(_index-1).css("display", "none");
			_index++;
			if(_index > li_len) {
				node_ul.append(node_ul.find("li:lt(1)"));
				node_ul.css("left", parseInt(node_ul.css("left")) + _dis);
				node_li_nav.eq(0).addClass("selected");
				node_li_desc.eq(0).fadeIn(_speed);
			}
			else {
				node_li_nav.eq(_index-1).addClass("selected");
				node_li_desc.eq(_index-1).fadeIn(_speed);
			}
			var _left = parseInt(node_ul.css("left")) - _dis;
			node_ul.animate({"left": _left}, _speed, function() {
					if(_index > li_len) {
						node_ul.prepend(node_ul.find("li:gt("+(li_len-_splits-1)+")"));
						node_ul.css("left", 0);
						_index = 1;
					}
					
			});
			
		}
	}
})(jQuery);

/***轮播***/

/*header ctrl*/
var globalController = {
	init:function(){
		var _this = this;
		
		_this.load();
		
	},
	load:function(){
		var _this = this;
		_this.bindEvent();
		_this.feedBackEvent();
		_this.nbsp();
	},
	bindEvent:function(){
		var _this = this;
		//购物车hover事件
		$(".carLink,.carBoxNew").hover(
			function(){
				$(".carBoxNew").show();	
			},
			function(){
				$(".carBoxNew").hide();
			}
		);
		//网站导航hover事件
		$(".siteNav,.siteNavBox").hover(
			function(){
				$(".siteNavBox").show();	
			},
			function(){
				$(".siteNavBox").hide();
			}
		);
		//公众微信
		$(".wechat,.wechatBox").hover(
			function(){
				if($(this).hasClass("wechatBox"))
				{
					var wechat = $(this);
				}
				else
				{
					var wechat = $(this).siblings(".wechatBox");
				}
				wechat.show();
			},
			function(){
				if($(this).hasClass("wechatBox"))
				{
					var wechat = $(this);
				}
				else
				{
					var wechat = $(this).siblings(".wechatBox");
				}
				wechat.hide();
			}
		);
		//奖品特性title
		$(".icoBox span").hover(
			function(){
				var $this = $(this);
				$this.find(".titleBox").show();
			},
			function(){
				var $this = $(this);
				$this.find(".titleBox").hide();
			}
		);
		//条件筛选
		$(".navigation .navLeft,.conditionHiddenBox").hover(
			function(){
				$(".conditionHiddenBox").show();
			},
			function(){
				$(".conditionHiddenBox").hide();
			}
		);
		$(".rightToTop").click(function(){
			$(window).scrollTop(0);
		});
	},
	feedBackShow:function(){
		$(".feedbackBox").addClass("on");
		$(".feedbackText").html("");
		$(".feedBackInput").val("");
	},
	feedBackHide:function(){
		$(".feedbackBox").removeClass("on");
	},
	feedBackEvent:function(){
		var _this = this;
		var right = ($(window).width() - 1200) / 2 - 66;
		$(".rightFixed").css({"right":0});
		/*$(".feedbackParent").click(function(){
			var $this = $(this),
				flag = $this.attr("rightflag");
			if(flag == "1")
			{
				_this.feedBackShow();
				$this.addClass("on");
				$this.attr("rightflag","0");
			}
		});*/
		$(document).mouseup(function(e){
			if($(e.target).closest(".feedbackBox").length==0){
				var flag = $(".feedbackParent").attr("rightflag"),
					thisFlag = $(e.target).attr("rightflag");
				if(thisFlag == "1")
				{
					_this.feedBackShow();
					$(e.target).addClass("on");
					$(e.target).attr("rightflag","0");
				}
				else if(flag == "0")
				{
					$(".feedbackBox,.feedbackParent").removeClass("on");
					$(".feedbackParent").attr("rightflag","1");
				}
			}
		});
	},
	nbsp:function(){
		$("td").each(function(){
			var $this = $(this),
				_html = $this.html();
			if(_html == "")
			{
				$this.html("&nbsp;");
			}
		});
	}
};
$(document).ready(function(){
	globalController.init();
	
	var demandMarqueeBox = function(){
		var $marquee = $(".demandBox .marqueeBox"),
			_num = $marquee.attr("marqueeNum"),
			_marqueeBlock = $marquee.find(".marqueeBlock"),
			_height = _marqueeBlock.find("ul").height();
		_marqueeBlock.animate(
			{"margin-top":"-" + _height + "px"},
			3000,
			function(){
				_marqueeBlock.find("ul").eq(0).appendTo(_marqueeBlock);
				_marqueeBlock.css("margin-top",0);
				
			}
		);
	};
	setInterval(demandMarqueeBox,8000);
	var joinMarqueeBox = function(){
		var $marquee = $(".joinUs .marqueeBox"),
			_num = $marquee.attr("marqueeNum"),
			_marqueeBlock = $marquee.find(".marqueeBlock"),
			_height = _marqueeBlock.find("ul").height();
		_marqueeBlock.animate(
			{"margin-top":"-" + _height + "px"},
			3000,
			function(){
				_marqueeBlock.find("ul").eq(0).appendTo(_marqueeBlock);
				_marqueeBlock.css("margin-top",0);
				
			}
		);
	};
	setInterval(joinMarqueeBox,8000);
});