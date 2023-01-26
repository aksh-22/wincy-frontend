import React, { useEffect, useState } from "react";
import "./AddLead.scss";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useSelector } from "react-redux";
import CustomSelect from "components/CustomSelect";
import { countries } from "utils/countries";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import CustomButton from "components/CustomButton";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { capitalizeFirstLetter } from "utils/textTruncate";
import moment from "moment";
import { useAddLead } from "react-query/lead/useAddLead";
import { successToast } from "utils/toast";
import AddLeadTextInput from "./AddLeadTextInput";
import { useQueryClient } from "react-query";
import CustomAvatar from "components/CustomAvatar";
import css from "css/BugModal.module.css";

// import { currency } from "utils/currency";
let initialState = {
  name: "",
  email: "",
  country: "",
  contactNumber: "",
  reference: "Reference*",
  platforms: ["Platforms"],
  description: "",
  budgetExpectation: "",
  currency: "Currency",
  // durationExpectation: "",
  dateContactedFirst: new Date(),
  domain: "",
  managedByData:"Managed By",
};

let initialStateError = {
  name: "",
  domain: "",
  email: "",
  country: "",
  contactNumber: "",
  reference: "",
  platforms: "",
  description: "",
  budgetExpectation: "",
  budgetProposed: "",
  currency: "",
  durationExpectation: "",
  durationProposed: "",
  dateContactedFirst: "",
  status: "",
  nextFollowUp: "",
};


export const contactUs = [
  "Google",
  "Clutch.co",
  "Online Catalog",
  "Social Media",
 "Tech Event",
  "Friend",
  "Upwork"
]

