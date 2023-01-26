import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { addInvoiceTransaction } from "api/invoice";
import AttachmentContainer from "components/customAttachment/AttachmentContainer";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import CustomSelect from "components/CustomSelect";
import SelectRenderComponent from "components/SelectRenderComponent";
import classes from "pages/projects/bug/Bug.module.css";
import React, { memo, useState } from "react";
import { useQueryClient } from "react-query";
import { useGetSystemData } from "react-query/system/useGetSystemData";
import { useSelector } from "react-redux";
import "./ViewInvoice.scss";

const selectPlaceHolder = {
  gateway: "Gateway*",
  localCurrency: "Local Currency",
};
function AddTransaction({ handleClose , orgId , invoiceId , refetch }) {
  const { currency } = useSelector((state) => state.userReducer?.userData);
  const { data: gatewayList } = useGetSystemData("gateways");
  const [details, setDetails] = useState({
    gateway: selectPlaceHolder.gateway,
    gatewayTransactionId: "",
    amount: "",
    description: "",
    gatewayFees: "",
    localCurrency: selectPlaceHolder.localCurrency,
    localEquivalentAmount: "",
    date: "",
  });

  const [error, setError] = useState({
    gateway: "",
    gatewayTransactionId: "",
    amount: "",
    description: "",
    gatewayFees: "",
    localCurrency: "",
    localEquivalentAmount: "",
    date: "",
  });

  const onHandleChange = (event) => {
    const { value, name } = event?.target;
    setDetails({
      ...details,
      [name]: value,
    });

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onDateChange = (value, name) => {
    setDetails({
      ...details,
      [name]: value,
    });

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const [attachments, setAttachments] = useState([]);

  const onValidate = () => {
    const { amount, gatewayTransactionId, gateway, date  , localEquivalentAmount} = details;
    let isError = false;
    let tempError = error;
    if (gateway === selectPlaceHolder.gateway) {
      isError = true;
      tempError = {
        ...tempError,
        gateway: "Gateway field is required.",
      };
    }

    if (!gatewayTransactionId?.trim()?.length) {
      isError = true;
      tempError = {
        ...tempError,
        gatewayTransactionId: "Gateway transaction id field is required.",
      };
    }

    if (!date) {
      isError = true;
      tempError = {
        ...tempError,
        date: "Payment date field is required.",
      };
    }

    if ( !amount) {
      isError = true;
      tempError = {
        ...tempError,
        amount: "Amount field is required.",
      };
    }

    if(!(Number(amount) > 0) && amount){
      isError = true;
      tempError = {
        ...tempError,
        amount: "Amount must be greater than zero.",
      };
    }

    if ( !localEquivalentAmount) {
      isError = true;
      tempError = {
        ...tempError,
        localEquivalentAmount: "Local equivalent amount field is required.",
      };
    }

    if(!(Number(localEquivalentAmount) > 0) && localEquivalentAmount){
      isError = true;
      tempError = {
        ...tempError,
        localEquivalentAmount: "Local equivalent amount must be greater than zero.",
      };
    }



    setError(tempError);
    return isError;
  };

  const [isLoading, setIsLoading] = useState(false);
  const query = useQueryClient();

  const onSubmit = () => {
    if (!onValidate()) {
      let obj = JSON.parse(JSON.stringify(details, (k, v) => v || undefined));
      console.log("obj", obj);
      obj = {
        ...obj,
        gateway: obj?.gateway?.uniqueName,
      };
      let fd = new FormData();
      for (let key in obj) {
        fd.append(key, obj[key]);
      }

      if (attachments?.length) {
        attachments?.map((file) => fd.append("attachments", file, file?.name));
      }
      setIsLoading(true);
      addInvoiceTransaction({
        data:fd,
        invoiceId,
        orgId
      })
        .then((res) => {
          console.log("res ", res?.transaction);
          let transactionList = query.getQueryData(["transaction", orgId , invoiceId]);
          transactionList.unshift({
            ...res?.transaction,
          });
          query.setQueryData(["transaction", orgId , invoiceId], transactionList);
          let  viewInvoice = query.getQueryData(["invoiceView", orgId , invoiceId])
          console.log("viewInvoice" , viewInvoice , (Number(viewInvoice.paidAmount||0))+Number(res?.transaction?.amount||0));
          viewInvoice = {
            ...viewInvoice,
            paidAmount : (Number(viewInvoice.paidAmount||0))+Number(res?.transaction?.amount||0),
          }
          query.setQueryData(["invoiceView", orgId , invoiceId], viewInvoice);

          handleClose && handleClose()
          refetch && refetch()
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="addTransactionContainer">
      <CustomInput
        placeholder="Gateway Transaction Id*"
        wrapperClassName={"mb-2"}
        value={details?.gatewayTransactionId}
        error={error?.gatewayTransactionId}
        name="gatewayTransactionId"
        onChange={onHandleChange}
      />

      <CustomInput
        placeholder="Payment Date*"
        wrapperClassName={"mb-2"}
        type="date"
        value={details?.date}
        error={error?.date}
        name="date"
        onDateChange={(value) => onDateChange(value, "date")}
      />

      <CustomSelect
        menuItems={gatewayList ?? []}
        variant={"outlined"}
        placeholder={selectPlaceHolder.gateway}
        value={details?.gateway}
        errorText={error?.gateway}
        name="gateway"
        labelClassName={"normalFont"}
        containerClassName="selectOutlined mb-2"
        handleChange={onHandleChange}
        selectRenderComponent={
          <SelectRenderComponent objectKey={"displayName"} />
        }
        menuRenderComponent={
          <SelectRenderComponent objectKey={"displayName"} />
        }
        errorStyle={{ marginLeft: 0 }}
      />

      <CustomSelect
        placeholder={selectPlaceHolder.localCurrency}
        menuItems={currency ?? []}
        errorText={error?.localCurrency}
        value={details?.localCurrency}
        name="localCurrency"
        variant={"outlined"}
        handleChange={onHandleChange}
        labelClassName={"normalFont"}
        containerClassName="selectOutlined mb-2"
      />
      <CustomInput
        placeholder="Amount*"
        wrapperClassName={"mb-2"}
        type="number"
        value={details?.amount}
        error={error?.amount}
        name="amount"
        onChange={onHandleChange}
      />
        <CustomInput
        placeholder="Local Equivalent Amount*"
        wrapperClassName={"mb-2"}
        type="number"
        value={details?.localEquivalentAmount}
        error={error?.localEquivalentAmount}
        name="localEquivalentAmount"
        onChange={onHandleChange}
      />

      <CustomInput
        placeholder="Gateway Fee"
        wrapperClassName={"mb-2"}
        value={details?.gatewayFees}
        error={error?.gatewayFees}
        name="gatewayFees"
        type="number"
        onChange={onHandleChange}
      />
      <CustomInput
        placeholder="Description"
        wrapperClassName={"mb-2"}
        type="textarea"
        value={details?.description}
        error={error?.description}
        name="description"
        onChange={onHandleChange}
      />

      {(attachments?.length ?? 0) < 5 && (
        <label htmlFor="bug-attachment">
          <div className={classes.upload}>
            <CloudUploadOutlinedIcon />
            <p
              style={{
                KhtmlUserSelect: "none",
              }}
              className={classes.text}
            >
              {/* Drop files to attach, or */}
              <span style={{ color: "lightblue", marginLeft: 5 }}>Browse file</span>
            </p>
          </div>
        </label>
      )}

      <AttachmentContainer
        attachment={attachments}
        attachmentUpdate={(value) => {
          setAttachments(value);
        }}
        filesAllowed
        isLoading={false}
      />
      <div className="alignCenter justifyContent_end mt-2">
        <CustomButton className={"mr-2"} onClick={handleClose}>
          <p>Cancel</p>
        </CustomButton>

        <CustomButton onClick={onSubmit} loading={isLoading}>
          <p>Save</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default memo(AddTransaction);
