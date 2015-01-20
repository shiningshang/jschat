var jschatJQuery = $.noConflict(true);
var jschatClient = function(){
	//private attribute
	var _self = this,
	_host = "http://127.0.0.1/",
	//心跳间隔时间
	_callbackTimes = 5000,
	//停止监听 stop
	_stop = null,
	_say = [{content:"您好！O(∩_∩)O~",delay:8000},{content:"亲，有需要什么帮助的吗？",delay:12000}],
	ENTER = 13,
	//private method
	_dopost = function(o,callback){
		o.appkey = args['appkey'];
		jschatJQuery.ajax({
			url : _host+"chat/client.php",
			data : o,
			dataType : "jsonp",
			jsonpCallback : "callback",
			success : callback
		})
	},
	_currentTime = function(formatStr)   
	{   
	    var str = formatStr;   
	    var Week = ['日','一','二','三','四','五','六'];  
	    var date = new Date();
	    str=str.replace(/yyyy|YYYY/,date.getFullYear());   
	    str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));   
	    var month = date.getMonth()+1; 
	    str=str.replace(/MM/,month>9?month.toString():'0' + month);   
	    str=str.replace(/M/g,month);   
	  
	    str=str.replace(/w|W/g,Week[date.getDay()]);   
	  
	    str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());   
	    str=str.replace(/d|D/g,date.getDate());   
	  
	    str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());   
	    str=str.replace(/h|H/g,date.getHours());   
	    str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());   
	    str=str.replace(/m/g,date.getMinutes());   
	  
	    str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());   
	    str=str.replace(/s|S/g,date.getSeconds());   
	    return str;   
	},
	_printMsg = function (msg) {
		var m = [];
		if(msg.sendid.match("server")){
			m.push("<div class=\"in fix\"><div class=\"info\">");
			m.push("客服&nbsp;&nbsp;");
		}else{
			m.push("<div class=\"out fix\"><div class=\"info\">");
			m.push("我&nbsp;&nbsp;");
		}
		m.push(msg.send_time);
		m.push("</div><div class=\"text\"><div class=\"cloudPannel\"><div class=\"cloudBody\"><div class=\"cloudContent\"><pre style=\"white-space: pre-wrap\">");
		m.push(msg.content);
		m.push("</pre></div></div><div class=\"cloudArrow\"></div></div></div></div>");
		return  m.join("");
	};
	//public method
	this.sayHello = function (content) {
		jschatJQuery(".chat_list").append(_printMsg({
			is_online : 1,
			has_new_msg : 1,
			send_time : _currentTime("yyyy-MM-dd HH:mm:ss"),
			sendid : "server",
			content : content
		}));
	};
	this.getHistory = function() {
		jschatJQuery(".chat_box .history").click(function() {
			_dopost({dopost : "readHistory"},function(res){
				jschatJQuery(".chat_box .chat_list").html("");
				var msgs = eval("[" + res.data + "]");
				jschatJQuery.each(msgs, function(i, msg) {
					if (msg.has_new_msg) {
						jschatJQuery(".chat_box .chat_list").append(_printMsg(msg));
						jschatJQuery(".chat_box .chat_list").scrollTop(1000000);
						jschatJQuery(".chat_box .ipt_area").focus();
					}
				});
			});
		})
	};
	this.readCurrent = function() {
		_dopost({dopost : "readCurrent"},function(msg){
			msg = msg.data;
			if (msg.has_new_msg) {
				jschatJQuery(".chat_box .chat_list").append(_printMsg(msg));
				if(jschatJQuery(".chat_box .bd_box").is(':hidden')){
					jschatJQuery(".chat_box .hd_box").css("background","url(\""+_host+"img/newmsg.gif\") repeat-x");
				}
				jschatJQuery(".chat_box .chat_list").scrollTop(1000000);
			}
		});
	};
	this.closeBox = function (){
		jschatJQuery(".chat_box .icon_close").click(function () {
			jschatJQuery(".chat_box").hide();
			clearInterval(_stop);	
		})
	};
	this.minBox = function () {
		jschatJQuery(".chat_box .icon_min").bind("click",function(event){
			//取消冒泡
			event.stopPropagation();
			jschatJQuery(".chat_box .bd_box").hide();
			jschatJQuery(".chat_box").css("height","32px");
			jschatJQuery(".chat_box .hd_box").css("cursor","pointer");
		})
	};
	this.maxBox = function () {
		jschatJQuery(".chat_box .hd_box").bind("click",function(){
			jschatJQuery(".chat_box .bd_box").show();
			jschatJQuery(".chat_box").css("height","450px");
			jschatJQuery(".chat_box .hd_box").css("cursor","");
			jschatJQuery(".chat_box .hd_box").css("background","url(\""+_host+"img/01.png\") repeat-x scroll 0 -51px");
			jschatJQuery(".chat_box .chat_list").scrollTop(1000000);
			jschatJQuery(".chat_box .ipt_area").focus();

		});
	};
	this.writeMessage = function() {
		jschatJQuery(".chat_box .chat_submit").click(function() {
			if(jschatJQuery(".chat_box .ipt_area").val().length==0){
				jschatJQuery(".chat_box .ipt_area").val("");
				return;
			}
			var data = {
					dopost : "write",
					current_msg : jschatJQuery(".chat_box .ipt_area").val()
					};
			_dopost(data,function(res){
				jschatJQuery(".chat_box .chat_list").append(_printMsg(res.data));
				jschatJQuery(".chat_box .ipt_area").val("");
				jschatJQuery(".chat_box .chat_list").scrollTop(1000000);
			});
		})
	};
	this.enterSend = function() {
		jschatJQuery(".chat_box .chat_send_ipt").keyup(function(e) {
			if (e.altKey && e.keyCode == ENTER) {
				jschatJQuery(".chat_box .ipt_area").val(jschatJQuery(".chat_box .ipt_area").val() + "\r\n");
			}else
			if (e.keyCode == ENTER) {
				if(jschatJQuery(".ipt_area").val().length==1){
					jschatJQuery(".ipt_area").val("");
					return;
				}
				jschatJQuery(".chat_box .chat_submit").click(); // 处理事件
			}
		});
	};
	this.init = function () {
		jschatJQuery(document).ready(function() {
			_self.getHistory();
			_self.writeMessage();
			_self.enterSend();
			_self.closeBox();
			_self.minBox();
			_self.maxBox();
			jschatJQuery.each(_say,function(i,o){
				setTimeout(function(){
					_self.sayHello(o.content);
				},o.delay);
			});
			_stop = setInterval(function(){
				_self.readCurrent();	
			}, _callbackTimes);
		})
	};
}
var jschat = new jschatClient();
jschat.init();