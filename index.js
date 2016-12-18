'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    AtomicBlockUtils,
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    Entity,
    Modifier,
    getDefaultKeyBinding, 
    KeyBindingUtil
} from 'draft-js';

import './css/button.css';
import 'draft-js/dist/Draft.css';

import ToolButton from './src/components/tool-button';

const { hasCommandModifier } = KeyBindingUtil;

class MediaEditorExample extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorState: EditorState.createEmpty(),
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
        const newState = RichUtils.handleKeyCommand(editorState, command);
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
        const entityKey = Entity.create(
            urlType,
            'IMMUTABLE',
            { src: urlValue }
        );
        if(urlType === 'youtube') {
            coonsole.log(urlValue);
        } else {
            // set editor state，insert atomic type content block contains entity
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
                </div>
                {urlInput}
                <div className="editor" style={styles.editor} onClick={this.focus}>
                    <ToolButton />
                    <Editor
                        blockRendererFn={mediaBlockRenderer}
                        editorState={this.state.editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.myKeyBindingFn.bind(this)}
                        onChange={this.onChange}
                        placeholder="Enter some text..."
                        ref="editor"
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

function mediaBlockRenderer(block) {
    if (block.getType() === 'atomic') {
        return {
            component: Media,
            editable: false,
        };
    }

    return null;
}

const Audio = (props) => {
    return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
    return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
    return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
    const entity = Entity.get(
        props.block.getEntityAt(0)
    );
    const {src} = entity.getData();
    const type = entity.getType();

    let media;
    if (type === 'audio') {
        media = <Audio src={src} />;
    } else if (type === 'image') {
        media = <Image src={src} />;
    } else if (type === 'video') {
        media = <Video src={src} />;
    }

    return media;
};

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