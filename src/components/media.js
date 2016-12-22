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

import React from 'react';
import YoutbueBlock from './youtube-video-block';

const Audio = (props) => {
    return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
    return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
    return <video controls src={props.src} style={styles.media} />;
};

export default (props) => {
    const entity = Entity.get(
        props.block.getEntityAt(0)
    );
    const data = entity.getData();
    const src = data.src;
    const type = entity.getType();
    let media;
    if (type === 'audio') {
        media = <Audio src={src} />;
    } else if (type === 'image') {
        media = <Image src={src} />;
    } else if (type === 'video') {
        media = <Video src={src} />;
    } else if (type === 'youtube_video') {
        media = <YoutbueBlock {...data} />
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