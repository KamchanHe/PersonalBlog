# 级联组件编写

## 项目构建

```sh
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◯ Router
 ◯ Vuex
 ◉ CSS Pre-processors
 ◉ Linter / Formatter
 ◉ Unit Testing
 ◯ E2E Testing
```

```sh
Please pick a preset: Manually select features
? Check the features needed for your project: Babel, CSS Pre-processors, Linter
? Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): Stylus
? Pick a linter / formatter config: Airbnb
? Pick additional lint features: Lint on save, Lint and fix on commit
? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N) Y
```

>默认eslint，在vue中使用了yorkie + lint-staged 实现了git hook

## 一.使用Cascader组件

```html
<template>
    <Cascader></Cascader>
</template>

<script>
import Cascader from './components/Cascader';
export default {
    components:{
        Cascader
    }
}
</script>
```

## 二.基本显示结构

```html
<template>
    <div>
        <!-- 点击输入框切换面板显示隐藏 -->
        <div class="trigger" @click="isVisible =!isVisible">
            <slot></slot>
        </div>
        <div class="content" v-if="isVisible">
            显示面板
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {isVisible:true}
    }
}
</script>
<style>
.trigger{
    width: 150px;
    height:25px;
    border: 1px solid #ccc
}
</style>
```

点击输入框以外的内容应该收起面板，此时我们一步到位将功能扩展成指令

```html
<div v-click-outside="close">
  <div class="trigger" @click="toggle">
    <slot></slot>
  </div>
  <div class="content" v-if="isVisible">
    显示面板
  </div>
</div>
```

```js
directives:{
    clickOutside:{
        inserted(el,bindings){ // 只在插入时绑定事件
            document.addEventListener('click',(e)=>{
                if(e.target === el || el.contains(e.target)){
                    return;
                }
                bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
            });
        }
    }
},
methods:{
    close(){
        this.isVisible = false
    },
    toggle(){
        this.isVisible = ! this.isVisible
    }
},
```

默认指令调用的钩子是bind和update

## 三.传入数据

```html
<Cascader :options="options"></Cascader>
```

传入递归数据

```json
[
    {
        "label": "肉类",
        "children": [
            {
                "label": "猪肉",
                "children": [
                    {
                        "label": "五花肉"
                    },
                    {
                        "label": "里脊肉"
                    }
                ]
            },
            {
                "label": "鸡肉",
                "children": [
                    {
                        "label": "鸡腿"
                    },
                    {
                        "label": "鸡翅"
                    }
                ]
            }
        ]
    },
    {
        "label": "蔬菜",
        "children": [
            {
                "label": "叶菜类",
                "children": [
                    {
                        "label": "大白菜"
                    },
                    {
                        "label": "小白菜"
                    }
                ]
            },
            {
                "label": "根茎类",
                "children": [
                    {
                        "label": "萝卜"
                    },
                    {
                        "label": "土豆"
                    }
                ]
            }
        ]
    }
]
```

## 四.数据渲染

根据省市级联的效果我们会想到点击左侧面板可以渲染右边的列表，我们先考虑两层的实现

```html
<template>
    <div v-click-outside="close">
        <div class="trigger" @click="toggle">
            <slot></slot>
        </div>
        <div class="content" v-if="isVisible">
            <div class="content-left">
                <div v-for="(item,key) in options" :key="key">
                    <div @click="select(item)">{{item.label}}</div>
                </div>
            </div>
            <div class="content-right" v-if="listsists && lists.length"
                <div v-for="(item,key) in lists" :key="key">
                    <div>{{item.label}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    directives:{
        clickOutside:{
            inserted(el,bindings){ // 只在插入时绑定事件
                document.addEventListener('click',(e)=>{
                    if(e.target === el || el.contains(e.target)){
                        return;
                    }
                    bindings.value(); // 点击非自己、或者不是自己的儿子就关闭元素
                });
            }
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
        close(){
            this.isVisible = false
        },
        toggle(){
            this.isVisible = ! this.isVisible
        }
    },
    data(){
        return {
            isVisible:true,
            currentSelect:null // 当前点击的第一层儿子
        }
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>
<style>
.trigger{
    width: 150px;
    height:25px;
    border: 1px solid #ccc
}
.content{
    display:flex
}
</style>
```

