import AddRoundedIcon from "@mui/icons-material/AddRounded";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CommonDelete from "components/CommonDelete";
import CommonDialog from "components/CommonDialog";
import CustomInput from "components/customInput/CustomInput";
import NoData from "components/NoData";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useState } from "react";
import { useAccount } from "react-query/invoice/account/useAccount";
import { useDeleteAccount } from "react-query/invoice/account/useDeleteAccount";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import "../Invoice.scss";
import "./Account.scss";
import AddAccount from "./AddAccount";
function Account() {
  const [search, setSearch] = useState(null);

  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data, isLoading, isError } = useAccount({ orgId });
  const onSearch = (event) => {
    const { value } = event?.target;
    if (data?.length > 0) {
      if (!value?.trim()?.length) return setSearch(null);

      let result = data?.filter((_item) =>
        _item?.accountName?.toLowerCase().includes(value?.toLowerCase())
      );
      setSearch(result);
    }
  };
  const { mutate: deleteMutate, isLoading: deleteLoading } = useDeleteAccount(orgId);
  return isError ? (
    <NoData error />
  ) : (
    <div className="account_container">
      <div className="alignCenter mb-2">
        <div className="alignCenter flex">
          <p>Home</p>
          <p>&nbsp; {">"}&nbsp; </p>
          <p>Invoice</p>
          <p>&nbsp;{">"} &nbsp;</p>
          <p>Account</p>
        </div>

        <div className="alignCenter">
          <CommonDialog
            actionComponent={<AddIconComponent />}
            content={<AddAccount />}
            modalTitle={"Add Account"}
            minWidth="50vw"
          />
          <CustomInput placeholder="Search" type="search" onChange={onSearch} />
        </div>
      </div>

      <div className="invoice_header_row">
        <h3>Account</h3>
      </div>
      {!isLoading && (data?.length ?? 0) === 0 ? (
        <NoData />
      ) : isLoading ? (
        <TableRowSkeleton count={4}/>
      ) : search ? (
        search?.length > 0 ? (
          search?.map((item, index) => (
            <div className="invoice_item_row" key={index}>
              <div className="invoice_item_row_sideLine" />
              <div className="alignCenter flex">
                <InputTextClickAway disabled value={item?.accountName} />
                {/* <CommonDelete /> */}
              </div>
            </div>
          ))
        ) : (
          <div className="mt-4">
            <NoData />
          </div>
        )
      ) : (
        data?.map((item, index) => (
          <div className="invoice_item_row" key={index}>
            <div className="invoice_item_row_sideLine" />
            <div className="alignCenter flex">
              <InputTextClickAway disabled value={item?.accountName} />
              <CommonDelete
                isLoading={deleteLoading}
                mutate={deleteMutate}
                data={{
                  data: {
                    accountIds: [item?._id],
                  },
                  orgId,
                }}
                
              />
            </div>
          </div>
        ))
      )}

      {/* {
  new Array(5).fill("").map((_ , index) => <div className='invoice_item_row' key={index}>
  <div className='invoice_item_row_sideLine'/>
  <div className='alignCenter flex'>
    <InputTextClickAway 
    disabled
    value={"SSSS"}
    />
    <CommonDelete 
    />
  </div>
</div>)
} */}
    </div>
  );
}

export default Account;

const AddIconComponent = ({ onClick }) => {
  return (
    <LightTooltip title={"Add Account"} arrow>
      <div className={"invoice_add_icon mr-1"} onClick={onClick}>
        <AddRoundedIcon
          style={{
            // marginLeft: "10px",
            color: "var(--defaultWhite)",
            fontSize: 26,
          }}
          type={"contained"}
        />
      </div>
    </LightTooltip>
  );
};
