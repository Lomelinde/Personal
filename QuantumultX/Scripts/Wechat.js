/*
Remove the WeChat public account bottom ad

[Script]
^https?:\/\/mp\.weixin\.qq\.com\/mp\/getappmsgad url script-response-body Wechat.js

[MITM]
hostname = mp.weixin.qq.com
*/

var data = {
    body: "{}",
    headers: {
      "Content-Type": "application/json"
    }
  };
  $done({response: data});