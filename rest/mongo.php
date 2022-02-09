<?php

// error_reporting(E_ALL);
// ini_set("display_errors","On");
class db {
  private $user = "" ;
  private $pass = "";
  private $host = "";
  private $base = "";
  private $coll_poll = "ankieta";
  private $coll_user = "uzytkownik";
  private $coll_cookies = "ciasteczka";
  private $conn;
  private $collection_poll;
  private $collection_user;
  private $collection_cookies;

  function __construct() {
    $this->conn = new MongoDB\Client("mongodb+srv://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
    $this->collection_poll = $this->conn->selectCollection($this->base, $this->coll_poll);
    $this->collection_user = $this->conn->selectCollection($this->base, $this->coll_user);
    $this->collection_cookies = $this->conn->selectCollection($this->base, $this->coll_cookies);
    session_start();
  }

  public function login($input) {
    $uname = $input['login'];
    if (is_null($this->collection_user->findOne(array('login' => $uname, 'pass' => $input['pass'])))) {
      return false;
    } else {
      $my_id = md5(uniqid($uname, true));
      $this->collection_cookies->insertOne(array('my_id' => $my_id, 'start' => date('Y-m-d H:i:s', time())));
      return $my_id;
    }
  }

  public function logout($cookie) {
    if (is_null($this->collection_cookies->findOne(array('my_id' => $cookie['my_id'])))) {
      return false;
    } else {
      $this->collection_cookies->deleteOne(array('my_id' => $cookie['my_id']));
      return true;
    }
  }

  public function register($input) {
    if (is_null($this->collection_user->findOne(array('login' => $input['login'])))) {
      $this->collection_user->insertOne($input);
      return true;
    } else {
      return false;
    }
  }

  function cookie($arr) {
    if (is_null($this->collection_cookies->findOne(array('my_id' => $arr['my_id'])))) {
      return false;
    } else {
      return true;
    }
  }

  function select() {
    $cursor = $this->collection_poll->find();
    $table = iterator_to_array($cursor);
    return $table;
  }

  function insert($poll) {
    $ret = $this->collection_poll->insertOne($poll);
    return $ret;
  }
}

?>