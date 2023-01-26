import ErrorIcon from "@mui/icons-material/Error";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import React, { useState } from "react";
import "./CreateInvoice.scss";

function SelectCustomerPopup({
  onClose,
  data,
  isLoading,
  onChange,
  selectedValue,
}) {
  const [search, setSearch] = useState(null);
  const handleSearch = (event) => {
    const { value } = event?.target;
    console.log("result", value);
    if (data?.length > 0) {
      if (!value?.trim()?.length) return setSearch(null);

      let result = data?.filter((_item) =>
        _item?.fullName?.toLowerCase().includes(value?.toLowerCase())
      );
      setSearch(result);
    }
  };
  return (
    <div className="SelectCustomerPopup_container">
      <CustomInput
        placeholder={"Search"}
        type="search"
        className={"m-2"}
        onChange={handleSearch}
      />
      <div className="customerList">
        {search ? (
          search?.length > 0 ? (
            search?.map((item, index) => (
              <p
                className="textEllipse customerName"
                onClick={() => {
                  onChange && onChange(item);
                  onClose && onClose();
                }}
              >
                {item?.fullName}
              </p>
            ))
          ) : (
            <div className="my-4">
              <div className="assigneeContainerRow alignCenter justifyContent_center">
                {" "}
                <ErrorIcon />{" "}
                <p style={{ paddingLeft: 5 }}>No Customer Found</p>
              </div>
            </div>
          )
        ) : (
          data.map((item, index) => (
            <p
              className="textEllipse customerName"
              style={{
                background:
                  selectedValue?._id === item?._id
                    ? "var(--progressBarColor)"
                    : "transparent",
              }}
              onClick={() => {
                onChange && onChange(item);

                onClose && onClose();
              }}
            >
              {item?.fullName}
            </p>
          ))
        )}
      </div>
      <div className="alignCenter justifyContent_end mb-2 mr-2">
        <CustomButton>
          <p>Done</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default SelectCustomerPopup;
