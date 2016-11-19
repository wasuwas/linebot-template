/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

//expressの宣言
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
var async = require('async');

// /lib配下をクラスパスに追加
require('app-module-path').addPath(__dirname + '/lib');

//設定値読み込み
var config = require("config.js");
//メッセージ送信関数読み込み
var send = require("sendMessage.js");
//ユーザ名取得関数読み込み
var getProfile = require("getUserProfile.js");

//テンプレートメッセージ作成関数読み込み
var msgBuilder = require("messageBuilder.js");

//ドコモ雑談対話API利用関数読み込み
var docomoDialogue = require("docomoDialogue.js");


// Fixie proxy
var proxyRequest = request.defaults({ "proxy": process.env.FIXIE_URL });

//express設定
app.set("port", (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//ここからcallback開始
app.post("/callback", (req, res) => {
  console.log("/callback called");
  res.status(200).json({ status: "ok" });
  console.log("/callback response send");
  console.log("RequestBody: ", JSON.stringify(req.body));

  //署名検証
  var crypto = require("crypto");
  function validate_signature(signature, body) {
    return signature == crypto.createHmac('sha256', config.LINEBOT_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
  }
  if (!validate_signature(req.headers['x-line-signature'], req.body)) {
    console.log("fail to validate Signature.");
    //ローカルでのデバッグ用にコメントアウト
    //return;
  }
  console.log("check Signature OK !");

  //ISSUE:複数メッセージ対応していないのでもし複数送られると後ろのメッセージが漏れます。
  let events = req.body.events[0];

  //ユーザーの発話がuserIdからなのか、roomからなのか、groupからなのか判定
  let userId = "";
  if (typeof events.source.userId !== undefined) {
    userId = events.source.userId;
  } else if (typeof events.source.groupId !== undefined) {
    userId = events.source.groupId;
  } else if (typeof events.source.roomId !== undefined) {
    userId = events.source.roomId;
  }

  let messages = "";
  //メッセージタイプに応じて分岐
  switch (events.type) {
    //友達追加
    case config.LINE_FOLLOW_EVENT:
      messages = messages = messages = msgBuilder.textMsgBuilder("[reply]友だち追加ありがとうございます。", "ここにBOTの説明を入力してください。");
      send.sendReplyMessage(events.replyToken, messages);
      break;

    //友達削除(ブロック)
    case config.LINE_UNFOLLOW_EVENT:
      //unfollow時はリプライトークンもらえない
      //ブロックしているユーザーにはuserId分かっていてもメッセージ送れない
      //send.sendPushMessage(userId, messages = msgBuilder.textMsgBuilder("[push]さようなら。。。"));
      console.log("block from:" + userId);
      break;

    //グループ参加
    //ISSUE:なぜかグループに追加したタイミングではなく、グループ追加後に誰かが発話したタイミングでこのイベントが飛んでくる。。
    case config.LINE_JOIN_EVENT:
      send.sendReplyMessage(events.replyToken, msgBuilder.textMsgBuilder("[reply]トークルームに追加ありがとう!", "よろしく！"));
      break;

    //グループ退会
    case config.LINE_LEAVE_EVENT:
      //leave時はリプライトークンもらえない
      //退会したグループにはgroupId分かっていてもメッセージ送れない
      //send.sendPushMessage(userId, msgBuilder.textMsgBuilder("[push]ルームからさようなら。。。"));
      console.log("leave from:" + userId);
      break;

    //ポストバックイベント
    case config.LINE_POSTBACK_EVENT:
      messages = msgBuilder.textMsgBuilder("[reply]postbackだね。");
      send.sendReplyMessage(events.replyToken, messages);
      break;

    //ビーコン
    case config.LINE_BEACON_EVENT:
      messages = msgBuilder.textMsgBuilder("[reply]beaconだね。");
      send.sendReplyMessage(events.replyToken, messages);
      break;

    //通常メッセージ
    case config.LINE_MESSAGE_EVENT:
      //メッセージタイプごとに振り分ける
      switch (events.message.type) {
        //text
        case config.MESSAGE_TEXT:
          //ドコモ雑談対話APIに話しかける
          var dialogueText = docomoDialogue.getDialogue(userId,events.message.text);
          send.sendReplyMessage(events.replyToken, msgBuilder.textMsgBuilder(dialogueText));

          if(events.message.text=="テスト"){
          testPushMessage(userId);
          }
          break;
        //画像
        case config.MESSAGE_IMAGE:
          break;
        //動画
        case config.MESSAGE_VIDEO:
          break;
        //音声
        case config.MESSAGE_AUDIO:
          break;
        //位置情報
        case config.MESSAGE_LOCATION:
          break;
        //スタンプ      
        case config.MESSAGE_STICKER:
          break;
        default:
          throw new Error("message.type is unknown.");
      }
      break;
    //通常メッセージタイプここまで

    default:
      throw new Error("events.type is unknown.");
  }
});

function testPushMessage(userId){
  let button = msgBuilder.confirmMsgBuilder("確認","はい","いいえ","スマホから確認してね");
  let msg2 = msgBuilder.textMsgBuilder("test1");
  let stamp = msgBuilder.stickerMsgBuilder(1,1);
  let img = msgBuilder.imageMsgBuilder("https://www.atpress.ne.jp/releases/109961/LL_img_109961_1.jpg","https://www.atpress.ne.jp/releases/109961/LL_img_109961_1.jpg");
  var array = button.concat(msg2).concat(stamp).concat(img);
  console.log(array);
  send.sendPushMessage(userId,array);
}

//expressの起動
app.listen(app.get("port"), function () {
  console.log("Server listening on port %s!", app.get("port"));
});
