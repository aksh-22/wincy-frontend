import { addAccount } from "api/invoice";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import CustomSelect from "components/CustomSelect";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSubsidiaryList } from "react-query/invoice/subsidiary/useSubsidiaryList";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/textTruncate";

function AddAccount({ handleClose }) {
    const orgId = useSelector(
        (state) => state.userReducer?.selectedOrganisation?._id
      );
  const query = useQueryClient();

      const {data  } = useSubsidiaryList({orgId})
  const [detail, setDetail] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    swiftCode: null,
    micrCode: null,
    subCompanyId: "Select Sub Company",
  });
  const [error, setError] = useState({
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    subCompanyId: "",
  });
  const onValueChange = (event) => {
    const { value, name } = event?.target;
    setDetail({
      ...detail,
      [name]: value,
    });

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = () => {
    let isError = false;
    let tempError = { ...error };
    const { accountName, accountNumber, ifscCode, subCompanyId } = detail;
    if (!accountName?.trim()?.length) {
      isError = true;
      tempError={
        ...tempError,
        accountName: "Account name is required.",
      };
    }

    if(subCompanyId === "Select Sub Company"){
        isError = true;
        tempError={
          ...tempError,
          subCompanyId: "Sub company is required.",
        };
    }

    if (!accountNumber?.trim()?.length) {
      isError = true;
      tempError={
        ...tempError,
        accountNumber: "Account number is required.",
      };
    }

    if (!ifscCode?.trim()?.length) {
      isError = true;
      tempError={
        ...tempError,
        ifscCode: "IFSC Code is required.",
      };
    }

    if (isError) {
      return setError(tempError);
    }

    setIsLoading(true)
    addAccount({
      orgId,
      subsidiaryId:detail?.subCompanyId?._id,
      data: JSON.parse(JSON.stringify(detail, (k,v) => v || undefined))

    }).then((res) => {
      let customerList = query.getQueryData(["account", orgId , null]);
      customerList.unshift({
        ...res?.account,
      });
      query.setQueryData(["account", orgId , null], customerList);
      handleClose && handleClose()
    }).finally(() => setIsLoading(false))
  };

  return (
    <div>
      <CustomSelect
        placeholder={"Select Sub Company"}
        value={detail.subCompanyId}
        menuItems={data??[]}
        variant="outlined"
        containerClassName={"mb-2 selectOutlined"}
        errorText={error.subCompanyId}
        errorStyle={{
            marginLeft:0
        }}
        menuRenderComponent={<SelectRender />}
        selectRenderComponent={<SelectRender />}
name="subCompanyId"
        handleChange={onValueChange}
      />
      <CustomInput
        placeholder="Account Name"
        wrapperClassName={"mb-2"}
        onChange={onValueChange}
        name="accountName"
        value={detail?.accountName}
        error={error?.accountName}
      />
      <CustomInput
        placeholder="Account Number "
        wrapperClassName={"mb-2"}
        onChange={onValueChange}
        name="accountNumber"
        value={detail?.accountNumber}
        error={error?.accountNumber}
      />
      <CustomInput
        placeholder="IFSC Code"
        wrapperClassName={"mb-2"}
        onChange={onValueChange}
        name="ifscCode"
        value={detail?.ifscCode}
        error={error?.ifscCode}
      />
      <CustomInput
        placeholder="Swift Code"
        wrapperClassName={"mb-2"}
        onChange={onValueChange}
        name="swiftCode"
        value={detail?.swiftCode}
      />
      <CustomInput
        placeholder="MICR Code"
        wrapperClassName={"mb-2"}
        onChange={onValueChange}
        name="micrCode"
        value={detail?.micrCode}
      />

      <div className="d_flex justifyContent_end flex ">
        <CustomButton
        loading={isLoading}
        onClick={onSubmit}
        >
          <p>Save</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default AddAccount;


function SelectRender({ item, selected }) {
  return selected ? (
    <div className={`normalFont d_flex alignCenter textEllipse`}>
      <p className="textEllipse">
      {capitalizeFirstLetter(item?.title)}
      </p>
    </div> ):  (
    <div className={`normalFont d_flex alignCenter textEllipse`}>
      <p className="pl-1 textEllipse"> {capitalizeFirstLetter(item?.title)}</p>
    </div>
  );
}
