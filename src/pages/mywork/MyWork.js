import CustomButton from "components/CustomButton";
import MyworkBugs from "pages/mywork/bugs/MyworkBugs";
import React, { useState } from "react";

import MyTask from "pages/mywork/MyTask";
import Task from "pages/mywork/MyTask";
import "./scss/MyWork.scss";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import Image from "components/defaultImage/Image";
import comingSoon from 'assets/images/comingSoon.jpg'
function MyWork() {
  const [myWorkNavBtn, setMyWorkNavBtn] = useState({
    bugs: true,
    task: false,
  });

  return (
    <div className="mywork alignCenter justifyContent_center"  style={{height:"80vh"}}>
      {/* <br /> */}
      {/* <BtnWrapper>
        <CustomButton
          type={myWorkNavBtn.bugs ? "contained" : "text"}
          
          onClick={() => setMyWorkNavBtn({ bugs: true })}
        >
          Bugs
        </CustomButton>

        <CustomButton
          type={myWorkNavBtn.task ? "contained" : "text"}
          
          onClick={() => setMyWorkNavBtn({ task: true })}
        >
          Task
        </CustomButton>
      </BtnWrapper>

      {myWorkNavBtn.bugs ? <MyworkBugs /> : <MyTask />} */}
     {/* <img     src={comingSoon} alt="noImage" /> */}
     <p>
       Feature Coming Soon
     </p>
    </div>
  );
}

export default MyWork;
