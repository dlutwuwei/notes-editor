'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Draft, {
    AtomicBlockUtils,
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    Entity,
    Modifier,
    getDefaultKeyBinding, 
    KeyBindingUtil,
} from 'draft-js';

import Immutable from 'immutable';

import Media from './src/components/media';
import './css/button.css';
import 'draft-js/dist/Draft.css';
import Table from './src/components/table';
import tableStyles from './src/components/style.css';
const defaultTheme = {
  ...tableStyles,
};

import 'whatwg-fetch'
import nestedEditorCreator from './src/components/nested-editor';

import ToolButton from './src/components/tool-button';

import { content } from './src/data/content';

const { hasCommandModifier } = KeyBindingUtil;

const blockRenderMap = Immutable.Map({
  'block-table': {
   element: 'table'
  }
});

const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

class MediaEditorExample extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createWithContent(content),
            showURLInput: false,
            url: '',
            urlType: '',
        };

        this.focus = () => this.refs.editor.focus();
        this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
        };
        this.onChange = (editorState) => this.setState({ editorState });
        this.onURLChange = (e) => this.setState({ urlValue: e.target.value });

        this.addAudio = this._addAudio.bind(this);
        this.addImage = this._addImage.bind(this);
        this.addVideo = this._addVideo.bind(this);
        this.addYoutube = this._addYoutube.bind(this);

        this.confirmMedia = this._confirmMedia.bind(this);
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);

        this.contentState = this.state.editorState.getCurrentContent();
    }
    myKeyBindingFn(e) {
        if (e.keyCode === 83 /* `S` key */ && hasCommandModifier(e)) {
            return 'myeditor-save';
        }
        if(e.keyCode === 13 || e.keyCode === 8) {
            // TODO: toggle menu button
            let key = this.state.editorState.getSelection().getStartKey();
            let current_dom = document.querySelector(`[data-offset-key='${key}-0-0']`);
            console.log('current offset top: ', current_dom.offsetTop, current_dom.offsetHeight);
            let top = current_dom.offsetTop;
            ToolButton.show(-28, top + (e.keyCode === 8?-12:25));
        } else {
            console.log('otherkey', this.state.editorState.getSelection().getStartKey());
        }

        return getDefaultKeyBinding(e);
    }
    _handleKeyCommand(command) {
        const {editorState} = this.state;
        console.log(command)
        const newState = TableUtils.hanldeKeyCommand(editorState, command)
            || Draft.RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _confirmMedia(e) {
        e.preventDefault();
        const {editorState, urlValue, urlType} = this.state;
        // create entity
        let entityKey = Entity.create(
            urlType,
            'IMMUTABLE',
            { src: urlValue }
        );
        // set editor state，insert atomic type content block contains entity
        this.setState({
            editorState: AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                ' '
            ),
            showURLInput: false,
            urlValue: '',
        }, () => {
            setTimeout(() => this.focus(), 0);
        });
        if(urlType === 'youtube') {
            Entity.mergeData(entityKey, {
                urlValue
            });
        }
    }

    _onURLInputKeyDown(e) {
        if (e.which === 13) {
            this._confirmMedia(e);
        }
    }

    _promptForMedia(type) {
        const {editorState} = this.state;
        this.setState({
            showURLInput: true,
            urlValue: '',
            urlType: type,
        }, () => {
            setTimeout(() => this.refs.url.focus(), 0);
        });
    }

    _addAudio() {
        this._promptForMedia('audio');
    }

    _addImage() {
        this._promptForMedia('image');
    }

    _addVideo() {
        this._promptForMedia('video');
    }
    _addYoutube() {
        this._promptForMedia('youtube');
    }
    insertTable() {

    }
    render() {
        let urlInput;
        if (this.state.showURLInput) {
            urlInput =
                <div style={styles.urlInputContainer}>
                    <input
                        onChange={this.onURLChange}
                        ref="url"
                        style={styles.urlInput}
                        type="text"
                        value={this.state.urlValue}
                        onKeyDown={this.onURLInputKeyDown}
                        />
                    <button onMouseDown={this.confirmMedia}>
                        Confirm
                </button>
                </div>;
        }
        return (
            <div style={styles.root}>
                <div style={{ marginBottom: 10 }}>
                    Use the buttons to add audio, image, or video.
                </div>
                <div style={{ marginBottom: 10 }}>
                    Here are some local examples that can be entered as a URL:
                <ul>
                        <li>media.mp3</li>
                        <li>media.png</li>
                        <li>media.mp4</li>
                    </ul>
                </div>
                <div style={styles.buttons}>
                    <button onMouseDown={this.addAudio} style={{ marginRight: 10 }}>
                        Add Audio
                </button>
                    <button onMouseDown={this.addImage} style={{ marginRight: 10 }}>
                        Add Image
                </button>
                    <button onMouseDown={this.addVideo} style={{ marginRight: 10 }}>
                        Add Video
                </button>
                    <button onMouseDown={this.addYoutube} style={{ marginRight: 10 }}>
                        Add Youtube
                </button>
                    <button onMouseDown={this.insertTable.bind(this)} style={{ marginRight: 10 }}>
                        Add Table
                </button>
                </div>
                {urlInput}
                <div className="editor" style={styles.editor} onClick={this.focus}>
                    <ToolButton />
                    <Editor
                        blockRendererFn={mediaBlockRenderer} // block render hook
                        editorState={this.state.editorState} // editor state import
                        handleKeyCommand={this.handleKeyCommand} // key command hook
                        keyBindingFn={this.myKeyBindingFn.bind(this)} // key action bind hook
                        onChange={this.onChange} // state change hook
                        placeholder="Enter some text..."
                        ref="editor"
                        blockRenderMap={extendedBlockRenderMap}
                        />
                </div>
                <input
                    onClick={this.logState}
                    style={styles.button}
                    type="button"
                    value="Log State"
                    />
            </div>
        );
    }
}

const createRenderer = (Editor) => {
  const NestedEditor = nestedEditorCreator(Editor);
  return ({ block, editorState, onChange, setFocus, active }) => {
    return (
      <NestedEditor setFocus={setFocus} setReadOnly={} readOnly={!active} editorState={editorState} onChange={onChange} />
    );
  };
};


function mediaBlockRenderer(block) {
    let type = block.getType();
    if ( type === 'atomic') {
        return {
            component: Media,
            editable: false,
        };
    } else if( type === 'block-table') {
        const renderNestedEditor = createRenderer(Editor);
        return {
            component: Table,
            props: {
                theme: defaultTheme,
                renderNestedEditor
            }
        }
    }

    return null;
}

const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        padding: 20,
        width: 600,
    },
    buttons: {
        marginBottom: 10,
    },
    urlInputContainer: {
        marginBottom: 10,
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3,
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    media: {
        width: '100%',
    },
};

ReactDOM.render(
    <MediaEditorExample />,
    document.getElementById('target')
);