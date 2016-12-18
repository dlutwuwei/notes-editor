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

当我们想加一些交互按钮的时候，一般都想知道输入焦点的位置，draft.js并没有提供获取dom元素的api.

```
let key = this.state.editorState.getSelection().getStartKey();
let current_dom = document.querySelector(`[data-offset-key='${key}-0-0']`);
console.log('current offset top: ', current_dom.offsetTop, current_dom.offsetHeight);
```
我们先要通过this.state.editorState获取选区的key值，在他通过属性的查找，找到dom元素,便可以获取当前选区所在的dom元素。


## insert and render block

插入block是富文本经常用的功能，draft将所有的内容都抽象为块，block可由文本内容, Block Type(paragraph, header, list item), 或者entity, inline style, and depth 

### entity

entity 一个内容封装概念，可以AtomicBlockUtils.insertAtomicBlock转化为block插入编辑器中。

> atomic block是一个特殊的block类型，表示不可分解

创建一个type为urlType的entity，使用AtomicBlockUtils插入atomic block

```
const entityKey = Entity.create(
    urlType,
    'IMMUTABLE',
    { src: urlValue }
);
// 插入一个entity
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
修改entity，使用Entity.mergeDatah或者Enitiy.replaceData进行修改,替换或者合并entity的data。
```
Entity.mergeData(entityKey, {content: this.state.texValue});
```

### block

block是构成contentState的基本单位, entity是一种内容封装结构。
如果block包含entity, 从block也可以获取entity.

- 内键的block类型-block types

| HTML element	 | Draft block type      |   
| :-------------- |:--------------------|   
| \<h1/>	         | header-one   |
| \<h2/>	         | header-two   |
| \<h3/>	         | header-three |
| \<h4/>	         | header-four  |
| \<h5/>	         | header-five  |
| \<h6/>	         | header-six   |
| \<blockquote/>	 | blockquote   |
| \<pre/>	       | code-block  |
| \<figure/>	     | atomic    |
| \<li/>	         | unordered-list-item,ordered-list-item**|
| \<div/>	       | unstyled* |

block的类型使用者不能修改，只能在限定的类型中选择，其实上面的类型已经完全够用了，
而且entity的type可以用户随意控制。

当你想插入一个自定义的block时，可以通过AtomicBlockUtils插入一个atomic类型的block，
包含自定义type的entity，这样很方便的解决了这个问题


### block styles

block styles让我们可以针对某种block添加classname，利用blockStyleFn方法匹配不同type的block，返回一个classname
```
function myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'blockquote') {
    return 'superFancyBlockquote';
  }
}

// Then...
import {Editor} from 'draft-js';
class EditorWithFancyBlockquotes extends React.Component {
  render() {
    return <Editor ... blockStyleFn={myBlockStyleFn} />;
  }
}
```
### blockRenderMap

自定义某种类型的block对应的dom元素类型，如下 'header-two'对应h2标签
```
const blockRenderMap = Immutable.Map({
  'header-two': {
   element: 'h2'
  },
  'unstyled': {
    element: 'h2'
  }
});

class RichEditor extends React.Component {
  render() {
    return (
      <Editor
        ...
        blockRenderMap={blockRenderMap}
      />
    );
  }
}
```
> 当draft从html转化为contentState时, 指定aliasedElements规定某种元素转化为那种block，下面的p会生成unstyle的block

```
'unstyled': {
  element: 'div',
  aliasedElements: ['p'],
}
```
### block wrapper

block wrapper用于将某种block转化为自定义react组件，或在convertFromHTML时执行相反的过程
```
class MyCustomBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='MyCustomBlock'>
        {/* here, this.props.children contains a <section> container, as that was the matching element */}
        {this.props.children}
      </div>
    );
  }
}

const blockRenderMap = Immutable.Map({
  'MyCustomBlock': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'section',
    wrapper: <MyCustomBlock {...this.props} />
  }
});

// keep support for other draft default block types and add our myCustomBlock type
const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

class RichEditor extends React.Component {
  ...
  render() {
    return (
      <Editor
        ...
        blockRenderMap={extendedBlockRenderMap}
      />
    );
  }
}
```

### blockRendererFn and block render

使用blockRendererFn可以通过block的类型生成react组件给编辑器，编辑器会将其展示出来

```
function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
      props: {
        foo: 'bar',
      },
    };
  }
}

// Then...
import {Editor} from 'draft-js';
class EditorWithMedia extends React.Component {
  ...
  render() {
    return <Editor ... blockRendererFn={myBlockRenderer} />;
  }
}
```
## handle key command and key binding

draft对一些键盘操作会触发一些command，通过handleKeyCommand方法捕获。

keyBindingFn是捕获所有键盘事件的方法, 当有command键和s键按下，返回一个‘myeditor-save'
新command，否则沿用默认的命令生成getDefaultKeyBinding.

handleKeyCommand捕获myeditor-save命令进行相关处理。
```
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
const {hasCommandModifier} = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent): string {
  if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
    return 'myeditor-save';
  }
  return getDefaultKeyBinding(e);
}

import {Editor} from 'draft-js';
class MyEditor extends React.Component {
  // ...

  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'myeditor-save') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand.bind(this)}
        keyBindingFn={myKeyBindingFn}
        ...
      />
    );
  }
}
```

## decorator

## inline styles

customStyleMap对style进行配置，并使用RichUtils.toggleInlineStyle对选区添加样式

```
import {Editor} from 'draft-js';

const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through',
  },
};

class MyEditor extends React.Component {
  // ...
  render() {
    return (
      <Editor
        customStyleMap={styleMap}
        editorState={this.state.editorState}
        ...
      />
    );
  }
}

const currentStyle = editorState.getCurrentInlineStyle();

// Unset style override for current color.
if (selection.isCollapsed()) {
  nextEditorState = currentStyle.reduce((state, color) => {
    return RichUtils.toggleInlineStyle(state, color);
  }, nextEditorState);
}

// If the color is being toggled on, apply it.
if (!currentStyle.has(toggledColor)) {
  nextEditorState = RichUtils.toggleInlineStyle(
    nextEditorState,
    toggledColor
  );
}

```
## nested list

## text

## utils

## Issues and Pitfalls
