# notes-editor

# development
```
npm start
```

# build
```
npm run build
```

# draft-js 调研

draft-js基于react开发，利用react的state和virtual dom对应关系，使用contentEditable属性，但是通过替换默认dom元素的方式重新布局，使dom完全可控

## EditorState

最顶层的state，所有编辑器相关的state都在这里

## ContentState

控制内容显示的state

## SelectionState

控制选区的state

## ContentBlock

内容块，可以文本，entity，段落等

## Entity

Entity is a static module containing the API for creating, retrieving, and updating entity objects