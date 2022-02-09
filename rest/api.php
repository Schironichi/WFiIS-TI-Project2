<?php

require '../../lib/vendor/autoload.php';
require_once("rest.php");
require_once("mongo.php");

// error_reporting(E_ALL);
// ini_set("display_errors","On");
class API extends REST {
    public $data = "";

    public function __construct() {
        parent::__construct();
        $this->db = new db();
    }

    public function processApi() {
        $func = "_".$this->_endpoint;
        if((int)method_exists($this,$func) > 0) {
            $this->$func();
        } else {
            $this->response('Page not found', 404);
        }
    }

    private function _login() {
        if($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if(!empty($this->_request)) {
            try {
                $json_array = json_decode($this->_request, true);
                foreach ($json_array as $key => $value) {
                    if ($value == '') {
                        $result = array('status' => "failed", 'msg' => "Za mało danych.");
                        $this->response($this->json($result), 400);
                    }
                }
                $res = $this->db->login($json_array);
                if ($res) {
                    $result = array('status' => "ok", 'my_id' => $res);
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('status' => "failed", 'msg' => "Niepoprawne dane logowania.");
                    $this->response($this->json($result), 200);
                }
            } catch (Exception $e) {
                $error = array('status' => "failed", 'msg' => "Wyjątek.");
                $this->response($this->json($error), 400);
            }
        } else {
            $error = array('status' => "failed", 'msg' => "Nieprawidłowe dane.");
            $this->response($this->json($error), 400);
        }
    }

    private function _register() {
        if($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if(!empty($this->_request)) {
            try {
                $json_array = json_decode($this->_request, true);
                foreach ($json_array as $key => $value) {
                    if ($value == '') {
                        $result = array('status' => "failed", 'msg' => "Za mało danych.");
                        $this->response($this->json($result), 400);
                    }
                }
                $res = $this->db->register($json_array);
                if ($res) {
                    $result = array('status' => "ok");
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('status' => "failed", 'msg' => "Taki login już istnieje.");
                    $this->response($this->json($result), 200);
                }
            } catch (Exception $e) {
                $error = array('status' => "failed", 'msg' => "Wyjątek.");
                $this->response($this->json($error), 400);
            }
        } else {
            $error = array('status' => "failed", 'msg' => "Nieprawidłowe dane.");
            $this->response($this->json($error), 400);
        }
    }

    private function _logout() {
        if($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if(!empty($this->_request)) {
            try {
                $json_array = json_decode($this->_request, true);
                $res = $this->db->logout($json_array);
                if ($res) {
                    $result = array('status' => "ok");
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('status' => "failed", 'msg' => "Niepoprawne my_id ciasteczka.");
                    $this->response($this->json($result), 200);
                }
            } catch (Exception $e) {
                $error = array('status' => "failed", 'msg' => "Wyjątek.");
                $this->response($this->json($error), 400);
            }
        } else {
            $error = array('status' => "failed", 'msg' => "Błąd sesji.");
            $this->response($this->json($error), 400);
        }
    }

    private function _cookie() {
        if($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if(!empty($this->_request)) {
            try {
                $json_array = json_decode($this->_request, true);
                foreach ($json_array as $key => $value) {
                    if ($value == '') {
                        $result = array('status' => "failed", 'msg' => "Błąd przy wysyłaniu ciasteczka.");
                        $this->response($this->json($result), 400);
                    }
                }
                $res = $this->db->cookie($json_array);
                if ($res) {
                    $result = array('status' => "ok");
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('status' => "failed", 'msg' => "Ciasteczko zostało już usunięte.");
                    $this->response($this->json($result), 200);
                }
            } catch (Exception $e) {
                $error = array('status' => "failed", 'msg' => "Wyjątek.");
                $this->response($this->json($error), 400);
            }
        } else {
            $error = array('status' => "failed", 'msg' => "Nieprawidłowe dane.");
            $this->response($this->json($error), 400);
        }
    }

    private function _send() {
        if($this->get_request_method() != "POST") {
            $this->response('', 406);
        }

        if(!empty($this->_request)) {
            try {
                $json_array = json_decode($this->_request, true);
                $res = $this->db->insert($json_array);
                if ($res) {
                    $result = array('status' => "ok");
                    $this->response($this->json($result), 200);
                } else {
                    $result = array('status' => "failed", 'msg' => "Nie udało się wysłać danych do bazy.");
                    $this->response($this->json($result), 200);
                }
            } catch (Exception $e) {
                $error = array('status' => "failed", 'msg' => "Wyjątek.");
                $this->response($this->json($error), 400);
            }
        } else {
            $error = array('status' => "failed", 'msg' => "Nieprawidłowe dane.");
            $this->response($this->json($error), 400);
        }
    }

    private function _list() {
        if($this->get_request_method() != "GET") {
            $this->response('', 406);
        }
        try {
            $result = $this->db->select();            
            $this->response($this->json($result), 200);
        } catch (Exception $e) {
            $this->response('', 400);
        }
    }

    private function json($data) {
        if(is_array($data)){
            return json_encode($data);
        }
    }
}

$api = new API;
$api->processApi();

?>