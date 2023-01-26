import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import IosIcon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useState } from "react";
import { dateCondition } from "utils/dateCondition";
import TransactionSidebar from "./TransactionSidebar";
import "./ViewInvoice.scss";

function TransactionRow({ item , orgId , index ,  refetch , type }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
    <div className={type ? "invoice_main_sub_header_item" : "invoice_transaction_row_item"} key={item?._id}>
      {
        type &&  <div className="emptyCell" />
      }
      <div className="d_flex">
        <div className={type  ? "invoice_item_row_sideLine" :"invoice_item_transaction_sideLine" }/>
        <InputTextClickAway
          value={dateCondition(item?.date, "DD MMM YYYY")}
          disabled
          className={"alignCenter"}
        />
      </div>
      <InputTextClickAway
        value={item?.gateway}
        disabled
        className={"alignCenter"}
        textClassName="textEllipse"
        paddingLeftNone
      />
      <InputTextClickAway
        value={item?.amount}
        disabled
        className={"alignCenter"}
        textClassName="textEllipse"
        paddingLeftNone
      />
      <InputTextClickAway
        value={item?.gatewayFees}
        disabled
        className={"alignCenter textEllipse"}
        textClassName="textEllipse"
        paddingLeftNone
      />
      <LightTooltip title="Info" arrow>
        <div
          className="alignCenter cursorPointer justifyContent_center"
          onClick={() => setIsOpen(true)}
        >
          <IosIcon name="info" />
        </div>
      </LightTooltip>
    </div>
    <CustomSideBar
    show={isOpen}
    toggle={() => setIsOpen(!isOpen)}
    >
      <TransactionSidebar item={item}
                orgId={orgId}
                refetch={refetch}
                index={index}
      
      />
    </CustomSideBar>
    </>
  );
}

export default TransactionRow;
