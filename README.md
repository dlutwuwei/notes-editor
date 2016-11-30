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

draft-js基于react开发，利用react的state和virtual dom对应关系，还需控制state的状态便可以控制文档的显示
输入和光标移动，换行等行为均有编辑器自己控制

## EditorState

最顶层的state，所有编辑器相关的state都在这里

## ContentState

控制内容显示的state

## SelectionState

控制选区的state