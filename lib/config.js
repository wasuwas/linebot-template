//LINE Webhook Event Type
exports.LINE_FOLLOW_EVENT = "follow";
exports.LINE_UNFOLLOW_EVENT = "unfollow";
exports.LINE_JOIN_EVENT = "join";
exports.LINE_LEAVE_EVENT = "leave";
exports.LINE_POSTBACK_EVENT = "postback";
exports.LINE_BEACON_EVENT = "beacon";
exports.LINE_MESSAGE_EVENT = "message";

//LineMESSAGE Type
exports.MESSAGE_TEXT = "text";
exports.MESSAGE_IMAGE = "image";
exports.MESSAGE_VIDEO = "video";
exports.MESSAGE_AUDIO = "audio";
exports.MESSAGE_LOCATION = "location";
exports.MESSAGE_STICKER = "sticker";

//Line bot Account info
exports.LINEBOT_CHANNEL_ID = "";
exports.LINEBOT_CHANNEL_SECRET = "";
exports.LINEBOT_ACCESS_TOKEN = "";

// End point
exports.LINEBOT_ENDPOINT_PUSH = "https://api.line.me/v2/bot/message/push";
exports.LINEBOT_ENDPOINT_REPLY = "https://api.line.me/v2/bot/message/reply";
exports.LINEBOT_ENDPOINT_PROFILE = "https://api.line.me/v2/bot/profile/";

// Official sticker
exports.LINEBOT_STK_PKGID_OFFICIAL_MIN = 1;
exports.LINEBOT_STK_PKGID_OFFICIAL_MAX = 4;

//redis info
exports.REDISCLOUD_URL = "redis://pub-";

//docomo dialogue api info
exports.DOCOMO_DIALOGUE_URL="";
exports.DOCOMO_DIALOGUE_APIKEY="";

