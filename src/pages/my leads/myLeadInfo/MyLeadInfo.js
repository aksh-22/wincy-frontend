import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DraftsOutlinedIcon from "@material-ui/icons/DraftsOutlined";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import PhoneOutlinedIcon from "@material-ui/icons/PhoneOutlined";
import TodayIcon from "@material-ui/icons/Today";
import CommonDialog from "components/CommonDialog";
import ConfirmDialog from "components/ConfirmDialog/ConfirmDialog";
import CustomChip from "components/CustomChip";
import CustomMenu from "components/CustomMenu";
import CustomRow from "components/CustomRow";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import CustomDatePicker from "components/datePicker/ReactDatePicker";
import { LightTooltip } from "components/tooltip/LightTooltip";
import moment from "moment";
import { useState } from "react";
import { useDeleteLead } from "react-query/lead/useDeleteLead";
import { useGetLead } from "react-query/lead/useGetLead";
import { useUpdateLead } from "react-query/lead/useUpdateLead";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import SkeletonLead from "skeleton/skeletonLead/SkeletonLead";
import { currency } from "utils/currency";
import { leadChipStatusColor } from "utils/leadChipStatusColor";
import Activity from "./Activity";
import classes from "./MyLeadInfo.module.css";

const menuItem = ["Active", "Idle", "Awarded", "Rejected"];

