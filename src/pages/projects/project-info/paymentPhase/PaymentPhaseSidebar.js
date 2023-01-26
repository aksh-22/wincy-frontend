import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CloseButton from "components/CloseButton";
import CustomRow from "components/CustomRow";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import React from "react";
import { useDeletePaymentPhase } from "react-query/invoice/paymentPhase/useDeletePaymentPhase";
import { useUpdatePaymentPhase } from "react-query/invoice/paymentPhase/useUpdatePaymentPhase";
import { useSelector } from "react-redux";
import { dateCondition } from "utils/dateCondition";
import { capitalizeFirstLetter } from "utils/textTruncate";

function PaymentPhaseSidebar({ item, handleClose, orgId, projectId, index }) {
  const { currency } = useSelector((state) => state.userReducer?.userData);
  const { mutate: deleteMutate, isLoading } = useDeletePaymentPhase();
  const { mutate } = useUpdatePaymentPhase();
  const editorRef = React.useRef("");

  const onHandleChange = (key) => (value) => {
    mutate({
      orgId,
      projectId,
      paymentPhaseId: item?._id,
      data: {
        [key]: value,
      },
      index,
    });
  };

  return (
    <div>
      <div className="d_flex">
        <div className="alignCenter flex">
          <InputTextClickAway
            className="flex"
            value={item?.title}
            textStyle={{
              fontFamily: "Lato-Bold",
              fontSize: 18,
            }}
            onChange={onHandleChange("title")}
          />
        </div>
        <CloseButton
          normalClose
          onClick={handleClose}
          mutate={deleteMutate}
          data={{
            data: {
              paymentPhaseIds: [item?._id],
            },
            orgId: item?.organisation,
            projectId: item?.project,
            paymentPhaseId: item?._id,
          }}
          isLoading={isLoading}
        />
      </div>

      <div className="my-2">
        <CustomTextEditor
          value={item?.description}
          ref={editorRef}
          updateData={onHandleChange("description")}
        />
      </div>
      <CustomRow value={item?.currency} field="Currency" 
      menuItems={currency??[]}
      inputType="select"
      onChange={onHandleChange("currency")}
      />

      <CustomRow value={item?.status} field="Status" />
      {item?.milestones?.length > 0 &&
        item?.milestones?.map((item, index) => (
          <CustomRow
            key={item?._id}
            field={`Milestone ${index + 1}`}
            value={capitalizeFirstLetter(item?.title)}
          />
        ))}
      <CustomRow
        value={dateCondition(item?.createdAt, "DD MMM YYYY")}
        field="Created At"
      />
    </div>
  );
}

export default PaymentPhaseSidebar;
