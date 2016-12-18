import React, {Component} from 'react'

class toolButton extends Component {
    constructor() {
        super();
        this.state = {
            top: 6,
            left: -28
        }
    }
    componentDidMount() {
        document.addEventListener('showButton', (e) => {
            this.setState({
                top: e.detail.top,
                left: e.detail.left
            });
        });
    }
    render() {
        return (
            <div className="button" style={ {top: this.state.top + 'px', left: this.state.left + 'px' } }>
            </div>
        );
    }
    static show(x, y) {
        document.dispatchEvent(new CustomEvent('showButton', {
            detail: {
                top: y,
                left: x
            }
        }));
    }
}

export default toolButton;