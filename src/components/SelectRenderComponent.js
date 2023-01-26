import React from 'react'
import { capitalizeFirstLetter } from 'utils/textTruncate';

function SelectRenderComponent({ item, selected , objectKey , placeholder }) {
    return selected ? (
      <div className={`normalFont d_flex alignCenter textEllipse`}
      // style={{color:}}
      >
        <p className="textEllipse">{capitalizeFirstLetter(objectKey? item?.[objectKey]:item?.title)}</p>
      </div>
    ) : (
      <div className={`normalFont d_flex alignCenter textEllipse`}>
        <p className="pl-1 textEllipse"> {capitalizeFirstLetter(objectKey? item?.[objectKey]:item?.title)}</p>
      </div>
    );
  }



  
  export default SelectRenderComponent