## jschat 介绍

jschat服务对象为中小企业的官网，基于redis分布式在线客服系统，使用者只需要添加两段js代码即可拥有在线客服功能。
我们的官网是`http://www.jschat.cn`

### 为什么使用jschat: 

很多网站需要在线客服聊天系统，但是由于开发成本较高，无法方便快捷的使用到在线客服聊天功能。jschat是基于redis分布式在线客服聊天系统，使用起来也非常方便。

### 客户端添加如下代码: 

``` html
 <script src="http://www.jschat.cn/sdk_client.js?appkey=cici" charset='gbk'></script>
```

### 服务端添加如下代码: 

``` html
 <script src="http://www.jschat.cn/sdk_server.js?appkey=cici&secret=880215" charset='gbk'></script>
```
### 免费获取appkey
将客户端与服务器代码中的appkey及secret替换为您的认证， [点击这里](http://www.jschat.cn/#quickstart) 免费获取appkey和secret

### 一个完整的webapp demo: 
下面给出一个完整的例子（点击下面的client.html和slerver.html查看网页源码即可），让您的网站瞬间拥有客服功能： 
- [client.html](http://www.jschat.cn/chat/demo_client.php)
- [server.html](http://www.jschat.cn/chat/demo_server.php)


### 更多>> 

了解更多请查看 [官网](http://www.jschat.cn)

任何问题可以联系：251310858@qq.com 
