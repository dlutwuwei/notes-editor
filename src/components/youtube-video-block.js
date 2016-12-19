import React, {Component} from 'react';

class YoutbueBlock extends Component {
    constructor() {
        
    }
    render() {
        return (
            <div>
                <iframe src={this.props.url}></iframe>
            </div>
        );
    }
}

export default YoutbueBlock;