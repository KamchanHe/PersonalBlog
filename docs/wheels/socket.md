---
title: Socket
date: 2019-11-20
categories: article
author: Kamchan
tags:
  - Javascript
  - Socket
  - Socket.io
  - Socket.io-client
  - React
---

## 服务端

### server.js

```js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = require("./user.js");
const Chat = require("./model.js").getModel("chat");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cors = require("cors");

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser());
app.use(cookieParser());
app.use("/user", userRouter);

io.on("connection", socket => {
  socket.on("sendMsg", data => {
    const { from, to, msg } = data;
    const chatid = [from, to].sort().join("_");
    Chat.create(
      { chatid, from, to, content: msg, create_time: new Date().getTime() },
      (err, doc) => {
        if (!err) {
          io.emit("recvMsg", doc);
        }
      }
    );
  });
});

server.listen(8080, () => {
  console.log("server connect success!");
});
```

### user.js

```js
const express = require("express");
const Router = express.Router();
const User = require("./model.js").getModel("user");
const Chat = require("./model.js").getModel("chat");
const bcrypt = require("bcrypt");
Router.post("/register", (req, res) => {
  const { user, password, type } = req.body;
  User.findOne({ user }, (err, doc_find) => {
    if (doc_find) {
      return res.json({ code: 1, msg: "用户名已存在!" });
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        User.create({ user, password: hash, type }, (err, doc_create) => {
          if (err) {
            return res.json({ code: 1, msg: "注册失败，请稍后重试!" });
          }
          doc_create.password = "";
          res.cookie("userInfo", JSON.stringify(doc_create), {
            maxAge: 60000 * 60 * 1,
            httpOnly: true
          });
          res.json({ code: 0, data: { user, type, _id: doc_create._id } });
        });
      });
    });
  });
});

Router.post("/login", (req, res) => {
  const { user, password } = req.body;
  User.findOne({ user }, (err, doc_find) => {
    if (!doc_find) {
      return res.json({ code: 1, msg: "用户名不存在!" });
    }
    bcrypt.compare(password, doc_find.password, function(err, match) {
      const pwdMatchFlag = match;
      if (pwdMatchFlag) {
        doc_find.password = "";
        res.cookie("userInfo", JSON.stringify(doc_find), {
          maxAge: 60000 * 60 * 1,
          httpOnly: true
        });
        res.json({ code: 0, userInfo: doc_find });
      } else {
        res.json({ code: 1, msg: "密码错误!" });
      }
    });
  });
});

Router.get("/info", (req, res) => {
  let { userInfo } = req.cookies;
  if (!userInfo) {
    return res.json({ code: 1 });
  }
  userInfo = JSON.parse(userInfo);
  User.findOne({ user: userInfo.user }, (err, doc_find) => {
    if (err) {
      return res.json({ code: 1, msg: "没有此用户!" });
    }
    if (doc_find) {
      return res.json({ code: 0, data: userInfo });
    }
  });
});

Router.post("/update", (req, res) => {
  let { userInfo } = req.cookies;
  userInfo = JSON.parse(userInfo);
  if (!userInfo) {
    return res.json({ code: 1, msg: "用户信息已过期!" });
  }
  User.findByIdAndUpdate(userInfo._id, req.body, (err, doc) => {
    if (err) {
      return res.json({ code: 1, msg: "更新失败!" });
    }
    const data = Object.assign(
      {},
      {
        user: doc.user,
        type: doc.type
      },
      req.body
    );
    return res.json({ code: 0, data });
  });
});

Router.get("/list", (req, res) => {
  let { type } = req.query;
  User.find({ type }, { password: 0 }, (err, doc) => {
    if (err) {
      return res.json({ code: 1, msg: "查找失败，请重试!" });
    }
    res.json({ code: 0, data: doc });
  });
});

Router.post("/logout", (req, res) => {
  let { userInfo } = req.cookies;
  if (!userInfo) {
    return res.json({ code: 0, msg: "用户信息已过期!" });
  }
  res.cookie("userInfo", "", { maxAge: 0, httpOnly: true });
  res.json({ code: 0, msg: "退出成功!" });
});

Router.get("/getMsgList", (req, res) => {
  const userid = req.cookies.userInfo
    ? JSON.parse(req.cookies.userInfo)._id
    : undefined;
  User.find({}, (err, userdoc) => {
    let users = {};
    userdoc.forEach(v => {
      users[v._id] = { name: v.user, avatar: v.avatar };
    });
    Chat.find({ $or: [{ from: userid }, { to: userid }] }, (err, doc) => {
      if (!err) {
        return res.json({ code: 0, msgs: doc, users: [users] });
      }
    });
  });
});

Router.post("/readMsg", (req, res) => {
  const { from } = req.body;
  const userid = req.cookies.userInfo
    ? JSON.parse(req.cookies.userInfo)._id
    : undefined;
  console.log(from, userid);
  Chat.update(
    { from, to: userid },
    { read: true },
    { multi: true },
    (err, doc) => {
      console.log(doc);
      if (!err) {
        return res.json({ code: 0, num: doc.nModified });
      }
      return res.json({ code: 1, msg: "已读更新失败" });
    }
  );
});

module.exports = Router;
```

### model.js

