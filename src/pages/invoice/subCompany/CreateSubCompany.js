import { createSubsidiaries } from "api/invoice";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

function CreateSubCompany({ handleClose }) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const queryClient = useQueryClient()
  const [detail, setDetail] = useState({
    title: null,
    address: null,
    gstNo: null,
    additionalInfo: null,
  });
  const [isLoading, setIsLoading] = useState(false)
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
  const [error, setError] = useState({
    title: "",
  });
  const onSubmit = () => {
    let { title } = detail;
    let isError = false;
    let tempError = { ...error };
    if (!title?.trim()?.length) {
      tempError = {
        ...tempError,
        title: "Company name is required.",
      };
      isError = true;
    }

    if (isError) {
      return setError(tempError);
    }

    setIsLoading(true)

    createSubsidiaries({
      orgId,
      data: detail,
    })
      .then((res) => {
        console.log("res", res);
        let temp  = queryClient.getQueryData(["subsidiary" , orgId])
        if(temp){
          temp.unshift(res)
          queryClient.setQueryData(["subsidiary" , orgId] , temp)
        }
        handleClose && handleClose()
      })
      .finally(() => {
    setIsLoading(true)

      })
  };
  return (
    <div>
      <CustomInput
        placeholder="Company Name"
        name="title"
        value={detail.title}
        onChange={onValueChange}
        error={error.title}
        wrapperClassName="mb-2"
      />
      <CustomInput
        placeholder="GST Number"
        name="gstNo"
        value={detail.gstNo}
        onChange={onValueChange}
        wrapperClassName="mb-2"
      />
      <CustomInput
        placeholder="Address"
        name="address"
        value={detail.address}
        onChange={onValueChange}
        type="textarea"
        wrapperClassName="mb-2"
        rows={3}
        cols={3}
      />
      <CustomInput
        placeholder="Addition Info"
        name="additionalInfo"
        value={detail.additionalInfo}
        onChange={onValueChange}
        type="textarea"
        rows={3}
        cols={3}
      />
      <div className="d_flex justifyContent_end flex mt-2">
        <CustomButton onClick={onSubmit} loading={isLoading}>
          <p>Save</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default CreateSubCompany;
