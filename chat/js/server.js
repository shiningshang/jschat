var jschatJQuery = $.noConflict(true);
var jschatServer = {
	host : "http://127.0.0.1/",
	callbackTimes : 5000,
	t : null,
	checkedId : "",
	title : "",
	init : function() {
		jschatJQuery(document).ready(function() {
			jschatServer.title = document.title;
			jschatServer.getHistory();
			jschatServer.writeMessage();
			jschatServer.enterSend();
			jschatServer.closeBox();
			jschatServer.minBox();
			jschatServer.up();
			jschatServer.down();
			jschatServer.alt();
//			jschatServer.readCurrent();
			jschatServer.readCurrent();
			jschatServer.t = setInterval("jschatServer.readCurrent()",jschatServer.callbackTimes);
		})
	},
	getHistory : function() {
		jschatJQuery(".history").click(function() {
			if(!jschatServer.checkedId){
				alert("请先选择客户，再查询历史记录！");
				return;
			}
			jschatJQuery("#"+jschatServer.checkedId).css("background","url('"+jschatServer.host+"img/01.png') repeat-x scroll 0 -51px rgba(0, 0, 0, 0)");
			jschatJQuery.ajax({
				url : jschatServer.host+"chat/server.php",
				data : {
					dopost : "readHistory",
					appkey : args['appkey'],
					secret : args['secret'],
					clientid : jschatServer.checkedId
				},
				dataType : "jsonp",
				jsonpCallback : "callback",

				success : function(res) {
					jschatJQuery(".chat_list").html("");
					var msgs = eval("[" + res.data + "]");
					jschatJQuery.each(msgs, function(i, msg) {
						if (msg.has_new_msg) {
							jschatJQuery(".chat_list").append(
									jschatServer._printMsg(msg));
							jschatJQuery(".chat_list").scrollTop(1000000);
							jschatJQuery(".ipt_area").focus();
						}
					});
				}
			})
		})
	},
	readCurrent : function() {
		jschatJQuery.ajax({
			url : jschatServer.host+"chat/server.php",
			data : {
				dopost : "loadClients",
				appkey : args['appkey'],
				secret : args['secret']
			},
			dataType : "jsonp",
			jsonpCallback : "callback",
			success : function(msg) {
				jschatJQuery("#clientList").html("");
				if(!msg){
					return;
				}
				if(msg.data.is_online == -1){
					clearInterval(jschatServer.t);
					alert("服务器端认证失败，请前往http://www.jschat.cn重新设置appkey及secret");
					return;
				}
				var msgs = eval("[" + msg.data + "]");
				jschatJQuery.each(msgs, function(i, msg) {
					//有新消息
					if(msg.has_new_msg && jschatServer.checkedId != msg.sendid){
						jschatServer._newMsgs(true);
						jschatJQuery("#clientList").append("<div class=\"clients\" id="+msg.sendid+" style=\"background:url('"+jschatServer.host+"img/newmsg.gif') repeat-x scroll 0 0;\"><div class=\"clients-each\">"+(i+1)+"</div>游客" +msg.sendid.substr(msg.sendid.length-4,msg.sendid.length) + "</div>");
					}else{
						jschatServer._newMsgs(false);
						jschatJQuery("#clientList").append("<div class=\"clients\" id="+msg.sendid+"><div class=\"clients-each\" >"+(i+1)+"</div>游客" + msg.sendid.substr(msg.sendid.length-4,msg.sendid.length) + "</div>");
					}
				});
				jschatJQuery("#clientList .clients").bind("click",function () {
					jschatJQuery("#"+jschatServer.checkedId).css("color","#000").css("font-weight","normal");
					jschatJQuery(this).css("color","red").css("font-weight","bold");
					jschatServer.checkedId = this.id;
					jschatJQuery(".history").click();
				})
				if(jschatServer.checkedId){
					jschatJQuery("#"+jschatServer.checkedId).css("color","red").css("font-weight","bold");	
					 jschatJQuery.ajax({
						 url : jschatServer.host+"chat/server.php",
						 data : {
							 dopost : "readCurrent",
							 appkey : args['appkey'],
							 secret : args['secret'],
							 clientid : jschatServer.checkedId
						 },
						 dataType : "jsonp",
						 jsonpCallback : "callback",
						 success : function(msg) {
							 msg = msg.data;
							 if (msg.has_new_msg) {
								 jschatJQuery(".chat_list").append(jschatServer._printMsg(msg));
							 	 jschatJQuery(".chat_list").scrollTop(1000000);
							 }
						 }
					 })
				}
			}
		})
	},
	closeBox : function() {
//		console.log("closeBox");
	},
	minBox : function() {
//		console.log("minBox");
	},
	writeMessage : function() {
		jschatJQuery(".chat_send_btn").click(function() {
			if(!jschatServer.checkedId){
				alert("请先选择客户，再点击发送！");
				return;
			}
			if(jschatJQuery(".ipt_area").val().length==0){
				jschatJQuery(".ipt_area").val("");
				return;
			}
			jschatJQuery.ajax({
				url : jschatServer.host+"chat/server.php",
				data : {
					dopost : "write",
					current_msg : jschatJQuery(".ipt_area").val(),
					appkey : args['appkey'],
					secret : args['secret'],
					clientid : jschatServer.checkedId
				},
				dataType : "jsonp",
				jsonpCallback : "callback",
				success : function(res) {
					jschatJQuery(".chat_list").append(jschatServer._printMsg(res.data));
					jschatJQuery(".ipt_area").val("");
					jschatJQuery(".chat_list").scrollTop(1000000);
				}
			})
		})
	},
	enterSend : function() {
		jschatJQuery(".chat_send_ipt").keyup(function(e) {
			//alt+enter 回车
			if (e.altKey && e.keyCode == 13) {
				jschatJQuery(".ipt_area").val(jschatJQuery(".ipt_area").val() + "\r\n");
			}else
			if (e.keyCode == 13) {
				if(jschatJQuery(".ipt_area").val().length==1){
					jschatJQuery(".ipt_area").val("");
					return;
				}
				jschatJQuery("#submit").click(); // 处理事件
			}
		});
	},
	up : function() {
		jschatJQuery("body").keyup(function(e) {
			if (e.keyCode == 38) {
				jschatServer._keyUpDwon("up");
			}
		});
	},
	down : function() {
		jschatJQuery("body").keyup(function(e) {
			if (e.keyCode == 40) {
				jschatServer._keyUpDwon("down");
			}
		});
	},
	alt : function() {
		jschatJQuery("body").keyup(function(e) {
			if (e.altKey && e.keyCode) {
				if(jschatJQuery(".clients")[e.keyCode-49]){
					jschatJQuery(".clients")[e.keyCode-49].click();	
				}
			}
		});
	},
	_keyUpDwon : function(action){
		if(jschatServer.checkedId){
			if(action == "up"){
				var up = jschatJQuery("#"+jschatServer.checkedId).prev();
				if(up){
					up.click();
				}
			}else if(action == "down"){
				var next = jschatJQuery("#"+jschatServer.checkedId).next();
				if(next){
					next.click();
				}
			}
		}else{
			if(jschatJQuery(".clients")[0]){
				jschatJQuery(".clients")[0].click();	
			}
			
		}
	},
	_printMsg : function(msg) {
		var m = [];
		if (msg.sendid.match("server")) {
			m.push("<div class=\"out fix\"><div class=\"info\">");
			m.push("我&nbsp;&nbsp;");
		} else {
			m.push("<div class=\"in fix\"><div class=\"info\">");
			m.push("游客");
			m.push(msg.sendid.substr(msg.sendid.length-4,msg.sendid.length));
			m.push("&nbsp;&nbsp;");
		}
		m.push(msg.ip);
		m.push("&nbsp;&nbsp;&nbsp;");
		m.push(msg.send_time);
		m.push("</div><div class=\"text\"><div class=\"cloudPannel\"><div class=\"cloudBody\"><div class=\"cloudContent\"><pre style=\"white-space: pre-wrap\">");
		m.push(msg.content);
		m.push("</pre></div></div><div class=\"cloudArrow\"></div></div></div></div>");
		return m.join("");
	},
	_newMsgs : function(flag){
		if(flag){
			jschatJQuery("#chat_audio").attr("autoplay","autoplay");
			jschatJQuery("#chat_audio").load();
		     setTimeout(function(){
		    	 document.title='【新消息】'+jschatServer.title;
	         },jschatServer.callbackTimes/2);
		     setTimeout(function(){
		    	 document.title='【  】'+jschatServer.title;
	         },jschatServer.callbackTimes);
		}else{
			document.title=jschatServer.title;
		}
	}
}
jschatServer.init();