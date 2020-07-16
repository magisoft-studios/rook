import React, { Component } from 'react';
import './css/Doc.scss';

class Doc extends Component {
    render() {
        return (
            <div className="docDiv">
                <a className={this.props.linkClass} href={this.props.linkHref} target="_blank">{this.props.linkText}</a>
            </div>
        )
    }
}

export default Doc;