function AddLead({ handleClose }) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const {platforms , currency} = useSelector(
    (state) => state.userReducer?.userData
  );


  
  const queryClient = useQueryClient();
  const orgTeam = queryClient?.getQueryData(["organisationUsers", orgId]);
  const [teamMembers, setTeamMembers] = useState([])
  useEffect(() => {
    
    let team = orgTeam?.users?.filter((item) => item?.userType?.find((row) => ["Admin" , "Member++"].includes(row?.userType) && row?.organisation === orgId))
    setTeamMembers(team)
  }, [orgTeam])

  const [leadDetails, setLeadDetails] = useState(initialState);
  const [error, setError] = useState(initialStateError);

  const onHandleChange = (event) => {
    const { value, name } = event?.target;
    if(name === "managedByData"){
      setLeadDetails({
        ...leadDetails,
        managedBy: value?._id,
        managedByData : value
      });
    }else{
      setLeadDetails({
        ...leadDetails,
        [name]: value,
      });
    }
    

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onHandleSelect = (event) => {
    const { name, value } = event?.target;
    console.log("value", value, name);
    if (name === "platforms") {
      if (value[0] === "Platforms") {
        setLeadDetails({
          ...leadDetails,
          [name]: value.splice(1, 1),
        });
      } else if (!value?.length) {
        setLeadDetails({
          ...leadDetails,
          [name]: ["Platforms"],
        });
      } else {
        setLeadDetails({
          ...leadDetails,
          [name]: value,
        });
      }
    }

    !error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onHandleDateChange = (value, name) => {
    setLeadDetails({
      ...leadDetails,
      [name]: value,
    });
    error[name] !== "" &&
      setError({
        ...error,
        [name]: "",
      });
  };
  const onHandleSubmit = () => {
    let tempError = {};
    let isError = false;
    for (const item in leadDetails) {
      if (
        item !== "platforms" &&
        item !== "currency" &&
        item !== "status" && item !== "domain" &&
        item !== "contactNumber" && item !== "budgetExpectation" && item !== "reference" && item !=="email" && item !== "country"
      ) {
        if (typeof leadDetails[item] === "string") {
          if (!leadDetails[item]?.trim()?.length) {
            console.log(item , leadDetails[item])
            isError = true;
            tempError = {
              ...tempError,
              [item]: `${capitalizeFirstLetter(
                addSpaceUpperCase(item)
              )} field is required`,
            };
          }
        }
      } else if (item === "reference") {
        if(leadDetails[item] === "Reference*"){
          console.log("Reference" , item , leadDetails[item])
          isError = true;
          tempError = {
            ...tempError,
            [item]: `${capitalizeFirstLetter(
              addSpaceUpperCase(item)
            )} field is required`,
          };
        }
      } else if (item === "currency") {
      } else if (item === "status") {
      }
    }
    if (isError) {
      setError(tempError);
    } else {

      let temp_data = {}
      for (const [key, value] of Object.entries(leadDetails)) {
        if(value !== ""){
          temp_data[key] = value
        }
      }
      console.log('temp_data' , temp_data);

      const data = {
        id: orgId,
        data: {
          ...temp_data,
          durationExpectation: Number(leadDetails?.durationExpectation),
          durationProposed: Number(leadDetails?.durationProposed),
        },
        onSuccess : onSuccess
      };
      mutate(data);
    }
  };

  const onSuccess =  () => {
    successToast("Lead successfully created");
    handleClose();
  }
  const { mutate, isLoading } = useAddLead("Active");
  return (
    <div>
      <div className="addleadHeader">
        <h3>Add Lead</h3>
        <CloseRoundedIcon onClick={handleClose} className="cursorPointer" />
      </div>
      <div className="addleadContent">
        <form>
          <AddLeadTextInput
            placeholder="Client's Name*"
            value={leadDetails?.name}
            error={error?.name}
            name="name"
            onChange={onHandleChange}
          />
          <AddLeadTextInput
            type="text"
            placeholder="Domain"
            value={leadDetails?.domain}
            error={error?.domain}
            name="domain"
            onChange={onHandleChange}
          />
          <AddLeadTextInput
            placeholder="Email Address"
            value={leadDetails?.email}
            error={error?.email}
            name="email"
            onChange={onHandleChange}
            type="email"
          />
          <AddLeadTextInput
            placeholder="Contact Number"
            value={leadDetails?.contactNumber}
            error={error?.contactNumber}
            name="contactNumber"
            onChange={onHandleChange}
            type={"number"}
          />
          {/* <AddLeadTextInput
            placeholder="Reference*"
            value={leadDetails?.reference}
            error={error?.reference}
            name="reference"
            onChange={onHandleChange}
          /> */}

<div className="inlineInput" style={{ marginBottom: 15 }}>
          <CustomSelect
                // inputLabel="Platforms"
                handleChange={onHandleChange}
                errorText={error?.managedByData ?? ""}
                value={leadDetails?.managedByData}
                menuItems={teamMembers??[]}
                variant={"outlined"}
                labelClassName={"normalFont"}
                containerClassName="inputRight "
                placeholder="Managed By"
                style={{
                  paddingRight: 15,
                }}
                name="managedByData"
                menuRenderComponent={<SelectRender />}
          selectRenderComponent={<SelectRender />}
              />
              </div>

          <div className="inlineInput" style={{ marginBottom: 15 }}>
          <CustomSelect
                // inputLabel="Platforms"
                handleChange={onHandleChange}
                errorText={error?.reference ?? ""}
                value={leadDetails?.reference}
                menuItems={contactUs}
                variant={"outlined"}
                labelClassName={"normalFont"}
                containerClassName="inputRight "
                placeholder="Reference*"
                style={{
                  paddingRight: 15,
                }}
                name="reference"
              />
              </div>
          <div
            className="inlineInput"
            style={{
              // marginBottom: error?.country || error?.platforms ? 0 : 15,
            }}
          >
            <div className="inputLeft">
              <Autocomplete
                id="country-select-demo"
                classes={{
                  popper: "autoCompletePopper_addLead",
                }}
                onChange={(e, value) =>
                  onHandleDateChange(
                    value?.label === null ? "" : value?.label,
                    "country"
                  )
                }
                options={countries}
                autoHighlight
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{
                      margin: 0,
                    }}
                    className="addLeadAutoComplete inputBox_addLead justifyContent_center"
                    variant="outlined"
                    placeholder="Choose a country"
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        margin: 0,
                        padding: 0,
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                        color: "#FFF",
                      },
                      autoComplete: "new-password", // disable autocomplete and autofill
                      classes: "{notchedOutline:'classes.noBorder'}",
                    }}
                  />
                )}
              />
              {error?.country && (
                <div
                  className="alignCenter"
                  style={{
                    color: "var(--red)",
                    fontSize: 12,
                    marginBottom: 15,
                    marginLeft: 15,
                    marginTop: 5,
                  }}
                >
                  <ErrorRoundedIcon
                    style={{
                      color: "var(--red)",
                      fontSize: 16,
                      marginRight: 5,
                    }}
                  />
                  {error?.country}
                </div>
              )}
            </div>

            <AddLeadTextInput
                placeholder="Budget Expectation"
                value={leadDetails?.budgetExpectation}
                error={error?.budgetExpectation}
                name="budgetExpectation"
                onChange={onHandleChange}
                type="number"
              />
{/* 
            <CustomSelect
              // inputLabel="Platforms"
              handleChange={onHandleSelect}
              name={"platforms"}
              errorText={error?.platforms ?? ""}
              value={leadDetails?.platforms}
              menuItems={platforms}
              multiple
              variant={"outlined"}
              labelClassName={"normalFont"}
              containerClassName="inputRight "
              placeholder={"Platforms"}
              max={3}
            /> */}
          </div>

          
          <div className="inlineInput" style={{ marginBottom: 15 }}>
            
            <CustomSelect
              // inputLabel="Platforms"
              handleChange={onHandleSelect}
              name={"platforms"}
              errorText={error?.platforms ?? ""}
              value={leadDetails?.platforms}
              menuItems={platforms}
              multiple
              variant={"outlined"}
              labelClassName={"normalFont"}
              containerClassName="inputRight"
              placeholder={"Platforms"}
              max={5}
            />
            {/* <div className="inputLeft">
              <AddLeadTextInput
                placeholder="Budget Expectation"
                value={leadDetails?.budgetExpectation}
                error={error?.budgetExpectation}
                name="budgetExpectation"
                onChange={onHandleChange}
                type="number"
              />
            </div>
            <div className="inputRight">
              <AddLeadTextInput
                placeholder="Budget Proposed*"
                value={leadDetails?.budgetProposed}
                error={error?.budgetProposed}
                name="budgetProposed"
                onChange={onHandleChange}
                type="number"
              />
                 <AddLeadTextInput
                placeholder="Duration Expectation*"
                value={leadDetails?.durationExpectation}
                error={error?.durationExpectation}
                name="durationExpectation"
                onChange={onHandleChange}
                type={"number"}
              />
            </div> */}
          </div>
          <div className="inlineInput" style={{ marginBottom: 15 }}>
          <CustomSelect
                // inputLabel="Platforms"
                handleChange={onHandleChange}
                errorText={error?.currency ?? ""}
                value={leadDetails?.currency}
                menuItems={currency}
                variant={"outlined"}
                labelClassName={"normalFont"}
                containerClassName="inputRight "
                placeholder={"Currency"}
                style={{
                  paddingRight: 15,
                }}
                name="currency"
              />
            {/* <div className="inputLeft">
        
            </div> */}
            {/* <CustomSelect
                            handleChange={onHandleChange}
              errorText={error?.status ?? ""}
              value={leadDetails?.status}
              menuItems={status}
                            variant={"outlined"}
              labelClassName={"normalFont"}
              containerClassName="inputRight "
              placeholder={"Status"}
              name="status"
            /> */}
          </div>
          <div className="inlineInput">
            <div className="inputLeft">
              {/* <AddLeadTextInput
                placeholder="Duration Expectation*"
                value={leadDetails?.durationExpectation}
                error={error?.durationExpectation}
                name="durationExpectation"
                onChange={onHandleChange}
                type={"number"}
              /> */}
            </div>

            <div className="inputRight">
              {/* <AddLeadTextInput
                placeholder="Duration Proposed*"
                value={leadDetails?.durationProposed}
                error={error?.durationProposed}
                name="durationProposed"
                onChange={onHandleChange}
                type={"number"}
              /> */}
            </div>
          </div>
          <div className="inlineInput">
            <CustomDatePicker
              onChange={(e) => onHandleDateChange(e, "dateContactedFirst")}
            >
              {/* <div className="inputLeft"> */}
                <div
                  className="dateBorder"
                  style={{
                    marginBottom: error?.dateContactedFirst ? 0 : 15,
                  }}
                >
                  {leadDetails?.dateContactedFirst ? (
                    moment(
                      leadDetails?.dateContactedFirst,
                      "MM-DD-YYYY"
                    ).format("DD-MM-YYYY")
                  ) : (
                    <p style={{ color: "#9ca1c7" }}> Date Contacted*</p>
                  )}
                </div>

                {error?.dateContactedFirst && (
                  <div
                    className="alignCenter"
                    style={{
                      color: "var(--red)",
                      fontSize: 12,
                      marginBottom: 15,
                      marginLeft: 15,
                      marginTop: 5,
                    }}
                  >
                    <ErrorRoundedIcon
                      style={{
                        color: "var(--red)",
                        fontSize: 16,
                        marginRight: 5,
                      }}
                    />
                    {error?.dateContactedFirst}
                  </div>
                )}
              {/* </div> */}
            </CustomDatePicker>

            {/* <CustomDatePicker
               onChange={(e) => onHandleDateChange(e , "nextFollowUp" )}>
              <div className="inputRight">
                <div
                  className="dateBorder"
                  style={{
                    marginBottom: error?.nextFollowUp ? 0 : 15,
                  }}
                >
                  {leadDetails?.nextFollowUp ? (
                    moment(leadDetails?.nextFollowUp ,  "MM-DD-YYYY").format("DD-MM-YYYY")
                  ) : (
                    <p style={{ color: "#9ca1c7" }}> Next Follow up*</p>
                  )}
                </div>

                {error?.nextFollowUp && (
                  <div
                    className="alignCenter"
                    style={{
                      color: "var(--red)",
                      fontSize: 12,
                      marginBottom: 15,
                      marginLeft: 15,marginTop:5,
                    }}
                  >
                    <ErrorRoundedIcon
                      style={{
                        color: "var(--red)",
                        fontSize: 16,
                        marginRight: 5,
                      }}
                    />
                    {error?.nextFollowUp}
                  </div>
                )}
              </div>
            </CustomDatePicker> */}
            {/* <CustomDatePicker>
              <div className="inputRight">
                <input
                  style={{
                    marginBottom: error?.nextFollowUp ? 0 : 15,
                  }}
                  type="text"
                  placeholder="Next Followup*"
                />
                {error?.nextFollowUp && (
                  <div
                    className="alignCenter"
                    style={{
                      color: "var(--red)",
                      fontSize: 12,
                      marginBottom: 15,
                      marginLeft: 15,
                    }}
                  >
                    <ErrorRoundedIcon
                      style={{
                        color: "var(--red)",
                        fontSize: 16,
                        marginRight: 5,
                      }}
                    />
                    {error?.nextFollowUp}
                  </div>
                )}
              </div>
            </CustomDatePicker> */}
          </div>
          <textarea
            style={{
              width: "100%",
              outline: 0,
              backgroundColor: "var(--blakish)",
              padding: 15,
              color: "#fff",
              fontSize: 14,
              border: "1px solid #363d72",
              borderRadius: 24,
            }}
            rows={4}
            cols={50}
            placeholder="Project Description*"
            value={leadDetails?.description}
            onChange={onHandleChange}
            name="description"
            className="addLeadTextArea"
          />
          {error?.description && (
            <div
              className="alignCenter"
              style={{
                color: "var(--red)",
                fontSize: 12,
                marginBottom: 15,
                marginLeft: 15,
                marginTop: 5,
              }}
            >
              <ErrorRoundedIcon
                style={{ color: "var(--red)", fontSize: 16, marginRight: 5 }}
              />
              {error?.description}
            </div>
          )}
        </form>
      </div>
      <div className="addleadFooter">
        <CustomButton
          className={"btn1"}
          type="outlined"
          onClick={handleClose}
          disabled={isLoading}
        >
          <p>Cancel</p>
        </CustomButton>
        <CustomButton onClick={onHandleSubmit} loading={isLoading}>
          <p>Create Lead</p>
        </CustomButton>
      </div>
    </div>
  );
}


export default AddLead;
function SelectRender({ item }) {
  return (
    <div className={`${css.selectRo1w} normalFont d_flex alignCenter`}>
      <CustomAvatar src={item?.profilePicture} small variant="circle" />
      <p className="pl-1"> {item?.name}</p>
    </div>
  );
}
