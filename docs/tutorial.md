# draft-js 入门

Draft.js是由facebook开发的基于react开发的一个富文本编辑器,使用react构建富文本编辑器的框架，由immutable模型抽象实现跨浏览器

# Installation

当前的Draft.js通过npm分发，依赖于React和React DOM, 也必须安装他们.

```
npm install --save draft-js react react-DOM
```

推荐使用webpack打包.

# Usage 

简单实现一个编辑器, 注意onchange方法，这个是必须的，contenteditable中元素在变化时,
需要触发onchange去生成新的结构化的dom元素替换默认生成的元素.

```
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    const {editorState} = this.state;
    return <Editor editorState={editorState} onChange={this.onChange} />;
  }
}

ReactDOM.render(
  <MyEditor />,
  document.getElementById('container')
);
```

因为Draft.js支持unicode, 你必须在你的html文件的`<head></head>`块添加下面的meta标签:

```
<meta charset="utf-8" />
```

下面，我们一起去看看API的基本用法，学习一下用Draft.js还能做些别的什么.

## 获取焦点的位置

当我们想加一些交互按钮的时候，一般都想知道输入焦点的位置，draft.js并没有提供获取dom元素的功能.

```
let key = this.state.editorState.getSelection().getStartKey();
let current_dom = document.querySelector(`[data-offset-key='${key}-0-0']`);
console.log('current offset top: ', current_dom.offsetTop, current_dom.offsetHeight);
```
我们先要通过this.state.editorState获取选区的key值，在他通过属性的查找，找到dom元素,便可以获取当前选区所在的dom元素。


## insert and render block

插入block是富文本经常用的功能，draft将所有的内容都抽象为块，block可由文本内容, Type(paragraph, header, list item), 或者entity, inline style, and depth 

- entity块
首先创建entity，使用AtomicBlockUtils插入atomic block,
> atomic block是一个内建的block类型，表示不可分解
```
const entityKey = Entity.create(
    urlType,
    'IMMUTABLE',
    { src: urlValue }
);
// 插入一个entity封装位block
this.setState({
    editorState: AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ''
    ),
    showURLInput: false,
    urlValue: '',
}, () => {
    setTimeout(() => this.focus(), 0);
});
```


### block and entity

### block styles

## handle key command

## key binding

## decorator

## inline styles

## nested list

## text

## utils

## Issues and Pitfalls
