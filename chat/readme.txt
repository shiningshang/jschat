jschat服务对象为中小企业的官网，基于redis分布式在线客服系统，使用者只需要添加两段js代码即可拥有在线客服功能。

官网 http://www.jschat.cn


为什么使用jschat
很多网站需要在线客服聊天系统，但是由于开发成本较高，无法方便快捷的使用到在线客服聊天功能。jschat是基于redis分布式在线客服聊天系统，使用起来也非常方便。

客户端添加如下代码：

       
    <script src="http://www.jschat.cn/sdk_client.js?appkey=cici" charset='gbk'></script>
    
在需要显示客服的网页添加这段代码，将appkey后面的名称换成您再本站注册的ID。

服务端添加如下代码：
       
    <script src="http://www.jschat.cn/sdk_server.js?appkey=cici&secret=880215" charset='gbk'></script>
    
在系统后台新建html页面，将代码加入后台html中，appkey=cici&secret=880215 这里的appkey要与客户端保持统一，secret是服务器端的认证，不要暴露在网站上（也就是说有了这个secret就可以获取到服务器端的所有聊天记录，所以服务器端的这段js代码一定要放在有权限验证的页面）。
jschat源码下载
SSH下载地址:
git@code.csdn.net:javascript_2011/jschat.git
HTTPS下载地址:
https://code.csdn.net/javascript_2011/jschat.git