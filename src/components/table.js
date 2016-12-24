import React, {Component} from 'react'

class table extends Component {
    render () {
        let lines = this.props.data.map((item) => {
            let columns = item.map((i) => {
                return (<td>{i}</td>)
            })
            return (<tr>{columns}</tr>);
        })
        return (
            <table>
                {lines}
            </table>
        )
    }
}

export default table