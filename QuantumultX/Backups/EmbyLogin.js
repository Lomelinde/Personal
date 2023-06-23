/*
Emby Old Server Login

[Script]
https:\/\/emby\/system\/info\/public url script-response-body EmbyLogin.js

[MITM]
hostname = %APPEND% *.emby.wtf:0, *.plusmedia.site:0

*/

if ($request.url.indexOf('/system/info/public') != -1) {
    if($response.status==200){
      $response.body = $response.body.replace(/"Version":"\d+\.\d+\.\d+\.\d+"/g, '"Version":"4.7.6.0"');
      console.log($response.body + "\n");
      $done({status: $response.status, headers: $response.headers, body: $response.body });
  }else{
      $done({});
    }
  }