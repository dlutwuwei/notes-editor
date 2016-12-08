import React, {Component} from 'react'

class toolButtom extends Component {
    constructor() {
        this.state = {
            top: 0,
            left: 0
        }
    }
    render() {
        return (
            <div style={ {top: this.state.top + 'px', left: this.state.left + 'px' } }>
                buttom
            </div>
        );
    }
}

export default toolButtom;