我们需要实现多层嵌套效果，那么只能使用递归组件啦！

## 五.递归组件封装

将需要重复的代码单独放到一个组件中，进行递归渲染

在父组件中传入options交给子组件渲染

```html
<CascaderItem :options="options"></CascaderItem>
```

```html
<template>
    <div class="content">
        <div class="content-left">
            <div v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <div v-for="(item,key) in lists" :key="key">
                <div>{{item.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>
```

将逻辑进行拆分，拆分出CascaderItem组件

```html
<template>
    <div class="content cascader-item">
        <div class="content-left">
            <div class="label" v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <CascaderItem :options="lists"></CascaderItem>
        </div>
    </div>
</template>

<script>
export default {
    name:"CascaderItem",
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }
    },
    props:{
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>

<style>
.cascader-item {
 display: flex;
}
.content-left{
    border: 1px solid #ccc;
    min-height: 100px;
}
.content-right{
    margin-left:-1px;
}
.label{
    width:60px;
    font-size: 12px;
    line-height: 20px;
    color: #606266;
    padding-left: 10px;
    cursor: pointer
}
.label:hover{
    background: #f5f7fa;
}
</style>
```

递归组件必须要使用name属性来实现

## 六.统一在父组件获取选中的值

```js
<template>
 <Cascader :options="options" v-model="selected"></Cascader>
</template>
selected:[]
```

用户需要获取选中的结果，我们采用贴近用户使用的方式v-model

Cascader.vue

```html
<CascaderItem :options="options" @change="change" :value="value"></CascaderItem>
```

将value传入到子组件中，当值变化后触发change事件

```js
methods:{
    close(){
        this.isVisible = false
    },
    toggle(){
        this.isVisible = ! this.isVisible
    },
    change(value){

    }
},
props:{
    value:{ // 用户选择的值
        type:Array,
        default:()=>[]
    },
    options:{
        type:Array,
        default:()=>[]
    }
}
```

CascaderItem.vue

不能在子组件中直接更改props需要拷贝传入的属性

```
yarn add lodash
```

点击某一项触发选择事件，将当前层级和结果对应上

```html
<template>
    <div class="content cascader-item">
        <div class="content-left">
            <div class="label" v-for="(item,key) in options" :key="key">
                <div @click="select(item)">{{item.label}}</div>
            </div>
        </div>
        <div class="content-right" v-if="ists && lists.length">
            <CascaderItem :options="lists"></CascaderItem>
        </div>
    </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
    name:"CascaderItem",
    data(){
        return {
             currentSelect:null // 当前点击的第一层儿子
        }
    },
    methods:{
        select(item){
            this.currentSelect = item;
            let cloneValue = cloneDeep(this.value); // 拷贝
            cloneValue[this.level] = item; // 将层级和数组的结果对应上
            this.$emit('change',cloneValue);
        },
    },
    computed: {
        lists(){
            return this.currentSelect && this.currentSelect.children
        }
    },
    props:{
        level:{ // 获取的层级
            type:Number,
            default:0
        },
        value:{ // 获取数据是数组类型
            type:Array,
            default:()=>[]
        },
        options:{
            type:Array,
            default:()=>[]
        }
    }
}
</script>

<style>
.cascader-item {
 display: flex;
}
.content-left{
    border: 1px solid #ccc;
    min-height: 100px;
}
.content-right{
    margin-left:-1px;
}
.label{
    width:60px;
    font-size: 12px;
    line-height: 20px;
    color: #606266;
    padding-left: 10px;
    cursor: pointer
}
.label:hover{
    background: #f5f7fa;
}
</style>
```

因为是递归展示数据，所以将value和level继续向下传递

