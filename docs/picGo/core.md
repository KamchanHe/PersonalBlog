## 快速上手

::: warning 注意
请确保你的 Node.js 版本 >= 8。
:::

::: tip 提示
默认上传图床为[SM.MS](https://sm.ms/)
:::

### 临时尝鲜

>如果你的npm>=5.2，可以使用npx尝试一下picgo，这条命令会临时安装picgo，并在使用结束后删除它。

```sh
npx picgo upload ./xxxx.jpg
```

### 全局安装

>使用CLI部分

```sh
# 安装
yarn global add picgo # 或者 npm install picgo -g

# 上传具体路径图片
picgo upload /xxx/xxx.jpg

# 上传剪贴板里的第一张图片（上传时会将格式转成png）
picgo upload
```

>上传剪贴板里的图片的实现来自于[vs-picgo](https://github.com/PicGo/vs-picgo)，感谢[Spades-S](https://github.com/Spades-S)！

### 现有项目

>使用API部分

```sh
yarn add picgo -D # 或者 npm intall picgo -D
```

创建一个js文件（例如picgo.js）：

```js
const PicGo = require('picgo')
const picgo = new PicGo() // 将使用默认的配置文件：~/.picgo/config.json

// 上传具体路径下的图片
picgo.upload(['/xxx/xxx.jpg'])

// 上传剪贴板里的第一张图片（上传时会将格式转为png）
picgo.upload()
```

运行js：

```sh
node picgo.js
```

## 配置文件
















































