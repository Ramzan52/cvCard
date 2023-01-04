import React from 'react';
import Lottie from 'react-lottie';
import spinner from '../assets/images/spinner';

const LoaderSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData:spinner,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  return (
    <>
      <div style={styles.overlay}></div>
      <div className='loader' >
        <Lottie
          options={defaultOptions}
          height={250}
          width={250}
        />
      </div>
    </>
  );
};

export default LoaderSpinner;

const styles = {

  overlay: {
    background: '#000',
    height: '100%',
    opacity: 0.6,
    position: 'fixed',
    width: '100%',
    zIndex: 100
  }
};
