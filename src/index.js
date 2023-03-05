const fs = require('fs');
const dotenv = require('dotenv').config();
const request = require('request');
const MicToSpeech = require('mic-to-speech');
const AipSpeechClient = require("baidu-aip-sdk");
const { Configuration, OpenAIApi } = require("openai");
const player = require('play-sound')(opts = {})

// 设置APPID/AK/SK
var client = new AipSpeechClient.speech(process.env.BAIDU_AIP_APP_ID, process.env.BAIDU_AIP_APP_KEY, process.env.BAIDU_AIP_APP_SECRET);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const messages = [];


var micToSpeech = new MicToSpeech(); // Linux：机器上已安装ALSA工具（sudo apt-get install alsa-utils）Window / OSX：计算机上安装的SoX工具

// 开始监听麦克风
micToSpeech.on('speech', function (buffer) {
    console.log('检测到语音信号 buffer 长度：', buffer.length);
    let now = new Date();
    micToSpeech.pause(); // 暂停监听麦克风
    console.log('正在识别......');
    // 语音识别
    client.recognize(buffer, 'pcm', 16000).then(function (result) {
        if (result.err_no == 0) {
            if (result.result[0].length > 4) {
                console.log('问：' + result.result[0]);
                messages.push({ "role": "user", "content": result.result[0] });
                // chatGPT
                chat(messages).then((msg) => {
                    messages.push({ "role": msg.role, "content": msg.content });
                    // 语音合成
                    client.text2audio(msg.content, { spd: 5, pit: 5, per: 0 }).then(function (result) {
                        let filename = (now.getMonth() + 1) + "-" + now.getDate() + "-" + now.getFullYear() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.mp3';
                        // 写入本地临时文件
                        fs.writeFileSync(filename, result.data);
                        player.play(filename, function (err) {
                            if (err) throw err
                            micToSpeech.resume();
                            fs.unlink("./" + filename, function (err) {
                                if (err) throw err;
                            });
                        })
                    });

                }).catch((err) => {
                    console.log(err);  // Some error
                    micToSpeech.resume();
                });

            } else {
                micToSpeech.resume();
            }

        } else {
            console.log("语音解析失败请重试", result);
            micToSpeech.resume();
        }

    }, function (err) {
        console.log('系统异常未能返回结果！');
        micToSpeech.resume();
    });

})

async function chat(messages) {

    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        // prompt: q,
        // max_tokens: 200,
        // temperature: 0,
    });

    res.onmessage = (event) => {
        console.log(event.data);
    }

    console.log('答：', res.data.choices[0].message.content);

    return res.data.choices[0].message;
}

micToSpeech.start();
console.log(process.env.APP_NAME,'启动啦！');