---
title: Shell——Oh My Zsh 配置指南
date: 2019-08-29
categories: article
author: Kamchan
tags:
- Mac
- MacOS Catalina
- Zsh
- Oh My Zsh
---

在 WWDC 2019 上，Apple 公布了下一代 macOS —— [macOS Catalina](https://www.apple.com/macos/catalina-preview/)。除了全新的音乐和电视等 app、支持 iPad 作为外置显示器等显而易见的更新，macOS Catalina 还为专业用户带来了一项重大变化 —— Zsh 将取代 Bash，成为操作系统的默认 Shell。

尽管 Apple 没有对这一改变作出解释，但根据 The Verge 的 猜测，这可能与 GPLv3 协议有关。macOS 目前使用的 Bash 3.2 版本基于 GPLv2 协议，但新版 Bash 已经转移到了 GPLv3 协议。GPLv3 协议对 Apple 这样的大公司有着更严格的限制，这可能是 Apple 不再将 Bash 作为默认 Shell 的原因。

而相比 Bash 来说，Zsh 也拥有许多更强大的功能：更智能的自动补全、命令选项提示、更丰富的主题，等等。

![一个漂亮又强大的终端](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_001.png)

## Zsh 与 Oh My Zsh

Zsh 本体有着强大的功能，但碍于其复杂的配置，对普通用户而言并不太适合。但是，一个开源项目的出现打破了这一局面 —— 它就是本文的主角：[Oh My Zsh](https://github.com/robbyrussell/oh-my-zsh)。借助 Oh My Zsh，你只需要进行极为简单的安装配置，就可以用上 Zsh，并享受许多酷炫的功能，下面就让我们正式开始安装过程。

## 安装 Oh My Zsh

macOS Mojave + 已经自带了 Zsh，所以我们直接安装 Oh My Zsh。安装过程极为简单，打开终端，执行一行命令即可：

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

:::tip
在安装过程中会提示 <font color="#c7254e">Do you want to change your default shell to zsh? [Y/n]</font>（是否将<font color="#c7254e">默认 Shell</font> 切换到 <font color="#c7254e">Zsh</font>），按下 <font color="#c7254e">Y</font> 并回车即可。随后会提示 <font color="#c7254e">Password for xxx</font>，输入你的用户密码并回车即可。当你看见大大的 <font color="#c7254e">Oh my zsh</font> 标志时就表示 <font color="#c7254e">Oh My Zsh</font> 已经安装成功了。
:::

![显示「Oh my zsh」表示安装成功](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_002.png)

## 基本设置

安装好 Oh My Zsh 后，使用以下命令打开 Zsh 的设置文件：

    vim ~/.zshrc

在 vim 编辑器下，你可以使用方向键移动光标，按 <font color="#c7254e">i</font> 进入<font color="#c7254e">编辑模式</font>，编辑好后按 <font color="#c7254e">esc</font> 退出编辑模式，随后输入 <font color="#c7254e">:wq</font> 并回车即可保存。有关 Vim 的更多使用方法你可以参考 [这篇教程](https://www.runoob.com/linux/linux-vim.html)。

:::tip
Mac 下的 Vim 默认是没有显示行号 & 开启语法高亮的，你可以参考以下命令打开行号显示 & 语法高亮：
:::

```
cp /usr/share/vim/vimrc ~/.vimrc  #复制 vim 配置模版

echo 'syntax on' >> ~/.vimrc  #开启语法高亮

echo 'set nu!' >> ~/.vimrc  #开启行号显示
```

Zsh 的配置文件中提供了详细的注释，你可以根据注释修改相关设置，满足自己的要求。例如，你想关闭 Zsh 的自动更新，则定位到 <font color="#c7254e">DISABLE_AUTO_UPDATE </font>一行，根据前面的注释，删除行前的注释符号 <font color="#c7254e">#</font> 即可。

![关闭自动更新](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_003.png)

保存退出之后，使用以下命令使 Zsh 的配置立即生效：

    source ~/.zshrc

## 设置主题

Oh My Zsh 自带了大量主题文件。你可以执行以下命令查看自带的主题：

    ls ~/.oh-my-zsh/themes

对于自带主题的样式和呈现效果，你可以前往 Oh My Zsh 的 [官方 Wiki](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes) 查看。

在这里，我选择使用 [agnoster](https://github.com/agnoster/agnoster-zsh-theme) 作为我的主题。我们需要通过编辑 zsh 配置文件来修改主题：

    vim ~/.zshrc

定位到 <font color="#c7254e">ZSH_THEME</font> 一行，将双引号中的内容修改为自己选择的主题名即可。

![修改主题名](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_004.png)

保存退出后，执行以下命令使 zsh 的配置立即生效：

    source ~/.zshrc

### 安装 Powerline 字体

主题设置完成后，终端中却出现了乱码的字符：

![乱码字符](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_005.png)

这是由于我使用的 agnoster 主题中含有特殊字符，需要安装 [Powerline](https://github.com/powerline/fonts) 字体支持才能正常显示。打开终端，参考以下命令安装 Powerline 字体：

```
cd ~/Downloads && git clone https://github.com/powerline/fonts.git  #将 Powerline 字体文件下载到「下载」文件夹中

cd fonts && ./install.sh  #安装所有 Powerline 字体

cd && rm -rf ~/Downloads/fonts  #删除下载的字体文件
```

随后，我们按 <font color="#c7254e">⌘ + ,</font> 打开终端偏好设置，在<font color="#c7254e">「描述文件 > 文本」</font>中更改字体。

![更改字体选项](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_006.png)

在弹出的窗口中选择一款 Powerline 字体（所有可选项请参考 Powerline 的 [GitHub 页面](https://github.com/powerline/fonts)），调整一下字体大小即可。在这里我选择了 <font color="#c7254e">DejaVu Sans Mono for Powerline 字体 ~~（逮虾户！）~~ </font>，大小设置为 <font color="#c7254e">14 磅</font>。

![我的字体设置](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_007.png)

此时回到终端，发现表示文件目录的箭头已经可以正常显示了：

![Powerline 字体可以在 agnoster 主题中正常显示](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_008.png)

### 配置终端颜色方案

主题上的配置至此就差不多了，然而 macOS Mojave + 默认终端的黑底白字看起来还是有些不舒服。在这里，我们不妨使用 [Solarized](https://github.com/altercation/solarized) 配色方案来进一步美化终端。首先，使用以下命令下载 Solarized 配色方案：

    cd ~/Downloads && git clone git://github.com/altercation/solarized.git  #将配色方案下载到「下载」文件夹中

下载完毕后，我们按 <font color="#c7254e">⌘ + ,</font> 打开终端偏好设置，点击<font color="#c7254e">「描述文件 > ⚙︎⌄ > 导入」</font>。

![导入选项](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_009.png)

在弹出的窗口中，定位到 <font color="#c7254e">Downloads > solarized > osx-terminal.app-colors-solarized</font>，双击 <font color="#c7254e">Solarized Dark ansi.terminal</font> 导入暗色的 <font color="#c7254e">Solarized</font> 配色方案。

![选择下载好的 Solarized 配色方案](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_010.png)

随后，我们在描述文件中选中 <font color="#c7254e">Solarized Dark ansi</font>，点击<font color="#c7254e">「默认」</font>将其设为默认配色方案；别忘了把字体改为 <font color="#c7254e">Powerline</font> 字体并调整大小。

![别忘记改字体](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_011.png)

### 配色细节修改

重启一下终端，到这里，我们漂亮的终端已经基本完成了，但是现在的配色让人有些看不清字：

![有些看不清字](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_012.png)

重度强迫症的我肯定不能接受。因此我们按 <font color="#c7254e">⌘ + ,</font> 打开终端偏好设置，点击<font color="#c7254e">「描述文件 > Solarized Dark ansi」</font>，对配色进行进一步的自定义。单击你想要更改的颜色，在弹出的小窗口中点选<font color="#c7254e">拾色器</font>（像吸管一样的东西）。

![拾色器](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_013.png)

随后，你可以参考下图把颜色一项一项吸过去。这里我的配置综合了 [iTerm 2](https://www.iterm2.com/) 的配色和个人的少量修改。

![配色方案参考](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_014.png)

还有一项让我不爽的地方 —— 文件目录前那个长长的 <font color="#c7254e">demo@Stevens-MacBook-Pro</font>。通过修改主题配置文件，我们就能去掉它。使用以下命令编辑 <font color="#c7254e">agnoster</font> 主题的配置文件：

    vim ~/.oh-my-zsh/themes/agnoster.zsh-theme

定位到以下内容：

```
# Context: user@hostname (who am I and where am I)

prompt_context() {

  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then

    prompt_segment black default "%(!.%{%F{yellow}%}.)%n@%m"

  fi

}

```

在 <font color="#c7254e">prompt_segment black default "%(!.%{%F{yellow}%}.)%n@%m"</font> 前面加一个注释符号 <font color="#c7254e">#</font>，保存退出，执行 <font color="#c7254e">source ~/.zshrc</font> 使配置立即生效即可。

## 配置插件

Oh My Zsh 支持许多强大的插件，可以实现语法高亮、命令自动补全等功能。你可以执行以下命令查看自带的插件：

    ls ~/.oh-my-zsh/plugins/

对于自带插件的功能及使用，你可以前往 Oh My Zsh [官方 Wiki](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins) 查看。

要启用某个插件，只需要用 <font color="#c7254e">vim ~/.zshrc</font> 编辑 <font color="#c7254e">zsh 配置文件</font>，定位到 <font color="#c7254e">plugins</font> 一行，在括号中添加需要的插件名称，以空格分隔。保存退出后，别忘了执行  <font color="#c7254e">source ~/.zshrc</font> 使配置立即生效。

![修改 plugins 一行的配置启用插件](https://kamchan.oss-cn-shenzhen.aliyuncs.com/personalBlog/pubilc/zshImage/zsh_015.png)

### 我使用的插件

#### git

默认启用的插件，提供了各种 git 命令的缩写。其 [官方说明](https://github.com/robbyrussell/oh-my-zsh/tree/master/plugins/git/) 提供了所有缩写的参考。

#### z

自带插件，添加到配置文件中即可启用，可以帮助你快速跳转到访问过的文件夹。具体使用方法请自行 Google 或参考 [GitHub 文档](https://github.com/rupa/z)。

#### zsh-syntax-highlighting

输入正确的常用命令会以绿色高亮显示，输入错误则会显示其他的颜色。使用以下命令安装：

    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

下载完成后，别忘了把 <font color="#c7254e">zsh-syntax-highlighting</font> 添加到配置文件的 <font color="#c7254e">plugins</font> 中，并执行 <font color="#c7254e">source ~/.zshrc</font> 使配置生效。

#### zsh-autosuggestions

输入命令时，会用浅色字体给出建议的命令，按 <font color="#c7254e">→</font> 即可自动补全。使用以下命令安装：

    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

下载完成后，别忘了把 <font color="#c7254e">zsh-autosuggestions</font> 添加到配置文件的 <font color="#c7254e">plugins</font> 中，并执行 <font color="#c7254e">source ~/.zshrc</font> 使配置生效。

为了让提示的字体颜色正确显示，我们还需要执行：

```
echo "export TERM=xterm-256color" >> ~/.zshrc #声明终端类型
echo "ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=10'" >> ~/.zshrc  #设置建议命令的文字颜色
```

你可以修改 <font color="#c7254e">fg=</font> 后的数字来指定建议命令的文字颜色，数字与颜色的对应表请参考 [这里](https://upload.wikimedia.org/wikipedia/commons/1/15/Xterm_256color_chart.svg)。

## 小结

至此，你已经完成了 Oh My Zsh 在 macOS 下的基本配置。现在你获得了一个更漂亮、更强大的终端，相信这能让你在终端下进行操作时事半功倍。

































































