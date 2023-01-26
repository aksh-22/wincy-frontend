import CustomButton from "components/CustomButton";
import CustomRow from "components/CustomRow";
import CustomSelect from "components/CustomSelect";
import TextInput from "components/textInput/TextInput";
import moment from "moment";
import React, { useState, useEffect, useCallback } from "react";
import { useCreateEvent } from "react-query/events/useCreateEvents";
import { useUpdateEvent } from "react-query/events/useUpdateEvent";
import { useSelector } from "react-redux";
import "../calTest.scss";

const category = [ "Holiday", "Event"];
const eventType = ["Public", "Private"];
function ModalContainer({ handleClose, date, data }) {
  const userType = useSelector(
    (state) => state.userReducer?.userType?.userType
  );
  const userEmail = useSelector(
    (state) => state?.userReducer?.userData?.user?.email
  );
  const { isLoading, mutate } = useCreateEvent();
  const { updateMutate, updateLoading } = useUpdateEvent();
  const [dateRange, setDateRange] = useState({
    from : moment(date).format("MM-DD-YYYY"),
    to:null
  })
  const [eventDetails, setEventDetails] = useState({
    title: "",
    category: "",
    description: "",
    type: "Private",
  });

  const [error, setError] = useState({
    title: "",
    category: "",
    description: "",
  });

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({
      ...eventDetails,
      [name]: value,
    });
    name === "category" && handleError(name, "");
    handleError(name, "");
  };
  const handleError = (name, value) => {
    setError({
      ...error,
      [name]: value ?? "",
    });
  };

  const onDateChange  = useCallback(
    (value , _ , key) => {
      setDateRange({
        ...dateRange,
        [key] : value
      })
    },
    [dateRange],
  )
  

  const onSubmit = () => {
    const { title, category, type } = eventDetails;
    let errorTemp = {};
    if (title.trim().length === 0) {
      errorTemp.title = "Title Field is required";
    }

    if (category.trim().length === 0 && type === "Public") {
      errorTemp.category = "Category Field is required";
    }
    // if (description.trim().length === 0) {
    //   errorTemp.description = "Description Field is required";
    // }
    if (Object.keys(errorTemp).length) {
      setError({
        ...error,
        ...errorTemp,
      });
    } else {
      if (data) {
        console.log("edit mutate");
        updateMutate({
          data : {
            ...eventDetails,
            isRange : dateRange?.to !== null,
            date: moment(date).format("MM-DD-YYYY"),
            dateFrom : dateRange?.from,
            dateTo : dateRange?.to
          },
          type: type === "Private" ? "private" : "public",
          handleClose: handleClose,
          eventId : data?._id
        });
      } else {
        mutate({
          data: {
            ...eventDetails,
            isRange : dateRange?.to !== null,
            date: moment(date).format("MM-DD-YYYY"),
            dateFrom : dateRange?.from,
            dateTo : dateRange?.to
          },
          type: type === "Private" ? "private" : "public",
          handleClose: handleClose,
        });
      }
    }
  };

  useEffect(() => {
    //  console.log(data)
    if (data) {
      setEventDetails({
        ...data,
      });
    }
  }, [data]);
  return (
    <div className="d_flex flexColumn ">
      <TextInput
        label="Event Title*"
        name="title"
        value={eventDetails.title}
        onChange={onHandleChange}
        className="pb-2"
        helperText={error?.title}
        error={error?.title ? true : false}
        autoFocus
      />

      {(["Admin" || "Member++"].includes(userType) || (userEmail === 'info@pairroxz.com')) && (
        <CustomSelect
          inputLabel="Event Type*"
          menuItems={eventType}
          labelClassName={"normalFont"}
          value={eventDetails?.type}
          name="type"
          handleChange={onHandleChange}
          containerClassName="mb-2"
        />
      )}

      {eventDetails.type === "Public" && (
        <CustomSelect
          inputLabel="Category*"
          menuItems={category}
          labelClassName={"normalFont"}
          value={eventDetails?.category}
          name="category"
          handleChange={onHandleChange}
          errorText={error.category}
          containerClassName="mb-2"
        />
      )}


<div style={{
  // justifyContent:"space-between",
  alignItems:"center",
  display:"flex"
}}>
  <div className="flex">
    <p className="dateLabel">From</p>
  <CustomRow 
  inputType={"date"}
  value={dateRange?.from}
  apiKey="from"
  onChange={onDateChange}
  containerClass={"flex mr-1  dateCalenderClass"}
  containerClassName={"pl-0"}
  fieldClassName="flex"
  />
  </div>

  <div className="flex">
    <p className="dateLabel">To </p>
  
<CustomRow 
  inputType={"date"}
  value={dateRange?.to}
  apiKey="to"
  onChange={onDateChange}
  containerClass={"flex dateCalenderClass"}
  containerClassName={"pl-0"}
  fieldClassName="flex"
  />
  </div>

</div>

      <TextInput
        label="Description*"
        multiline
        maxRows={4}
        value={eventDetails.description}
        name="description"
        onChange={onHandleChange}
        helperText={error?.description}
        error={error?.description ? true : false}
        className="mb-2"
      />



      <CustomButton
        className="mt-2"
        onClick={onSubmit}
        loading={data ? updateLoading : isLoading}
      >
       {data ? "Update Event" : "Create Event"} 
      </CustomButton>
    </div>
  );
}

export default ModalContainer;