export default function MyLead() {
  // fetching data from browser and redux

  const history = useHistory();
  const platform = useSelector(
    (state) => state.userReducer?.userData?.platforms
  );
  const selectedOrg = useSelector(
    (state) => state.userReducer?.selectedOrganisation
  );
  const orgId = selectedOrg?._id;
  const { leadId } = useParams();

  const technologies = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );

  // --------------APIs--------------------

  const { data, isLoading } = useGetLead(orgId, leadId);
  const { mutate, isLoading: isLoadingDelete } = useDeleteLead(
    orgId,
    leadId,
    data?.lead?.status
  );
  const [leadStatus, setLeadStatus] = useState(data?.lead?.status);
  const { isLoading: isLoadingUpdate, mutate: mutateUpdate } = useUpdateLead(
    orgId,
    leadId,
    data?.lead?.status
  );

  // ------------sidebar state and controller

  const [state, setstate] = useState(false);
  // const sidebarHandler = (el) => {
  //   setstate(!state);
  //   setSidebarData(el);
  // };

  // // // -----------------update and delete handler--------------

  const updateData = (fieldName, fieldValue) => {
    const data = {
      orgId,
      leadId,
      data: {
        [fieldName]: fieldValue,
      },
    };

    mutateUpdate(data, {
      onSuccess: () => {},
      onError: () => {
        console.log("err");
      },
    });
  };

  const deleteHandler = () => {
    mutate(
      { orgId, leadId },
      {
        onSuccess: () => {
          history.push("/main/myLeads");
        },
      }
    );
  };

  return (
    <div className={classes.myLead}>
      <CustomSideBar show={state} toggle={() => setstate(!state)}>
        {/* <MyTeamSidebarInfo /> */}
        {/* <div>aaa</div> */}
      </CustomSideBar>
      {isLoading ? (
        <SkeletonLead />
      ) : (
        <div className={classes.leadDetails}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontFamily: "Lato-Bold", minWidth: 220 }}>
                <CustomRow
                  // value={
                  //   data?.lead?.name
                  //   // data?.lead?.name
                  //   //   ? textTruncateMore(data?.lead?.name, 15)
                  //   //   : "N/A"
                  // }
                  value={
                    data?.lead?.name
                      ? data?.lead?.name
                          .trim()
                          .replace(/^\w/, (c) => c.toUpperCase())
                      : undefined
                  }
                  // apiKey="reference"
                  inputType="text"
                  onChange={(value, apiKey, key, apikey1) => {
                    value !== data?.lead?.name && updateData("name", value);
                  }}
                  truncateValue={20}
                  // fieldClassName={classes.row}
                  // valueClassName={classes.rowEL}
                />
              </h2>

              {/* <CustomRow
                inputType="menu"
                menuItems={[
                  { label: "Active", value: "Active", menuName: "status" },
                  { label: "Idle", value: "Idle", menuName: "status" },
                  { label: "Awarded", value: "Awarded", menuName: "status" },
                  { label: "Rejected", value: "Rejected", menuName: "status" },
                ]}
                value={
                  <CustomChip
                    label={data?.lead?.status}
                    bgColor={leadChipStatusColor[data?.lead?.status]}
                  />
                }
                onChange={(value) => {
                  value !== data?.lead?.status && updateData("status", value);
                  setLeadStatus(value);
                }}
                isEditA
              /> */}
              <CustomMenu
                menuItems={[
                  { label: "Active", value: "Active", menuName: "status" },
                  { label: "Idle", value: "Idle", menuName: "status" },
                  { label: "Awarded", value: "Awarded", menuName: "status" },
                  { label: "Rejected", value: "Rejected", menuName: "status" },
                ]}
                activeMenuItem={
                  <CustomChip
                    label={data?.lead?.status}
                    bgColor={leadChipStatusColor[data?.lead?.status]}
                  />
                }
                handleMenuClick={(value) => {
                  console.log(value.value);
                  console.log(data?.lead?.status);
                  if (value.length !== 0) {
                    value.value !== data?.lead?.status &&
                      updateData("status", value.value);
                    value.value !== data?.lead?.status &&
                      setLeadStatus(value.value);
                  }
                }}
              />
            </div>

            {/* <CommonDelete
            isLoading={isLoadingDelete}
            mutate={mutate}
            data={(orgId, leadId)}
          /> */}
            <CommonDialog
              actionComponent={
                <LightTooltip title="Delete Lead">
                  <IconButton style={{ color: "var(--red)" }}>
                    <DeleteForeverIcon />
                  </IconButton>
                </LightTooltip>
              }
              modalTitle="Are you sure"
              content={
                <ConfirmDialog
                  onClick={deleteHandler}
                  isLoading={isLoadingDelete}
                  warning="Do you want to delete lead"
                />
              }
              width={450}
              height={"auto"}
              dialogContentClass={"pt-0"}
            />
            {/* <IconButton
            style={{ color: "var(--defaultWhite)" }}
            onClick={() => setstate(!state)}
          >
            <InfoOutlinedIcon />
          </IconButton> */}
            {/* <div style={{ display: "flex", alignItems: "center" }}>
          </div> */}
          </div>
          <div className={classes.info}>
            <div className={classes.card_info_el}>
              <DraftsOutlinedIcon className={classes.icon} />
              {/* <p>{email }</p> */}
              <CustomRow
                // value={
                //   data?.lead?.email
                //   // data?.lead?.email
                //   //   ? textTruncateMore(data?.lead?.email, 35)
                //   //   : "N/A"
                // }
                value={data?.lead?.email}
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.email && updateData("email", value);
                }}
                truncateValue={35}
                // fieldClassName={classes.row}
                // valueClassName={classes.rowEL}
              />
            </div>
            <div className={classes.card_info_el}>
              <PhoneOutlinedIcon className={classes.icon} />
              {/* <p>{location }</p> */}
              <CustomRow
                // value={
                //   data?.lead?.contactNumber
                //   // data?.lead?.contactNumber
                //   //   ? textTruncateMore(data?.lead?.contactNumber, 35)
                //   //   : "N/A"
                // }
                value={data?.lead?.contactNumber}
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.contactNumber &&
                    updateData("contactNumber", value);
                }}
                truncateValue={35}
                // fieldClassName={classes.row}
                // valueClassName={classes.rowEL}
              />
            </div>
            <div className={classes.card_info_el}>
              <LocationOnOutlinedIcon className={classes.icon} />
              {/* <p>{location }</p> */}
              <CustomRow
                // value={
                //   data?.lead?.country
                //   // data?.lead?.country
                //   //   ? textTruncateMore(data?.lead?.country, 35)
                //   //   : "N/A"
                // }
                value={data?.lead?.country}
                apiKey="reference"
                inputType="autoComplete"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.country && updateData("country", value);
                }}
                truncateValue={35}

                // fieldClassName={classes.row}
                // valueClassName={classes.rowEL}
              />
            </div>
          </div>
          <div className={classes.leadDetails_info}>
            <div className={classes.leadDetails_info_left}>
              <div className={classes.chips}>
                <div>
                  <p>Platform :</p>
                  <CustomRow
                    // field="Platform"
                    value={
                      data?.lead?.platforms?.length > 0
                        ? data?.lead?.platforms
                        : []
                    }
                    // apiKey="reference"
                    inputType="select"
                    onChange={(value, apiKey, key, apikey1) => {
                      value !== data?.lead?.platforms &&
                        updateData("platforms", value);
                    }}
                    menuItems={platform}
                    // fieldClassName={classes.row}
                    // valueClassName={classes.rowEL}
                    multiple
                    max={7}
                  />
                </div>
                <div>
                  <p>Technologies :</p>
                  <CustomRow
                    // field="Technologies"
                    value={
                      data?.lead?.technologies?.length > 0
                        ? data?.lead?.technologies
                        : []
                    }
                    // apiKey="reference"
                    inputType="select"
                    onChange={(value, apiKey, key, apikey1) => {
                      value !== data?.lead?.technologies &&
                        updateData("technologies", value);
                    }}
                    menuItems={technologies}
                    // fieldClassName={classes.row}
                    // valueClassName={classes.rowEL}
                    multiple
                    max={7}
                  />
                </div>
              </div>
              <CustomRow
                // field="Budget Proposed"
                // value={data?.lead?.budgetProposed }
                value={
                  data?.lead?.description?.length !== 0
                    ? data?.lead?.description
                    : undefined
                  // data?.lead?.description
                  //   ? textTruncateMore(data?.lead?.description, 220)
                  //   : "N/A"
                }
                emptyText="no description available"
                // apiKey="description"
                multiple
                multiline
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.description &&
                    updateData("description", value);
                }}
                maxRows={10}
                nonTruncate
                fieldClassName={classes.description}
                valueClassName={classes.rowEL}
              />

              {/* <p style={{ wordBreak: "break-word" }}>
              {data?.lead?.description
                ? textTruncateMore(data?.lead?.description, 220)
                : "N/A"}
            </p> */}
              <div className={classes.leadDetails_info_left_footer}>
                <div className={classes.leadDetails_info_left_footer_date}>
                  <div>
                    <p>Date Contacted First:</p>
                    {data?.lead?.dateContactedFirst ? (
                      <div className={classes.el}>
                        <p style={{ paddingLeft: 5 }}>
                          {moment(data?.lead?.dateContactedFirst).format(
                            "DD-MMM-YYYY"
                          )}
                        </p>
                        <TodayIcon />
                      </div>
                    ) : (
                      <CustomDatePicker
                        // variant="dialog"
                        className={classes.dateEl}
                        format="dd-MMM-yyyy"
                        placeholder="dd-mm-yyyy"
                        selectedDate={
                          data?.lead?.dateContactedFirst
                            ? data?.lead?.dateContactedFirst
                            : "N/A"
                        }
                        handleDateChange={(date) => {
                          updateData("dateContactedFirst", date);
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <p>Next Followup Date:</p>
                    <CustomDatePicker
                      variant="dialog"
                      className={classes.dateEl}
                      format="dd-MMM-yyyy"
                      placeholder="dd-mm-yyyy"
                      selectedDate={
                        data?.lead?.nextFollowUp
                          ? data?.lead?.nextFollowUp
                          : "N/A"
                      }
                      handleDateChange={(date) => {
                        updateData("nextFollowUp", date);
                      }}
                    />
                    {/* <div className={classes.el}>
                    <DateRangeOutlinedIcon />
                    <p style={{ paddingLeft: 5 }}>
                      {data?.lead?.nextFollowUp
                        ? moment(data?.lead?.nextFollowUp).format("DD-MM-YYYY")
                        : "N/A"}
                    </p>
                  </div> */}
                  </div>
                </div>
                {/* <CustomButton style={{ width: 200, marginLeft: "1em" }}>
                Schedule Next Meeting
              </CustomButton> */}
              </div>
            </div>
            <div className={classes.leadDetails_info_right}>
              <CustomRow
                field="Reference"
                value={data?.lead?.reference}
                // value={
                //   data?.lead?.reference
                //   // data?.lead?.reference
                //   //   ? textTruncateMore(data?.lead?.reference, 10)
                //   //   : "N/A"
                // }
                variant="naked"
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.reference &&
                    updateData("reference", value);
                }}
                truncateValue={15}
                fieldClassName={classes.row}
                valueClassName={classes.rowEl}
              />

              <CustomRow
                field="Currency"
                value={data?.lead?.currency}
                apiKey="reference"
                inputType="select"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.currency &&
                    updateData("currency", value);
                }}
                truncateValue={15}
                menuItems={currency}
                fieldClassName={classes.row}
                valueClassName={classes.rowEL}
              />
              <CustomRow
                field="Budget Expectation"
                value={data?.lead?.budgetExpectation}
                // value={
                //   data?.lead?.budgetExpectation
                //   // data?.lead?.budgetExpectation
                //   //   ? textTruncateMore(data?.lead?.budgetExpectation, 10)
                //   //   : "N/A"
                // }
                apiKey="reference"
                inputType="text"
                variant="naked"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.budgetExpectation &&
                    updateData("budgetExpectation", value);
                }}
                truncateValue={10}
                fieldClassName={classes.row}
                valueClassName={classes.rowEL}
              />
              <CustomRow
                field="Budget Proposed"
                value={data?.lead?.budgetProposed}
                // value={
                //   data?.lead?.budgetProposed
                //   // data?.lead?.budgetProposed
                //   //   ? textTruncateMore(data?.lead?.budgetProposed, 10)
                //   //   : "N/A"
                // }
                truncateValue={10}
                variant="naked"
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.budgetProposed &&
                    updateData("budgetProposed", value);
                }}
                fieldClassName={classes.row}
                valueClassName={classes.rowEL}
              />
              <CustomRow
                field="Duration Expectation"
                variant="naked"
                value={data?.lead?.durationExpectation}
                // value={
                //   data?.lead?.durationExpectation
                //   // data?.lead?.durationExpectation
                //   //   ? textTruncateMore(data?.lead?.durationExpectation, 10)
                //   //   : "N/A"
                // }
                truncateValue={5}
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.durationExpectation &&
                    updateData("durationExpectation", parseInt(value, 10));
                }}
                fieldClassName={classes.row}
                valueClassName={classes.rowEL}
              />
              <CustomRow
                field="Duration Proposed"
                variant="naked"
                value={data?.lead?.durationProposed}
                truncateValue={5}
                apiKey="reference"
                inputType="text"
                onChange={(value, apiKey, key, apikey1) => {
                  value !== data?.lead?.durationProposed &&
                    updateData("durationProposed", parseInt(value, 10));
                }}
                fieldClassName={classes.row}
                valueClassName={classes.rowEL}
              />
            </div>
          </div>
        </div>
      )}
      <Activity />
    </div>
  );
}