```js
const mongoose = require("mongoose");
const DB_URL = "mongodb://112.74.46.214:27017/reactapp";
mongoose.connect(DB_URL);

const models = {
  user: {
    user: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    },
    avatar: {
      type: String
    },
    desc: {
      type: String
    },
    title: {
      type: String
    },
    company: {
      type: String
    },
    money: {
      type: String
    }
  },
  chat: {
    from: {
      type: String,
      require: true
    },
    to: {
      type: String,
      require: true
    },
    content: {
      type: String,
      require: true,
      default: ""
    },
    create_time: {
      type: Number,
      require: true
    },
    read: {
      type: Boolean,
      default: false
    },
    chatid: {
      type: String,
      require: true
    }
  }
};

for (let m in models) {
  mongoose.model(m, mongoose.Schema(models[m]));
}

module.exports = {
  getModel: function(name) {
    return mongoose.model(name);
  }
};

mongoose.connection.on("connected", () => {
  console.log("mongodb connect success!");
});
```

## 客户端

### index.js

```js
import React from "react";
import ReactDom from "react-dom";
import thunk from "redux-thunk";
import axios from "axios";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducer.js";
import { HashRouter, Route, Switch } from "react-router-dom";
import Msg ftom './msg.js'

const history = require('history').createHistory;
axios.defaults.withCredentials=true;

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

ReactDom.render(
  <Provider store={store}>
    <Route history={history}>
      <div>
        <Switch>
          <Route path="/msg" component={msg}></Route>
        </Switch>
      </div>
    </Route>
  </Provider>,
  document.getElementById("root")
);
```

### reducers.js

```js
import { combineReducers } from "redux";
import { chat } from "./redux/chat.redux.js";
export default combineReducers({ chat });
```

### msg.js

```js
import React from 'react';
import {connect} from 'react-redux';
import {sendMsg,getMsgList,recvMsg,readMsg,changeIo} from './chat.redux.js';

@connect(
	state=>state,
	{sendMsg,recvMsg,getMsgList,readMsg,changeIo}
)

class Msg extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			text:''
		}
	}

	handleSubmit() {
		this.props.sendMsg({
			from:'发件人',
			to:'收件人',
			msg:this.state.text
		})
		this.setState({
			text:''
		})
	}

	componentDidMount(){
		if (!this.props.chat.isOpen) {
			this.props.recvMsg();
			this.props.changeIo()
		}
		if (!this.props.chat.chatmsg.length) {
			this.props.getMsgList();
		}
	}

	componentWillUnmount(){
		const to = '收件人';
		this.props.readMsg(to);
	}

	render(){
		const to = '收件人';
		const me = '当前用户';
		if (!to || !me) {
			return null;
		}
		return(
      <div id='chat-page'>
        <div>渲染获取到的信息列表</div>
				<div className='text-input'>
					<List>
						<InputItem
						placeholder='请输入'
						extra={<span onClick={()=>this.handleSubmit()}>发送</span>}
						value={this.state.text}
						onChange={(val)=>this.setState({text:val})}/>
					</List>
				</div>
			</div>
		)
	}
}

export default Msg;
```

### chat.redux.js

```js
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
const MSG_LIST = "MSG_LIST";
const MSG_RECV = "MSG_RECV";
const MSG_READ = "MSG_READ";
const SOCKET_CONNECT = "SOCKET_CONNECT";

const initState = {
  chatmsg: [],
  users: [],
  unread: 0,
  isOpen: false
};

export function chat(state = initState, action) {
  switch (action.type) {
    case MSG_LIST:
      return {
        ...state,
        chatmsg: action.data,
        users: action.users,
        unread: action.data.filter(
          v => v.read == false && v.to == action.userid
        ).length
      };
    case MSG_RECV:
      const n = action.data.to === action.userid ? 1 : 0;
      return {
        ...state,
        chatmsg: [...state.chatmsg, action.data],
        unread: state.unread + n
      };
    case MSG_READ:
      return {
        ...state,
        chatmsg: state.chatmsg.map(v => ({ ...v, read: true })),
        unread: state.unread - action.num
      };
    case SOCKET_CONNECT:
      return { ...state, isOpen: true };
    default:
      return { ...state };
  }
}

function msgList(msgs, users, userid) {
  return { type: MSG_LIST, data: msgs, users: users, userid };
}

function msgRecv(msg, userid) {
  return { type: MSG_RECV, data: msg, userid };
}

function msgRead({ userid, from, num }) {
  return { type: MSG_READ, data: { userid, from, num } };
}

export function getMsgList() {
  return (dispatch, getState) => {
    axios.get("http://localhost:8080/user/getMsgList").then(res => {
      if (res.status == 200 && res.data.code == 0) {
        dispatch(msgList(res.data.msgs, res.data.users, getState().user._id));
      }
    });
  };
}

export function readMsg(from) {
  return (dispatch, getState) => {
    axios.post("http://localhost:8080/user/readMsg", { from }).then(res => {
      const userid = getState().user._id;
      if (res.status == 200 && res.data.code == 0) {
        dispatch(msgRead({ userid, from, num: res.data.num }));
      }
    });
  };
}

export function sendMsg(msg) {
  return dispatch => {
    socket.emit("sendMsg", msg);
  };
}

export function recvMsg() {
  return (dispatch, getState) => {
    socket.on("recvMsg", msg => {
      dispatch(msgRecv(msg, getState().user._id));
    });
  };
}

export function changeIo() {
  return { type: SOCKET_CONNECT };
}
```

```js
if (!this.props.chat.isOpen) {
  this.props.recvMsg();
  this.props.changeIo();
}
if (!this.props.chat.chatmsg.length) {
  this.props.getMsgList();
}
```
