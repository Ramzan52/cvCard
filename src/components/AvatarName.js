import React from "react";

export default function AvatarName(props) {
  return (
    <>
      {!props.displayPicture?.includes("https") ? (
        <p className="rounded-circle">{`${props.displayName.split(" ")[0]?.charAt(0).toUpperCase()}
        
        ${
          props.displayName.split(" ")[1] !== undefined ? props.displayName?.split(" ")[1]?.charAt(0).toUpperCase() : ""
        }`}</p>
      ) : (
        <img className="rounded-circle" src={props.displayPicture} alt="" />
      )}
    </>
  );
}
