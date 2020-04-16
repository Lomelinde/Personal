/*
bilibili fan drama open 1080P+

[Script]
^https?:\/\/api\.bilibili\.com\/pgc\/player\/api\/playurl url script-response-body https://raw.githubusercontent.com/NobyDa/Script/master/QuantumultX/File/bilifj.js

[MITM]
hostname = api.bilibili.com
*/

var body = $response.body;
var url = $request.url;

const path1 = '/pgc/player/api/playurl';

if (url.indexOf(path1) != -1) {
    let obj = JSON.parse(body);
	obj["quality"] = obj["accept_quality"][0];
	body = JSON.stringify(obj);  
 }

$done({body});