```html
<div class="content-right" v-if="lists">
   <CascaderItem :options="lists" @change="change" :value="value" :level="level+1"></CascaderItem>
</div>
```

子组件会触发当前传入的change事件，所以我们要在编写个change事件

```js
change(value){
    this.$emit('change',value);
}
```

在父组件中将获得的结果同步给用户,并将选择的结果显示到页面上 Cascader.vue

```html
<div class="trigger" @click="toggle">
    <slot>{{result}}</slot>
</div>
```

```js
change(value){
    this.result = value.map(item=>item.label).join('/');
    this.$emit('input',value)
}
```

## 七.计算需要显示出的面板

```js
select(item){
    let cloneValue = cloneDeep(this.value); // 拷贝
    cloneValue[this.level] = item; // 将层级和数组的结果对应上
    cloneValue.splice(this.level+1); // 需要将当前选择层级之后的数据清空
    this.$emit('change',cloneValue);
}
```

根据最新的数据查找儿子列表

```js
lists(){
    // 因为currentSelect值不会变化 需要重新查找当前点击的是否有儿子
    // 看这一层有没有值
    if( this.value && this.value[this.level]){
        // 找到这一项
        let item = this.options.find(item=>item.label === this.value[this.level].label);
        // 将儿子进行返回
        if(item && item.children){
            return item.children
        }
    }
    //return this.currentSelect && this.currentSelect.children
}
```

## 八.实现数据动态获取

```js
import dataList from './dataList.json';
const fetchData = (id,callback)=>{
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
        let result = dataList.filter(item=>item.pid === id);
        resolve(result); // 将获取到的数据传递出去
       },300)
    })
}
data() { 
  return {
   selected:[],
   options:[],
  }
},
async mounted(){
    let r = await fetchData(0); // 动态设置数据
    this.options = r;
},
```

## 九.动态添加儿子节点

```html
<Cascader :options="options" v-model="selected" @input="change"></Cascader>
// 手动添加事件监听

```

```js
methods:{
     async change(items){ // 获取到所有数据加载最后一项看是否有子节点
        let item = items[items.length - 1];
        let children = await fetchData(item.id);
        if(children){
            this.$set(item,'children',children)
        }
     }
 },
```

## 十.传入加载函数

```html
<Cascader :options="options" v-model="selected" :lazyLoad="lazyLoad"></Cascader>
```

组件内部默认会调用lazyLoad传入当前的item和回调，用户获取数据后调用callback将获取到的数据回传

```js
async lazyLoad(id,callback){
    let children = await fetchData(id);
    callback(children);
},
```

广度遍历找到当前这一项增加儿子节点

```js
getNewData(id,children){ // 获取的个字
    // 获取儿子节点后
    let cloneValue = cloneDeep(this.options)
    let stack = [...cloneValue];
    let index = 0;
    let current;
    while(current = stack[index++]){
        if(current.id !== id ){ // 找id相同的
        if(current.children){
                stack = stack.concat(current.children);
        }
        }else{
            break;
        }
    }
    if(current){
        current.children = children;
        this.$emit('update:options',cloneValue); // 将内容回显回去
    }
},
change(value) {
    this.result = value.map(item => item.label).join("/");
    let lastItem = value[value.length-1];
    if(this.lazyLoad){ // 如果传递加载函数就调用否则不需要加载数据
        this.lazyLoad(lastItem.id,(children)=>{
            this.getNewData(lastItem.id,children); // 动态添加儿子
        });
    }
    this.$emit("input", value);
}
```

## 十一.npm项目发布

修改package.json

```json
{
    "name": "vue-cascader-async", // 发布的项目名称
    "private": false, // 可以提交到公共仓库上
    "version": "0.1.4",// 发布项目版本
    "dist": "vue-cli-service build --target lib --name Cascader  ./src/components/Cascader.vue", // 打包的组件
    "main": "./dist/Cascader.umd.min.js"// 入口文件
}
```

发布包

```sh
npm addUser
npm publish
```








































































