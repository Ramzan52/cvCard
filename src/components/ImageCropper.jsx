import React, { useState } from "react";

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ image, uploadFile, email }) => {
  const [cropper, setCropper] = useState(false);

  const getCropData = async (e) => {
    e.preventDefault();
    if (typeof cropper !== "undefined") {
      await cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) uploadFile(blob, email);
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Cropper
        style={{ height: 400, width: "100%" }}
        zoomTo={0.5}
        initialAspectRatio={1}
        // preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={true}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        onInitialized={(instance) => {
          setCropper(instance);
        }}
        guides={true}
      />
      <div className="box" style={{ width: "50%", height: "300px" }}>
        <h1>
          <button
            className="btn btn-dark"
            style={{ float: "right" }}
            onClick={getCropData}
          >
            Crop Image
          </button>
        </h1>
      </div>
    </div>
  );
};

export default ImageCropper;
