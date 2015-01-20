<?php
class redis_class {
	private static $redis;
	static function getInstance($ip = '127.0.0.1', $port = 6379) {
		if (self::$redis == null) {
			self::$redis = new Redis ();
			self::$redis->connect ( $ip, $port ); // php客户端设置的ip及端口
		}
		return self::$redis;
	}
}
?>
