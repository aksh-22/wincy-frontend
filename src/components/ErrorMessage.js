import React from 'react';
import Shake from 'react-reveal/Shake';
function ErrorMessage({ children }) {
  return (
    <div className="errorFont" style={{marginBottom:5}}>
      <Shake duration={600} count={1}>
        {children}
      </Shake>
    </div>
  );
}
export default ErrorMessage;
