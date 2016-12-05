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

Entity是一个静态的模块，包含创建，恢复，更新entity对象的api，生成的entity对象为DraftEntityInstance

entity是一个表示元数据的对象，包含一段文本,包含三个属性type，mutability，data
- type: 自定义type，e.g. 'LINK', 'MENTION', 'PHOTO'；
- mutability: 可变性，Immutable表示不可改变，Mutable可改变，Segmented部分可变；
- data: 自定义data，最终注入到dom元素的dataset；

## AtomicBlockUtils

insertAtomicBlock: function(
  editorState: EditorState,
  entityKey: string,
  character: string
): EditorState

插入一个type为atomic的content block, 由entity或者character创建
> 现在只有这一个api插入content block

## Modifier

提供api修改editor中的各种属性，contentblock， text，entity

## RichUtils

框架提供一下富文本生成的api

## Decorators
装饰器
### CompositeDecorator 
```
const compositeDecorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HandleSpan,
  },
  {
    strategy: hashtagStrategy,
    component: HashtagSpan,
  },
]);

function handleStrategy(contentBlock, callback) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback);
}

function hashtagStrategy(contentBlock, callback) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

function findWithRegex(regex, contentBlock, callback) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
```
Decorators 通过editorstate保存，创建修改都需要通过[editorState api](https://facebook.github.io/draft-js/docs/api-reference-editor-state.html#content)


## api结构

EditorState 

    EditorState 包含所有和编辑器相关的state状态，可以获取contentState和selectState， DraftInlineStyle
-- getCurrentContent() ContentState

    编辑器内容显示的state结构
        getBlockMap(): BlockMap
            获取包含所有的ContentBlock的map结构，the full ordered map of ContentBlock objects
        static createFromText(
            text: string,
            delimiter?: string
        ): ContentState 
            使用text获取ContentState
        static createFromBlockArray(blocks: Array<ContentBlock>): ContentState
            从ContentBlock数组生成ContentState

-- getSelection(): SelectionState
    表示选区的state结构
    
-- getCurrentInlineStyle(): DraftInlineStyle

-- getBlockTree(blockKey: string): List
    获取包含所有contentBlock的树状结构

## editor component
### blockRendererFn

```
return {
    component: MediaComponent,
    editable: false,
    props: {
    foo: 'bar',
    },
};
```
### blockRenderMap
修改element的样式，draft-js默认的样式有[这些](https://facebook.github.io/draft-js/docs/advanced-topics-custom-block-render-map.html#content)
```
const blockRenderMap = Immutable.Map({
  'header-two': {
   element: 'h2'
  },
  'unstyled': {
    element: 'h2'
  }
});
```
```
const blockRenderMap = Immutable.Map({
  'MyCustomBlock': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'section',
    wrapper: <MyCustomBlock {...this.props} />
  }
});
```