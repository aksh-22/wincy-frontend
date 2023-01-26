import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export default class ColoredScrollbars extends Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.renderView = this.renderView.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
  }

  handleUpdate(values) {}

  renderView({ style, ...props }) {
    return <div className="box" style={{ ...style }} {...props} />;
  }

  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: "var(--primary)",
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  }

  render() {
    return (
      <Scrollbars
        renderView={this.renderView}
        renderThumbHorizontal={this.renderThumb}
        renderThumbVertical={this.renderThumb}
        onUpdate={this.handleUpdate}
        {...this.props}
      />
    );
  }
}
