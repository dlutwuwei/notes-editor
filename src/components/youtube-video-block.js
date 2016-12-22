import React, {Component} from 'react';

const YoutbueBlock = (props) => {
    
    return (
        <div>
            <iframe id={props.videoId} width={props.videoWidth} height={props.videoHeight} frameBorder="0" allowFullScreen="1" title="YouTube video player"
                src={`https://www.youtube.com/embed/${props.videoId}?enablejsapi=1&origin=${encodeURIComponent(window.location.href)}&widgetid=1`}></iframe>
        </div>
    );
}

export default YoutbueBlock;