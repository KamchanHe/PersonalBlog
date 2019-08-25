# Vue单元测试

## 一.什么是单元测试

单元测试就是测试最小单元(一个方法，一个组件)

- 修改js模块功能，其它模块也受影响，很难快速定位bug
- 多人开发代码越来越难以维护,不方便迭代,代码无法重构

## 二.TDD & BDD

- Test-Driven Development, 测试驱动开发
  - 先编写测试用例代码，然后针对测试用例编写功能代码，使其能够通过
  - 很好的诠释了代码即文档
  - 清晰地了解软件的需求
- Behavior Driven Development，行为驱动开发
  - 系统业务专家、开发者、测试人员一起合作，分析软件的需求，然后将这些需求写成一个个的故事。开发者负责填充这些故事的内容
  - 保证程序实现效果与用户需求一致。

## 三.jest + Vue Test Utils

- jest 是facebook推出的一款测试框架,集成了 Mocha,chai,jsdom,sinon等功能。
- Vue Test Utils 是 Vue.js 官方的单元测试实用工具库。

## 四.添加覆盖率

```js
{
    collectCoverage: true,
    collectCoverageFrom: ['**/*.{js,vue}', '!**/node_modules/**'],

}
```

## 五.jest常见测试方法

### 测试哪些功能

- 测试渲染的内容是否符合预期
- 测试事件执行后是否符合预期
- 测试事件是否能被调用
- 测试vue中自定义事件能否被触发

### 测试mock方法

- jest.fn (mock function)
- mock axios (mock ajax)
- jest.useFackTimers (mock timer)
- jest.runAllTimers
- jest.useRealTimers

## 六.测试组件

### 1.测试close事件是否生效

```js
it('测试close事件能否生效', () => {
const wrapper = shallowMount(Cascader, {
    propsData: {
    isVisible: true,
    },
});
expect(wrapper.vm.isVisible).toBeTruthy;
wrapper.vm.close();
expect(wrapper.vm.isVisible).toBeFalsy;
});
```

### 2.测试lazyLoad方法是否正常被触发

```js
it('测试 lazyLoad', () => {
const callback = jest.fn();
const wrapper = shallowMount(Cascader, {
    propsData: {
    lazyLoad: callback,
    },
});
wrapper.find('.trigger').trigger('click');
wrapper.find(CascaderItem).vm.$emit('change', [{ label: 'name' }]);
expect(callback).toBeCalled();
});
```

### 3.测试handle方法是否符合规范

```js
it('测试handle方法', () => {
const wrapper = shallowMount(Cascader, {
    propsData: {
    options: [
        {
        id: 1,
        label: '北京',
        children: [{ id: 3, label: '广州' }],
        },
        {
        id: 2,
        label: '上海',
        },
    ],
    },
});
wrapper.vm.handle(1, []);
expect(wrapper.emitted()['update:options']).toBeTruthy;
wrapper.vm.handle(3, []);
expect(wrapper.emitted()['update:options']).toBeTruthy;
wrapper.vm.handle(5, []);
expect(wrapper.emitted()['update:options']).toBeFalsy;
});
```

### 4.测试页面显示的结果

```js
it('computed', () => {
    const wrapper = shallowMount(Cascader, {
        propsData: {
        value: [{ label: '香蕉' }, { label: '苹果' }],
        },
    });
    expect(wrapper.vm.result).toBe('香蕉/苹果');
});
```





























