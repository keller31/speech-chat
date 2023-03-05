# speech-chat
基于 NODE.js 的 OPENAI 语音对话机器人。

## 相关技术
- 使用了百度AI的语音转文本和文本转语音；
- 使用了OPENAI 的 gpt-3.5-turbo模型来进行对话内容生成（附带上下文内容）；
- 使用了 mic-to-speech 来监听麦克风事件，以便触发对话；


### 初始化
1. 安装依赖工具包
```
Linux：安装ALSA工具（sudo apt-get install alsa-utils）
Window：安装SoX工具（https://sourceforge.net/projects/sox/files/sox/）
Mac OS：安装SoX工具（brew install sox）
```
2. 获取代码
```
git clone https://github.com/keller31/speech-chat.git 
```

3. 安装 npm 依赖
```
npm install
```
4. 修改配置文件
```
cp ./.env.example ./.env 
```
然后修改.env 文件中的配置信息，填入你在openai申请的key以及百度云平台的应用key信息；


### 运行
```
node ./src/index
```

### 相关文档

openai api https://platform.openai.com/docs/guides/completion/introduction

baidu 语音技术 相关文档 https://cloud.baidu.com/doc/SPEECH/index.html

mic-to-speech 文档 https://github.com/natelewis/mic-to-speech

Sox工具 https://sox.sourceforge.net/

### 其他
此项目仅为个人学习娱乐之作品，由于本人对node.js并不太了解 代码中难免出现各种错误，如有问题欢迎大家指正！