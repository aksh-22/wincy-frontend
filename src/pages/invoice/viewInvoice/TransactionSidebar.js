import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import CloseButton from "components/CloseButton";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import CustomRow from "components/CustomRow";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import classes from "pages/projects/bug/Bug.module.css";
import React from "react";
import { useUpdateTransaction } from "react-query/invoice/transaction/useUpdateTransaction";
import { useSelector } from "react-redux";

function TransactionSidebar({ toggle, refetch, item, orgId, index }) {
  const editorRef = React.useRef("");
  const { currency } = useSelector((state) => state.userReducer?.userData);
  const { mutate, isLoading } = useUpdateTransaction();
  const onUpdateAttachment = (value, removeAttachment) => {
    let fd = new FormData();
    value?.map(
      (file) => file?.name && fd.append("attachments", file, file?.name)
    );
    removeAttachment?.length > 0 &&
      fd.append("removeAttachments", JSON.stringify(removeAttachment));
    mutate({
      transactionId: item?._id,
      data: fd,
      orgId: orgId,
      index,
      invoiceId: item?.invoice,
    });
  };
  const onUpdateTransaction = (value, _, key) => {
    let fd = new FormData();

    fd.append(key, value);

    mutate({
      transactionId: item?._id,
      data: fd,
      orgId: orgId,
      index,
      invoiceId: item?.invoice,
      extraData: {
        [key]: value,
      },
      refetch,
    });
  };
  return (
    <div>
      <div className="alignCenter mb-2">
        <div className="flex" />

        <CloseButton />
      </div>
      <CustomRow
        value={item?.gatewayTransactionId}
        field="Gateway Transaction Id"
        onChange={onUpdateTransaction}
        apiKey={"gatewayTransactionId"}
        inputType="text"
      />
      <CustomRow
        value={item?.gateway}
        field="Gateway"
        onChange={onUpdateTransaction}
        apiKey={"gateway"}
        inputType="text"
      />

      <CustomRow
        value={item?.amount}
        field="Amount"
        onChange={onUpdateTransaction}
        apiKey={"amount"}
        inputType="number"
      />

      <CustomRow
        value={item?.gatewayFees}
        field="Gateway Fees"
        onChange={onUpdateTransaction}
        apiKey={"gatewayFees"}
        inputType="number"
      />

      {/* <CustomRow value={item?.currency} field="Currency"
      
      
      onChange={onUpdateTransaction}
      apiKey={"currency"}
      inputType="select"
      menuItems={currency}
      
      /> */}
      <CustomRow
        value={item?.localCurrency}
        field="Local Currency"
        apiKey={"localCurrency"}
        inputType="select"
        menuItems={currency}
      />
            <CustomRow
        value={item?.localEquivalentAmount}
        field="Local Equivalent Amount"
        apiKey={"localEquivalentAmount"}
        inputType="number"
      />
      <CustomRow
        value={item?.date}
        inputType="date"
        field="Transaction date"
        onChange={onUpdateTransaction}
        apiKey={"date"}
      />

      <div className="my-2">
        <CustomTextEditor
          value={item?.description}
          ref={editorRef}
          updateData={(value) => onUpdateTransaction(value, "", "description")}
        />
      </div>

      {(item?.attachments?.length ?? 0) < 5 && (
        <label htmlFor="bug-attachment">
          <div className={classes.upload}>
            <CloudUploadOutlinedIcon />
            <p
              style={{
                KhtmlUserSelect: "none",
              }}
              className={classes.text}
            >
              <span style={{ color: "lightblue", marginLeft: 5 }}>
                Browse file
              </span>
            </p>
          </div>
        </label>
      )}
      <AttachmentContainer
        attachment={item?.attachments}
        attachmentUpdate={onUpdateAttachment}
        filesAllowed
        isLoading={isLoading}
      />
    </div>
  );
}

export default TransactionSidebar;
