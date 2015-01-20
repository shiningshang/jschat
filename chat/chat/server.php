<?php
// 安全验证
require_once (dirname ( __FILE__ ) . '/user.php');
require_once (dirname ( __FILE__ ) . '/chat.php');
class ChatServer extends Chat {
	function __construct($server, $request) {
		$cid = null;
		if (isset ( $request ['clientid'] )) {
			$arr = explode ( "client", $request ['clientid'] );
			$cid = $arr [1];
		}
		parent::__construct ( $server, $request, $cid );
	}
	function write($current_msg) {
		return parent::write ( $this->serverid, $this->clientid, $current_msg );
	}
	function readCurrent() {
		return parent::readCurrent ( $this->clientid, $this->serverid );
	}
	function loadClients() {
		$online = $this->redis->keys ( $this->request ["appkey"] . "online*" );
		$arr = array ();
		foreach ( $online as $on ) {
			$cid = str_replace ( $this->request ["appkey"] . "online", "", $on );
			$client_msg = $this->redis->rPop ( $this->request ["appkey"] . "client" . $cid );
			if (! $client_msg) {
				$msg = new msg ();
				$msg->has_new_msg = 0;
				$msg->sendid = $this->request ["appkey"] . "client" . $cid;
				$msg->receiveid = $this->request ["appkey"] . "server" . $cid;
				$msg->is_online = 1;
				$msg = json_encode ( $msg );
			} else {
				$msg = $client_msg;
				$this->redis->rPush ( $this->request ["appkey"] . "client" . $cid, $client_msg );
			}
			$arr [] = $msg;
		}
		return json_encode ( $arr );
	}
	function readHistory() {
		// 历史消息里面包含了队列中还未发出的消息，因此要清除队列
		$this->redis->delete ( $this->clientid );
		return parent::readHistory ();
	}
}
if (isset ( $_REQUEST ['clientid'] )) {
	$chat = new ChatServer ( $_SERVER, $_REQUEST );
	$chat->init ();
} else {
	if ($_REQUEST ['dopost'] == 'loadClients') {
		$server = new ChatServer ( $_SERVER, $_REQUEST );
		echo "callback({data:" . $server->loadClients () . "})";
	}
}




