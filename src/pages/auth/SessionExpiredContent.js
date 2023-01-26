import React from 'react'
import error from 'assets/lottie/error404.json'
import NoData from 'components/NoData'
import CustomButton from 'components/CustomButton'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
function SessionExpiredContent() {
   const history = useHistory();
   const dispatch = useDispatch()
    const onClick = () => {
        dispatch({
            type : "Logout"
        })
        history.push('/login')
    }
    return (
        <div className="d_flex alignCenter justifyContent_center flexColumn">
            <NoData 
            textDisable
            lottieFile={error}
            height={150}
            width={150}
            speed={1.9}
            />
            <div className="my-1 ff_Lato_Bold"  style={{fontSize:  16}}>Your  Session has expired</div>
            <div className="mb-1 ff_Lato_Bold" style={{fontSize:  14}}>Click <span className="ff_Lato_Italic" style={{color : "var(--progressBarColor)"}}>OK</span> for go to login page.</div>
            <CustomButton
            onClick={onClick}
            className="mt-2"
            >
                OK
            </CustomButton>
        </div>
    )
}

export default SessionExpiredContent
