import React, { useRef, useCallback, useState, useEffect } from "react";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import CallIcon from "@mui/icons-material/Call";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomRow from "components/CustomRow";
import { useGetLead } from "react-query/lead/useGetLead";
import { useSelector } from "react-redux";
// import { currency } from "utils/currency";
import CustomTextEditor from "components/customTextEditor/CustomTextEditor";
import { useUpdateLead } from "react-query/lead/useUpdateLead";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import { LightTooltip } from "components/tooltip/LightTooltip";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { contactUs } from "../addLead/AddLead";
import { useQueryClient } from "react-query";

function LeadInfoAboutTab({ info, tabStatus, statusOption }) {
  const textEditorRef = useRef(null);
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const queryClient = useQueryClient();
  const orgTeam = queryClient?.getQueryData(["organisationUsers", orgId]);
  const [teamMembers, setTeamMembers] = useState([]);
  useEffect(() => {
    let team = orgTeam?.users?.filter((item) =>
      item?.userType?.find(
        (row) =>
          ["Admin", "Member++"].includes(row?.userType) &&
          row?.organisation === orgId
      )
    );
    setTeamMembers(team);
  }, [orgTeam]);

  const { platforms, currency } = useSelector(
    (state) => state.userReducer?.userData
  );
  const { data, isLoading } = useGetLead(orgId, info?._id);
  const { mutate: mutateUpdate } = useUpdateLead(tabStatus);
  const onHandleUpdate = useCallback(
    (fieldName, fieldValue, otherData) => {
      const obj = {
        orgId: orgId,
        leadId: info?._id,
        leadStatus: data?.lead?.status,
        data: {
          [fieldName]: fieldValue,
        },
        managedByData: otherData,
      };

      mutateUpdate(obj);
    },
    [orgId, info, data, mutateUpdate]
  );

  const onValueChange = useCallback(
    (value, _, key, otherKey, logo) => {
      if (key === "managedBy") {
        onHandleUpdate(key, value?._id, value);
      } else {
        onHandleUpdate(
          key,
          key === "durationExpectation" || key === "durationProposed"
            ? Number(value)
            : value
        );
      }
    },
    [onHandleUpdate]
  );

  //   const updateData = (fieldName, fieldValue) => {
  //     const data = {
  //       orgId,
  //       leadId,
  //       data: {
  //         [fieldName]: fieldValue,
  //       },
  //     };

  //     mutateUpdate(data, {
  //       onSuccess: () => {},
  //       onError: () => {
  //         console.log("err");
  //       },
  //     });
  //   };
  return (
    <div>
      {isLoading ? (
        <div>
          <TableRowSkeleton count={4} />
        </div>
      ) : (
        <div className="abouttabContent">
          <ul>
            <li>
              <LightTooltip title="Domain" arrow>
                <ArticleRoundedIcon />
              </LightTooltip>
              <InputTextClickAway
                onChange={(value) => onHandleUpdate("domain", value)}
                value={data?.lead?.domain}
                textClassName={"pl-0 m-0"}
              />
            </li>
            <li>
              <DraftsOutlinedIcon />
              <InputTextClickAway
                onChange={(value) => onHandleUpdate("email", value)}
                value={info?.email}
                textClassName={"pl-0 m-0"}
                checkEmailError
              />
            </li>
            <li>
              <CallIcon />
              <InputTextClickAway
                value={data?.lead?.contactNumber}
                textClassName={"pl-0 m-0"}
                onChange={(value) => onHandleUpdate("contactNumber", value)}
              />
            </li>
            <li>
              <LocationOnOutlinedIcon />
              <CustomRow
                value={data?.lead?.country}
                fieldClassName={"pl-0"}
                onChange={(value) => onHandleUpdate("country", value)}
                inputType="autoComplete"
              />
            </li>
          </ul>

          <CustomTextEditor
            value={data?.lead?.description}
            updateData={(value) => onHandleUpdate("description", value)}
            ref={textEditorRef}
          />

          <div className="mt-2">
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.managedBy}
              inputType="select"
              apiKey="managedBy"
              onChange={onValueChange}
              menuItems={teamMembers}
              field={"Managed By"}
              inputTextClassName="titleInput"
              // selectRender={<SelectRender />}
              userSelection
            />
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.status}
              inputType="select"
              apiKey="status"
              onChange={onValueChange}
              menuItems={statusOption}
              field={"Status"}
              inputTextClassName="titleInput"
            />
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.reference}
              inputType="select"
              menuItems={contactUs}
              apiKey="reference"
              onChange={onValueChange}
              field={"Reference"}
              inputTextClassName="titleInput"
            />
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.platforms}
              inputType="select"
              apiKey="platforms"
              onChange={onValueChange}
              menuItems={platforms}
              multiple
              field={"Platform"}
              inputTextClassName="titleInput"
              max={4}
            />
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.currency}
              inputType="select"
              apiKey="currency"
              menuItems={currency}
              onChange={onValueChange}
              field={"Currency"}
              inputTextClassName="titleInput"
            />

            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.budgetExpectation ?? "N/A"}
              apiKey="budgetExpectation"
              inputType="number"
              onChange={onValueChange}
              field={"Budget Expectation"}
              inputTextClassName="titleInput"
            />
            <CustomRow
              fieldClassName="borderBottom_0"
              value={data?.lead?.budgetProposed}
              inputType="number"
              apiKey="budgetProposed"
              onChange={onValueChange}
              field={"Budget Proposed"}
              inputTextClassName="titleInput"
            />
            <CustomRow
              value={data?.lead?.durationExpectation ?? ""}
              inputType="dropDown"
              apiKey="durationExpectation"
              onChange={onValueChange}
              field={"Duration Expectation"}
              inputTextClassName="titleInput"
            />

            <CustomRow
              value={data?.lead?.durationProposed ?? ""}
              inputType="dropDown"
              apiKey="durationProposed"
              onChange={onValueChange}
              field={"Duration Proposed"}
              inputTextClassName="titleInput"
            />

            <CustomRow
              value={data?.lead?.dateContactedFirst}
              inputType="date"
              apiKey="dateContactedFirst"
              onChange={onValueChange}
              field={"Date Contacted First"}
              inputTextClassName="titleInput"
            />

            <CustomRow
              value={data?.lead?.settledFor}
              inputType="number"
              apiKey="settledFor"
              onChange={onValueChange}
              field={"Settled For"}
              inputTextClassName="titleInput"
              disabled={data?.lead?.status !== "Awarded"}
              disablePlaceholder="Only awarded leads can have settled amount."
            />

            <CustomRow
              value={data?.lead?.proposalLink}
              inputType="text"
              apiKey="proposalLink"
              onChange={onValueChange}
              field={"Proposal Link"}
              inputTextClassName="titleInput"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadInfoAboutTab;
