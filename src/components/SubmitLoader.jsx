import React from "react";
import { RotatingLines } from "react-loader-spinner";

const SubmitLoader = () => {
  return (
    <div>
      <RotatingLines
        visible={true}
        height="36"
        width="36"
        color="white"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default SubmitLoader;
