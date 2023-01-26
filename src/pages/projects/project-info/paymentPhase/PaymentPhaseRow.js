import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomButton from "components/CustomButton";
import CustomCircularProgressBar from "components/CustomCircularProgressBar";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import IosIcon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useState } from "react";
import { useUpdatePaymentPhase } from "react-query/invoice/paymentPhase/useUpdatePaymentPhase";
import PaymentPhaseSidebar from "./PaymentPhaseSidebar";

function PaymentPhaseRow({ item  , orgId , projectId , index}) {
  const [isOpen, setIsOpen] = useState(false);
  const {mutate} = useUpdatePaymentPhase()
  const onHandleChange = (key) => (value) => {
mutate({
orgId,
projectId,
paymentPhaseId : item?._id,
data:{
  [key] : value
},
index
})
  }
  return (
    <>
      <div className="paymentPhase_itemRow" key={item?._id}>
        <div className="d_flex textEllipse flex">
          <div className="paymentPhase_itemRow_sideLine" />
          <div className="alignCenter textEllipse flex">
            <InputTextClickAway
              value={item?.title}
              className="textEllipse"
              textClassName={"textEllipse"}
              onChange={onHandleChange("title")}
            />
          </div>
        </div>
        <div className="alignCenter justifyContent_center">
      {
        item?.milestones?.length > 0 ?     <div style={{ width: 20 }}>
        <CustomCircularProgressBar
          percentage={
            item?.progress
              ? (
                  ((item?.progress?.Completed ?? 0) /
                    ((item?.progress?.NotStarted ?? 0) +
                      (item?.progress?.Active ?? 0) +
                      (item?.progress?.Completed ?? 0))) *
                  100
                ).toFixed(0)
              : 0
          }
        />
      </div>
      :
      <div style={{ width: 20 }} />
      }
          <LightTooltip arrow title="Info">
            <div onClick={() => setIsOpen(true)}>
              <IosIcon name="info" className="mx-1 cursorPointer" />
            </div>
          </LightTooltip>
        </div>
        <InputTextClickAway
          value={item?.amount}
          className="alignCenter"
          textClassName={"textCenter flex"}
        />
        <InputTextClickAway
          value={item?.currency}
          className="alignCenter"
          textClassName={"textCenter flex"}
        />
        <div className="alignCenter justifyContent_center">
          <CustomButton>
            <p>{item?.status}</p>
          </CustomButton>
        </div>
      </div>

      <CustomSideBar show={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <PaymentPhaseSidebar item={item} handleClose={() => setIsOpen(false)}
        
        index={index}
        orgId={orgId}
        projectId={projectId}

        />
      </CustomSideBar>
    </>
  );
}

export default PaymentPhaseRow;
