/* eslint-disable no-console */
var config = require("config.js");
var userProfile = require("getUserProfile.js");
var request = require('sync-request');
//ヘッダーを定義
var headers = {
    "Content-Type": "application/json; charset=UTF-8",
};
var redis_key_prefix = "docomo_";
module.exports = {
    //docomo雑談対話api利用関数
    //同期処理でレスポンスを待つため注意
    getDialogue: (userId, text) => {
        let username = userProfile.getUserName(userId);
        let context = getContext(userId);
        let postBody = {
                "utt": text,
                "context": context,
                "nickname": username,
                "place": "東京",
            };
        let res = request('POST', config.DOCOMO_DIALOGUE_URL, {
            'headers': headers,
            json: postBody,
            qs: { "APIKEY": config.DOCOMO_DIALOGUE_APIKEY }
        });
        let body = JSON.parse(res.getBody('utf8'));
        console.log(JSON.stringify(body));
        saveContext(userId, body.context);
        return body.utt;
    }
};

//redisにユーザーごとのcontextを保存する。
function saveContext(userId, context) {
    //redisクライアントセットアップ
    let redis = require('redis');
    let client = redis.createClient(config.REDISCLOUD_URL, { no_ready_check: true });

    //redisにuserIdとcontextを詰める
    client.set(redis_key_prefix + userId, context);
    client.expire(redis_key_prefix + userId, 86400);
    client.quit();
}
//redisからユーザーごとのcontextを取得する。
function getContext(userId) {
    //redisクライアントセットアップ
    let redis = require('redis');
    let client = redis.createClient(config.REDISCLOUD_URL, { no_ready_check: true });
    let context = "";
    //redisにuserIdとcontextを詰める
    client.get(redis_key_prefix + userId, (err, response) => {
        context = response;
    });
    client.quit();
    return context;
}

