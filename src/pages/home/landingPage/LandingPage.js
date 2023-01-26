import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import './LandingPage.scss'
import { useHistory } from 'react-router';
import NoData from 'components/NoData';
import welcome from 'assets/lottie/welcome.json'
import { useSelector } from 'react-redux';
function LandingPage() {
    const history = useHistory();
    const { width, height } = useWindowSize()
    const user = useSelector((state) => state.userReducer?.userData?.user);
    return (
        <>
        <Confetti
        width={width}
        height={height}
      />
      <div style={{
    textAlign:"center",
    // marginTop:30,
    position:"absolute",
    width:"100%",
    // height:"100%",
   transform:"translate(50%, 0%)",
   left:"-50%"
}}>
  {/* <div className="checkmark-circle">
    <div className="background"></div>
    <div className="checkmark draw"></div>
  </div> */}
  <NoData
  lottieFile={welcome}
  textDisable
  style={{marginRight : 20}}
  />
 <div style={{
   marginTop : -30
 }}>
 <h1 className="my-1 ff_Lato_Regular">Welcome {user?.name}!</h1>
  <p className="mb-1 ff_Lato_Regular">You are all set.</p>
  <button onClick={() => history.push("/main/projects")} className="submit-btn my-1 ff_Lato_Regular" type="submit" >Continue</button>
 </div>
</div>  
      </>
    )
}

export default LandingPage
