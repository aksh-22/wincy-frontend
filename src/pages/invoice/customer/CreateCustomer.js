import { createCustomer } from "api/invoice";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";

function CreateCustomer({ handleClose }) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const query = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  const onValueChange = (event) => {
    const { name, value } = event?.target;
    setCustomerDetail({
      ...customerDetail,
      [name]: value,
    });

    error[name] !== "" &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onSubmit = () => {
    let tempError = { ...error };
    let isError = false;
    const { fullName, email } = customerDetail;
    if (!fullName?.trim()?.length) {
      isError = true;
      tempError = {
        ...tempError,
        fullName: "Full Name is required",
      };
    }

    if (!email.trim().length) {
      isError = true;
      tempError = {
        ...tempError,
        email: "Email is required",
      };
    }
    let emailReg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailReg.test(email) && email.trim().length) {
      isError = true;
      tempError = {
        ...tempError,
        email: "Please enter a valid email",
      };
    }
    if (isError) {
      setError(tempError);
      return null;
    }
    setIsLoading(true);
    createCustomer({
      orgId,
      data: customerDetail,
    })
      .then((res) => {
        try {
          let customerList = query.getQueryData(["customer", orgId]);
          customerList.unshift({
            ...res,
            ...customerDetail,
          });
          query.setQueryData(["customer", orgId], customerList);
        } catch (err) {}
        setIsLoading(false);
        handleClose && handleClose();
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <CustomInput
        placeholder="Full Name"
        value={customerDetail?.fullName}
        error={error?.fullName}
        name="fullName"
        onChange={onValueChange}
      />
      <CustomInput
        placeholder="Email"
        wrapperClassName={"my-2"}
        value={customerDetail?.email}
        error={error?.email}
        name="email"
        onChange={onValueChange}
      />
      <CustomInput
        placeholder="Address"
        type="textarea"
        value={customerDetail?.address}
        error={error?.address}
        name="address"
        onChange={onValueChange}
      />
      <div className="d_flex justifyContent_end flex mt-2">
        <CustomButton onClick={onSubmit} loading={isLoading}>
          <p>Save</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default CreateCustomer;
