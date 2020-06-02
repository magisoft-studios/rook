import React, { Component } from 'react'
import cards from './Cards'

class MyButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false
        }
        this.disableTimerId = null;
    }

    componentWillUnmount() {
        clearTimeout(this.disableTimerId);
    }

    handleClick = (event) => {
        if (this.state.disabled) {
            return;
        }
        this.setState({disabled: true});
        this.disableTimerId = setTimeout( () => { this.setState({disabled: false}) }, 5000);
        this.props.onClick(this.props.onClickValue);
    }

    render() {
        return (
            <button
                className={this.props.btnClass}
                onClick={() => this.handleClick()}>
                <img
                    key={this.props.imgKey}
                    className={this.props.imgClass}
                    src={this.props.imgSrc}
                    alt={this.props.imgAlt}>
                </img>
                {this.props.btnText}
            </button>
        );
    }
}

export default MyButton;
