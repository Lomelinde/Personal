/*
Remove the WeChat public account bottom ad

^https?:\/\/mp\.weixin\.qq\.com\/mp\/getappmsgad url script-response-body Wechat.js

MITM = mp.weixin.qq.com
*/

var obj = JSON.parse($response.body);
obj.advertisement_num = 0;
obj.advertisement_info = [];
delete obj.appid;
$done({body: JSON.stringify(obj)}); 