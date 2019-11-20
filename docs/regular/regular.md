---
title: 常用正则表达式
date: 2019-09-30
categories: article
author: Kamchan
tags:
- Regular
---

## 迅雷链接
`/^thunder:\/\/[a-zA-Z0-9]+=$/`

例如:
`thunder://QUEsICdtYWduZXQ6P3h0PXVybjpidGloOjBCQTE0RTUxRkUwNjU1RjE0Qzc4NjE4RjY4NDY0QjZFNTEyNjcyOUMnWlo=`

## ed2k链接(宽松匹配)
`/^ed2k:\/\/|file|.+|\/$/`

例如:
`ed2k://|file|%E5%AF%84%E7%94%9F%E8%99%AB.PARASITE.2019.HD-1080p.X264.AAC-UUMp4(ED2000.COM).mp4|2501554832|C0B93E0879C6071CBED732C20CE577A3|h=5HTKZPQFYRKORN52I3M7GQ4QQCIHFIBV|/`

## 磁力链接(宽松匹配)
`/^magnet:\?xt=urn:btih:[0-9a-fA-F]{40,}.*$/`

例如:
`magnet:?xt=urn:btih:40A89A6F4FB1498A98087109D012A9A851FBE0FC`

## 子网掩码
`/^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/`

例如:
`255.255.255.0`
`255.224.0.0`

## linux"文件夹"路径
`/^\/(\w+\/?)+$/`

例如:
`/usr/ad/dd`
`/root/`

## linux"文件"路径
`/^\/(\w+\/)+\w+\.\w+$/`

例如:
`/usr/ad/dd/a.js`
`/root/b.ts`

## window下"文件夹"路径
`/^[a-zA-Z]:\\(?:\w+\\?)*$/`

例如:
`C:\\Users\\Administrator\\Desktop`
`e:\\m\\`

## window下"文件"路径
`/^[a-zA-Z]:\\(?:\w+\\)*\w+\.\w+$/`

例如:
`C:\\Users\\Administrator\\Desktop\\qq.link`
`e:\\m\\vscode.exe`

## A股代码
`/^(s[hz]|S[HZ])(000[\d]{3}|002[\d]{3}|300[\d]{3}|600[\d]{3}|60[\d]{4})$/`

例如:
`sz000858`
`SZ002136`
`sz300675`
`SH600600`
`sh601155`

## 大于等于0, 小于等于150, 支持小数位出现5, 如145.5, 用于判断考卷分数
`/^150$|^(?:\d|[1-9]\d|1[0-4]\d)(?:.5)?$/`

例如:
`150`
`100.5`

## html注释
`/^<!--[\s\S]*?-->$/`

例如:
`<!--<div class="_bubble"></div>-->`

## md5格式(32位)
`/^[a-f0-9]{32}$/`

例如:
`21fe181c5bfc16306a6828c1f7b762e8`

## 版本号格式必须为X.Y.Z
`/^\d+(?:\.\d+){2}$/`

例如:
`16.3.10`

## 视频链接地址（视频格式可按需增删）
`/^https?:\/\/.*?(?:swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i`

例如:
`http://www.abc.com/video/wc.avi`

## 图片链接地址（图片格式可按需增删）
`/^https?:\/\/.*?(?:gif|png|jpg|jpeg|webp|svg|psd|bmp|tif)$/i`

例如:
`https://www.abc.com/logo.png`

## 24小时制时间（HH:mm:ss）
`/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/`

例如:
`23:34:55`

## 12小时制时间（hh:mm:ss）
`/^(?:1[0-2]|0?[1-9]):[0-5]\d:[0-5]\d$/`

例如:
`11:34:55`

## base64格式
`/^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i`

例如:
`data:image/gif;base64,xxxx==`

## 数字/货币金额（支持负数、千分位分隔符）
`/(?:^[-]?[1-9]\d{0,2}(?:$|(?:,\d{3})*(?:$|(\.\d{1,2}$))))|(?:(?:^[0](\.\d{1,2})?)|(?:^[-][0]\.\d{1,2}))$/`

例如:
`100`
`-0.99`
`3`
`234.32`
`-1`
`900`
`235.09`

## 数字/货币金额 (只支持正数、不支持校验千分位分隔符)
`/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/`

例如:
`0.99`
`8.99`
`666`

## 银行卡号（10到30位, 覆盖对公/私账户, 参考[微信支付](https://pay.weixin.qq.com/wiki/doc/api/xiaowei.php?chapter=22_1))
`/^[1-9]\d{9,29}$/`

