import React, {Component} from 'react';

const YoutbueBlock = (props) => {
    let id = props.id;
    if(props.urlValue) {
        let matchs = /www\.youtube\.com\/watch\?v=(.*)$/.exec(props.urlValue);
        id = matchs[1] || props.id;
    }
    return (
        <div>
            <iframe id={id} width={props.width} height={props.height} frameBorder="0" allowFullScreen="1" title="YouTube video player"
                src={`https://www.youtube.com/embed/${id}?enablejsapi=1&origin=${encodeURIComponent(window.location.href)}&widgetid=1`}></iframe>
        </div>
    );
}

export default YoutbueBlock;