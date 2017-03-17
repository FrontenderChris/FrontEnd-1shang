/*
**@name		转盘类
**@作者		Cris
**@时间		2105-3-31
**@版本	1.0
**/

//jquery闭包
(function($){
	//默认参数
	var defaults = {
		now:0
	};
	
	//申明card类
	//@param 	element	事件对象
	//@param	options	配置参数 	
	function Plugin(element, options){
		this.element = element;
		this.options = $.extend({}, defaults, options);	
		this._defaults = defaults;
		this.init(element);		
	}
		
	Plugin.prototype = {
		init:function(element){
			var _this = this;
			_this.bindEvent();
			_this.run();
		},
		bindEvent:function(){
			var _this = this;			
			/*$(_this.element).get(0).addEventListener('transitionend', function(){
				alert('您中奖了');
			},false);*/	
		},
		run:function(){
			var _this = this;
			console.log(defaults.now);
			//设置旋转角度
			defaults.now += 270;			
			$(_this.element).css(
				{					
					"-webkit-transform":"rotateZ(" + defaults.now + "deg)",
					"-moz-transform": "rotateZ(" + defaults.now + "deg)",
					"transform":"rotateZ(" + defaults.now + "deg)"
				}
			);			
	  	}
	};
	
	//转盘插件调用方法
	$.fn.rotate = function(options){
		this.each(function(){
			var $this = $(this),
				//实例化刮刮卡类
			 	stellar = new Plugin($this,options);
		});
	};
	
	$(function($){
		$("#turnTableBtn").click(function(){
			$(".turnTable").rotate();
		});
	});
	
})(jQuery)