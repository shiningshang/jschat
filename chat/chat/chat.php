<?php
require_once (dirname ( __FILE__ ) . '/msg.php');
class Chat {
	// 历史消息超时时间60秒
	public static $history_timeout = 86400;
	// 30秒内没有收到客户端请求即为下线
	public static $heartbeat = 30;
	protected $redis;
	protected $clientid;
	protected $serverid;
	protected $historyid;
	protected $onlineid;
	protected $cid;
	protected $ip;
	public $request;
	function __construct($server, $request, $cid = null) {
		$this->request = $request;
		$this->ip = $server ['REMOTE_ADDR'];
		require_once ('redis.class.php');
		$this->redis = redis_class::getInstance ();
		if (isset($cid)) {
			$this->cid = $cid;
			$this->serverid = $this->request ["appkey"] . "server" . $cid;
			$this->clientid = $this->request ["appkey"] . "client" . $cid;
			$this->historyid = $this->request ["appkey"] . "history" . $cid;
			$this->onlineid = $this->request ["appkey"] . "online" . $cid;
		}
	}
	function init() {
		if (isset ( $this->request ['dopost'] )) {
			if ($this->request ['dopost'] == 'write') {
				echo $this->callback ( $this->write ( $this->request ['current_msg'] ) );
			} else if ($this->request ['dopost'] == 'readCurrent') {
				echo $this->callback ( $this->readCurrent () );
			} else if ($this->request ['dopost'] == 'readHistory') {
				echo $this->callback ( $this->readHistory () );
			}
		}
	}
	function callback($msg) {
		return "callback({data: $msg })";
	}
	function write($sendid, $receiveid, $current_msg) {
		$msg = new msg ();
		// 东八区时间
		// date_default_timezone_set('Etc/GMT-8');
		$msg->send_time = date ( "Y-m-d H:i:s" );
		$msg->content = $current_msg;
		$msg->has_new_msg = 1;
		$msg->is_online = 1;
		$msg->receiveid = $receiveid;
		$msg->sendid = $sendid;
		$msg->ip = $this->ip;
		$this->redis->lPush ( $sendid, json_encode ( $msg ) );
		if ($this->redis->exists ( $this->historyid )) {
			$this->redis->append ( $this->historyid, "," . json_encode ( $msg ) );
		} else {
			$this->redis->setex ( $this->historyid, Chat::$history_timeout, json_encode ( $msg ) );
		}
		return json_encode ( $msg );
	}
	function readCurrent($sendid, $receiveid) {
		if ($this->redis->lSize ( $sendid ) == 0) {
			$this->redis->delete ( $sendid );
			$msg = new msg ();
			$msg->has_new_msg = 0;
			$msg->sendid = $sendid;
			$msg->receiveid = $receiveid;
			$msg->is_online = 1;
			$res = json_encode ( $msg );
		} else {
			$res = $this->redis->rPop ( $sendid );
		}
		return $res;
	}
	function readHistory() {
		return json_encode ( $this->redis->get ( $this->historyid ) );
	}
}



