/*
**@name		刮刮卡
**@作者		Cris
**@时间		2105-3-20
**@版本	1.0
**/

(function($){
	//默认参数
	var defaults = {
		imgUrl : "",
		width : 280,
		height : 382
	};
	
	//card类
	//@param 	element	事件对象
	//@param	options	配置参数 	
	function Plugin(element, options){
		this.element = element;
		this.options = $.extend({}, defaults, options);	
		this.init(element);
	}	
	Plugin.prototype = {
		//初始化
		init:function(element){
			var _this = this,
				bodyStyle = document.body.style;
			_this.flag = true;
			_this.img = new Image();
			_this.img.src = this.options.imgUrl;
			_this.element = $(element);
			_this.canvas = $(element).get(0);
			
			//禁止鼠标选中事件
			bodyStyle.mozUserSelect = 'none'; 
			bodyStyle.webkitUserSelect = 'none';
			
			//事件调用
			_this.resetCard(element);			
			_this.eventListener(element);
		},
		resetCard:function(element){
			var _this = this;			
			$(element).css({
				"backgroundColor":"transparent",
				"position":"absolute"
			});
		},
		//监听图片加载时间
		eventListener:function(element){
			var _this = this;
			_this.img.addEventListener('load', function(e) {				
				_this.mousedown = false;
				_this.w = _this.options.width, 
				_this.h = _this.options.height;
				//画布外框CSS
				$(".guaguaka").css({ width : _this.w , height : _this.h });
				//画布CSS
				_this.canvas.width=_this.w; 
    			_this.canvas.height=_this.h;
				_this.canvas.style.backgroundImage='url('+_this.options.imgUrl+')';
				_this.canvas.style.backgroundSize= _this.w + "px " + _this.h +"px";
				_this.offsetX = _this.canvas.offsetLeft, 
        		_this.offsetY = _this.canvas.offsetTop;
				//实例化CTX
				_this.ctx = _this.canvas.getContext('2d');
				//画这遮罩层
				_this.layer();
				_this.ctx.globalCompositeOperation = 'destination-out';
				//绑定事件
				_this.eventDown(); 
				_this.eventUp(); 
				_this.eventMove();
			});
		},
		//绘制灰色矩形
		layer:function(cObj){
			var _this = this;
			_this.ctx.fillStyle = 'gray'; 
        	_this.ctx.fillRect(0, 0, _this.w, _this.h);
		},
		eventDown:function(){
			var _this = this,
				device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),//判断设备
				clickEvtName = device ? 'touchstart' : 'mousedown';
			_this.canvas.addEventListener(clickEvtName, function(e){
				if(_this.flag)
				{
					e.preventDefault();
					_this.mousedown=true;
				}
				else
				{
					return false;
				}
			});
			//touchstart
		},
		eventUp:function(){
			var _this = this,
				device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),//判断设备
				clickEvtName = device ? 'touchend' : 'mouseup';
			_this.canvas.addEventListener(clickEvtName, function(e){
				if(_this.flag)
				{
					e.preventDefault();
					_this.mousedown=false;
				}
				else{
					return false;
				}
			});
			//touchend		
		},
		eventMove:function(){
			var _this = this,
				device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase())),//判断设备
				clickEvtName = device ? 'touchmove' : 'mousemove';
			_this.canvas.addEventListener(clickEvtName, function(e){	
				if(_this.flag)
				{			
					e.preventDefault();
					if(_this.mousedown) { 
						if(e.changedTouches){ 
							e=e.changedTouches[e.changedTouches.length-1]; 
						} 
						var x = (e.clientX + document.body.scrollLeft || e.pageX) - _this.offsetX || 0, 
							y = (e.clientY + document.body.scrollTop || e.pageY) - _this.offsetY || 0;
						with(_this.ctx) { 
							beginPath();
							//增加渐变
							var radgrad = _this.ctx.createRadialGradient(x, y, 0, x, y, 30);
							radgrad.addColorStop(0, 'rgba(0,0,0,0.6)');
							radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
							_this.ctx.fillStyle = radgrad;
							//绘制圆点
							arc(x, y, 30, 0, Math.PI * 2); 
							fill(); 
							_this.getTransparentPercent();
						} 
					}
				}else
				{
					return false;
				}
			});
		},
		//计算百分比
		getTransparentPercent:function(){
			var _this = this,
				imgData = _this.ctx.getImageData(0, 0, _this.w, _this.h),				
				//获取每个像素点的信息，包含RGB和alpha
				//red=imgData.data[0];green=imgData.data[1];blue=imgData.data[2];alpha=imgData.data[3];
				pixles = imgData.data,
				transPixs = [];		
			for (var i = 0, j = pixles.length; i < j; i += 4) {
				var a = pixles[i + 3];
				if (a < 128) {//小于128为透明
					transPixs.push(i);
				}
			}
			//计算透明区域百分比
			var percent = (transPixs.length / (pixles.length/4) * 100).toFixed(2);
			$("#persent").val( percent + "%");
			
			//刮开区域大于60%，提示中奖
			if( percent > 60 )
			{
				_this.ctx.fillStyle = 'gray'; 
        		_this.ctx.fillRect(0, 0, _this.w, _this.h);
				_this.flag = false;
				alert("恭喜您，中奖啦");
			}			
			return ;
		}
	};
	
	//刮刮卡插件调用方法
	$.fn.card = function(options){
		this.each(function(){
			var $this = $(this),
				//实例化刮刮卡类
			 	stellar = new Plugin($this,options);
		});
	};
})(jQuery)