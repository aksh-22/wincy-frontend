import React, { Component } from "react";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";

class SLR_Wrapper extends Component {
  render() {
    const { showDownloadButton } = this.props;
    const options = {
      settings: {
        autoplaySpeed: 1500,
        transitionSpeed: 900,
      },
      buttons: {
        iconColor: "#00c7d4",
        showDownloadButton: showDownloadButton ?? true,
      },
      caption: {
        showCaption: false,
      },
      thumbnails: {
        showThumbnails: this.props.showThumbnails??true,
        thumbnailsAlignment: "center",
        thumbnailsContainerBackgroundColor: "transparent",
        thumbnailsContainerPadding: "0",
        thumbnailsGap: "5px",
        thumbnailsIconColor: "#ffffff",
        thumbnailsOpacity: 0.4,
        thumbnailsPosition: "bottom",
        thumbnailsSize: ["100px", "80px"],
      },
    };
    return (
      <SimpleReactLightbox>
        <SRLWrapper options={options} elements={this.props.elements}>
          {this.props.children}
        </SRLWrapper>
      </SimpleReactLightbox>
    );
  }
}

export default SLR_Wrapper;
