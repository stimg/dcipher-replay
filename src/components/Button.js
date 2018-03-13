import React from 'react';

export default class Button extends React.Component {

    constructor (props) {
        super(props);
        this.handleClick = this.props.action.bind(this, props.params);
        this.label = props.label;
    }

    render() {
        return (
            <button className="btn" onClick={this.handleClick}>
                {this.label}
            </button>
        );
    }
}