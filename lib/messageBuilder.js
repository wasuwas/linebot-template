/* eslint-disable no-console */

module.exports = {
    //confirmメッセージビルダー
    confirmMsgBuilder: (mainText, btnText1, btnText2, altText = "this is a confirm template") => {
        let messages = new Array();
        messages.push({
            "type": "template",
            "altText": altText,
            "template": {
                "type": "confirm",
                "text": mainText,
                "actions": [
                    {
                        "type": "postback",
                        "label": btnText1,
                        "data": "postback:",
                        "text": btnText1
                    },
                    {
                        "type": "postback",
                        "label": btnText2,
                        "data": "postback:",
                        "text": btnText2
                    }
                ]
            }
        });
        return messages;
    },
    // //textメッセージビルダー
    textMsgBuilder: (...text) => {
        if (text.length > 5) {
            throw new Error("argument is too long.");
        }
        let messages = new Array();
        text.forEach((text) => {
            if (!text) {
                throw new Error("text elments is empty.");
            }
            let oneMsg = {
                "type": "text",
                "text": text
            };
            messages.push(oneMsg);
        });
        return messages;
    },
    // imageメッセージビルダー
    imageMsgBuilder: (originalContentUrl, previewImageUrl) => {
        if (originalContentUrl == null || previewImageUrl == null) {
            throw new Error("argument is invalid.");
        }
        let messages = new Array();
        messages.push({
            "type": "image",
            "originalContentUrl": originalContentUrl,
            "previewImageUrl": previewImageUrl
        });
        return messages;
    },
    // videosメッセージビルダー
    videoMsgBuilder: (originalContentUrl, previewImageUrl) => {
        if (originalContentUrl == null || previewImageUrl == null) {
            throw new Error("argument is invalid.");
        }
        let messages = new Array();
        messages.push({
            "type": "image",
            "originalContentUrl": originalContentUrl,
            "previewImageUrl": previewImageUrl
        });
        return messages;
    },
    // audioメッセージビルダー
    audioMsgBuilder: (originalContentUrl, duration) => {
        if (originalContentUrl == null || duration == null) {
            throw new Error("argument is invalid.");
        }
        let messages = new Array();
        messages.push({
            "type": "audio",
            "originalContentUrl": originalContentUrl,
            "duration": duration
        });
        return messages;
    },
    // locationメッセージビルダー
    locationMsgBuilder: (title, address, latitude, longitude) => {
        if (title == null || address == null || latitude == null || longitude == null) {
            throw new Error("argument is invalid.");
        }
        let messages = new Array();
        messages.push({
            "type": title,
            "title": title,
            "address": address,
            "latitude": latitude,
            "longitude": longitude
        });
        return messages;
    },
    // stickerメッセージビルダー
    stickerMsgBuilder: (packageId, stickerId) => {
        if (packageId == null || stickerId == null) {
            throw new Error("argument is invalid.");
        }
        let messages = new Array();
        messages.push({
            "type": "sticker",
            "packageId": packageId,
            "stickerId": stickerId
        });
        return messages;
    },
};