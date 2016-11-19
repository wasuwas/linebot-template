/* eslint-disable no-console */
var request = require("request");
var config = require("config.js");

//ヘッダーを定義
var headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": "Bearer " + config.LINEBOT_ACCESS_TOKEN
};

module.exports = {
    //Pushでのメッセージ送信
    sendPushMessage: (to, messages) => {
        var data = {
            "to": to,
            "messages": messages
        };

        //オプションを定義
        var options = {
            url: config.LINEBOT_ENDPOINT_PUSH,
            proxy: process.env.FIXIE_URL,
            headers: headers,
            json: true,
            body: data
        };

        request.post(options, (error, response) => {
            if (!error && response.statusCode == 200) {
                console.log(data);
            } else {
                console.log("error: " + JSON.stringify(response));
            }
        });
    },

    //replyTokenでのメッセージ送信
    sendReplyMessage: (replyToken, messages) => {
        var data = {
            "replyToken": replyToken,
            "messages": messages
        };

        //オプションを定義
        var options = {
            url: config.LINEBOT_ENDPOINT_REPLY,
            proxy: process.env.FIXIE_URL,
            headers: headers,
            json: true,
            body: data
        };

        request.post(options, (error, response) => {
            if (!error && response.statusCode == 200) {
                console.log(data);
            } else {
                console.log("error: " + JSON.stringify(response));
            }
        });
    }
};