例如:
`6234567890`
`6222026006705354217`

## 中文姓名
`/^(?:[\u4e00-\u9fa5·]{2,16})$/`

例如:
`葛二蛋`
`凯文·杜兰特`
`德克·维尔纳·诺维茨基`

## 英文姓名
`/(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/`

例如:
`James`
`Kevin Wayne Durant`
`Dirk Nowitzki`

## 新能源车牌号
`/[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(([0-9]{5}[DF])|([DF][A-HJ-NP-Z0-9][0-9]{4}))$/`

例如:
`京AD92035`
`甘G23459F`

## 非新能源车牌号
`/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/`

例如:
`京A00599`
`黑D23908`

## 车牌号(新能源+非新能源)
`/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/`

例如:
`京A12345D`
`京A00599`

## 网址
`/^(?:(?:https?|ftp):\/\/)?(?:[\da-z.-]+)\.(?:[a-z.]{2,6})(?:\/\w\.-]*)*\/?/`

例如:
`www.qq.com`

## 中国手机号(严谨), 根据工信部2019年最新公布的手机号段
`/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/`

例如:
`008618311006933`
`+8617888829981`
`8617888829981`

## 中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可
`/^(?:(?:\+|00)86)?1[3-9]\d{9}$/`

例如:
`008618311006933`
`+8617888829981`
`8617888829981`

## 中国手机号(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
`/^(?:(?:\+|00)86)?1\d{10}$/`

例如:
`008618311006933`
`+8617888829981`
`8617888829981`

## 日期
`/^\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)$/`

例如:
`1990-12-12`
`2020-1-1`

## 邮箱地址(email)
`/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/`

例如:
`90203918@qq.com`
`nbilly@126.com`

## 国内座机电话
`/\d{3}-\d{8}|\d{4}-\d{7}/`

例如:
`0936-4211235`
`0341-86091234`

## 一代身份证号(15位数字)
`/^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$/`

例如:
`622001790131123`

## 二代身份证号(18位数字),最后一位是校验位,可能为数字或字符X
`/^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/`

例如:
`62222319991205131x`

## 身份证号, 支持1/2代(15位/18位数字)
`/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/`

例如:
`622223199912051311`

## 护照（包含香港、澳门）
`/(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/`

例如:
`s28233515`
`141234567`
`159203084`
`MA1234567`
`K25345719`

## 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合)
`/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/`

例如:
`justin`
`justin1989`
`justin_666`

## 纯中文/汉字
`/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/`

例如:
`正则`
`前端`

## 是否小数
`/^\d+\.\d+$/`

例如:
`0.0`
`0.09`

## 电话(座机)
`/^0\d{2,3}-\d{7,8}$/`

例如:
`0936-4211236`

## 纯数字
`/^\d{1,}$/`

例如:
`12345678`

## 是否html标签(宽松匹配)
`/<(.*)>.*<\/\1>|<(.*) \/>/`

例如:
`<div> </div>`

## 是否qq号格式正确
`/^[1-9][0-9]{4,10}$/`

例如:
`903013545`
`9020304`

## 是否由数字和字母组成
`/^[A-Za-z0-9]+$/`

例如:
`james666`
`haha233hi`

## 纯英文字母
`/^[a-zA-Z]+$/`

例如:
`Russel`

## 纯小写英文字母组成
`/^[a-z]+$/`

例如:
`russel`

## 纯大写英文字母
`/^[A-Z]+$/`

例如:
`ABC`
`KD`

## 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
`/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/`

例如:
`Kd@curry666`

## 用户名正则，4到16位（字母，数字，下划线，减号）
`/^[a-zA-Z0-9_-]{4,16}$/`

例如:
`xiaohua_qq`

## ip-v4
`/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/`

例如:
`172.16.0.0`
`127.0.0.0`

## ip-v6
`/^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i`

例如:
`2031:0000:130f:0000:0000:09c0:876a:130b`

## 16进制颜色
`/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/`

例如:
`#f00`
`#F90`
`#000`
`#fe9de8`

## 微信号，6至20位，以字母开头，字母，数字，减号，下划线
`/^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/`

例如:
`github666`
`kd_-666`

## 中国邮政编码
`/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/`

例如:
`734500`
`100101`

## 只包含中文和数字
`/^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\d))+$/`

例如:
`哈哈哈`
`你好6啊`

## 不能包含字母
`/^[^A-Za-z]*$/`

例如:
`你好6啊`
`@¥()！`






































