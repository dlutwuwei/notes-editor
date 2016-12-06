# draft-js 入门

Draft.js是由facebook开发的基于react开发的一个富文本编辑器,使用react构建富文本编辑器的框架，由immutable模型抽象实现跨浏览器

# Installation

Currently Draft.js is distributed via npm. It depends on React and React DOM which must also be installed.

```
npm install --save draft-js react react-DOM
```
# Usage 

```
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
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

Because Draft.js supports unicode, you must have the following meta tag in the <head></head> block of your HTML file:
```
<meta charset="utf-8" />
```
Next, let's go into the basics of the API and learn what else you can do with Draft.js.

