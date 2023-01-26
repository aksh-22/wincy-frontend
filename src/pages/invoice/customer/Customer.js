import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CommonDelete from "components/CommonDelete";
import CommonDialog from "components/CommonDialog";
import CustomInput from "components/customInput/CustomInput";
import NoData from "components/NoData";
import React, { useCallback, useState } from "react";
import { useCustomerList } from "react-query/invoice/customer/useCustomerList";
import { useCustomerDelete } from "react-query/invoice/customer/useDeleteCustomer";
import { useUpdateCustomer } from "react-query/invoice/customer/useUpdateCustomer";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import "../account/Account.scss";
import { AddIconComponent } from "../AddIconComponent";
import "../Invoice.scss";
import CreateCustomer from "./CreateCustomer";
function Customer() {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data, isLoading, isError } = useCustomerList({ orgId });
  const [search, setSearch] = useState(null)
  const onSearch = (event) => {
    const {value} = event?.target
    console.log("result" , value)
    if(data?.length > 0){
      if(!value?.trim()?.length)
        return setSearch(null) 
      
      let result =   data?.filter((_item) =>  _item?.fullName?.toLowerCase().includes(value?.toLowerCase()))
      setSearch(result)
    } 
  }
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
          <p>Customer</p>
        </div>

        <div className="alignCenter">
          <CommonDialog
            actionComponent={<AddIconComponent tooltipTitle="Add Customer" />}
            content={<CreateCustomer />}
            modalTitle={"Add Sub Company"}
            minWidth="40vw"
          />
          <CustomInput placeholder="Search" type="search" onChange={onSearch}/>
        </div>
      </div>

      <div className="invoice_customer_header_row">
        <h3 style={{ flex: 1 }}>Customer</h3>
        <h3 style={{ flex: 1 }}>Mail Id</h3>
        <h3 style={{ flex: 1 }}>Address</h3>
        <div
          style={{
            width: "1em",
            height: "1em",
          }}
        />
      </div>

      {isLoading ? (
        <TableRowSkeleton count={4} height={40} />
      ) : (
        search ? search?.length > 0 ? search?.map((item, index) => (
          <CustomerRow
            item={item}
            orgId={orgId}
            key={item?._id}
            index={index}
          />
        )) : <div className="mt-4"><NoData /></div> : data?.map((item, index) => (
          <CustomerRow
            item={item}
            orgId={orgId}
            key={item?._id}
            index={index}
          />
        ))
      )}
    </div>
  );
}

export default Customer;

const CustomerRow = ({ item, orgId, index }) => {
  const { mutate, isLoading } = useCustomerDelete();
  const { mutate: updateCustomer } = useUpdateCustomer();
  const onUpdate = useCallback(
    (name) => (value) => {
      updateCustomer({
        index,
        orgId,
        data : {
          [name]:value
        },
        customerId:item?._id
        
      })
    },
    [item]
  );

  return (
    <div className="invoice_customer_item_row">
      <div className="d_flex textEllipse">
        <div className="invoice_item_row_sideLine" />
        <div className="d_flex flex textEllipse">
          <InputTextClickAway
            // disabled
            className={"textEllipse alignCenter"}
            textClassName="textEllipse"
            value={item?.fullName}
            onChange={onUpdate("fullName")}
          />
        </div>
      </div>

      <InputTextClickAway
        className={"textEllipse alignCenter"}
        textClassName="textEllipse"
        value={item?.email ?? "N/A"}
        onChange={onUpdate("email")}
        checkEmailError

      />
      <InputTextClickAway
        className={"textEllipse alignCenter"}
        textClassName="textEllipse"
        value={item?.address ?? "N/A"}
        onChange={onUpdate("address")}
      />

      <div className="d_flex flex">
        <CommonDelete
          mutate={mutate}
          isLoading={isLoading}
          data={{
            orgId,
            index,
            data: {
              customers: [item?._id],
            },
          }}
        />
      </div>
    </div>
  );
};
