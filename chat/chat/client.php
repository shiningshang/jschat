<?php
require_once (dirname(__FILE__).'/chat.php');
class ChatClient extends Chat {
	function write($current_msg) {
		return parent::write ( $this->clientid, $this->serverid, $current_msg );
	}
	function readCurrent() {
		$this->redis->setex ( $this->onlineid, Chat::$heartbeat, 1 );
		return parent::readCurrent ( $this->serverid, $this->clientid );
	}
	function readHistory() {
		$this->redis->delete ( $this->serverid );
		return parent::readHistory ();
	}
}
if (! isset ( $_SESSION )) {
	session_start ();
}
$clientid = session_id ();
setcookie ( 'PHPSESSID', $clientid, time () + Chat::$history_timeout, '/' );

$chat = new ChatClient ( $_SERVER, $_REQUEST, $clientid );
$chat->init ();


