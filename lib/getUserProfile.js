/* eslint-disable no-console */
var config = require("config.js");
var request = require('sync-request');
//ヘッダーを定義
var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + config.LINEBOT_ACCESS_TOKEN
};
var redis_key_prefix = "username_";
module.exports = {
    //ユーザー名取得関数
    //同期処理でレスポンスを待つため注意
    getUserName: (userId) => {
        //redisにキャッシュされていたらそれを返却
        let userName = getUserNameCache(userId, () => {
            if (userName !== null) {
                return userName;
            } else {
                var res = request('GET', config.LINEBOT_ENDPOINT_PROFILE + userId, {
                    'headers': headers
                });
                let body = JSON.parse(res.getBody('utf8'));
                console.log(JSON.stringify(body));
                //redisに保存
                saveUserNameCache(userId, body.displayName);
                return userName = body.displayName;
            }
        });
        return userName;
    }
};

//redisにユーザー名を保存する。
function saveUserNameCache(userId, userName) {
    //redisクライアントセットアップ
    let redis = require('redis');
    let client = redis.createClient(config.REDISCLOUD_URL, { no_ready_check: true });

    //redisにuserIdとcontextを詰める
    client.set(redis_key_prefix + userId, userName);
    client.expire(redis_key_prefix + userId, 86400);
    client.quit();
}
//redisからユーザーごとのcontextを取得する。
function getUserNameCache(userId) {
    //redisクライアントセットアップ
    let redis = require('redis');
    let client = redis.createClient(config.REDISCLOUD_URL, { no_ready_check: true });
    let context = null;
    //redisにuserIdとcontextを詰める
    client.get(redis_key_prefix + userId, (err, response) => {
        context = response;
    });
    client.quit();
    return context;
}