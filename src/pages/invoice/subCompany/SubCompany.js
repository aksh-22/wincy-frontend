import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CommonDelete from "components/CommonDelete";
import CommonDialog from "components/CommonDialog";
import CustomInput from "components/customInput/CustomInput";
import NoData from "components/NoData";
import React, { useState } from "react";
import { useDeleteSubsidiary } from "react-query/invoice/subsidiary/useDeleteSubsidiary";
import { useSubsidiaryList } from "react-query/invoice/subsidiary/useSubsidiaryList";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import "../account/Account.scss";
import { AddIconComponent } from "../AddIconComponent";
import "../Invoice.scss";
import CreateSubCompany from "./CreateSubCompany";
function SubCompany() {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data, isLoading, isError } = useSubsidiaryList({ orgId });
  const [search, setSearch] = useState(null);
  const onSearch = (event) => {
    const { value } = event?.target;
    if (data?.length > 0) {
      if (!value?.trim()?.length) return setSearch(null);

      let result = data?.filter((_item) =>
        _item?.title?.toLowerCase().includes(value?.toLowerCase())
      );
      setSearch(result);
    }
  };
  const { mutate: deleteMutate, isLoading: deleteLoading } =
    useDeleteSubsidiary();
  console.log("data", data);
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
          <p>Sub Company</p>
        </div>

        <div className="alignCenter">
          <CommonDialog
            actionComponent={
              <AddIconComponent tooltipTitle="Add Sub Company" />
            }
            content={<CreateSubCompany />}
            modalTitle={"Add Sub Company"}
            minWidth="40vw"
          />
          {/* <CustomButton clas>
    <AddRoundedIcon />
  </CustomButton> */}
          <CustomInput placeholder="Search" type="search" onChange={onSearch} />
        </div>
      </div>

      {!isLoading && (data?.length ?? 0) === 0 ? (
        <NoData />
      ) : (
        <>
          <div className="invoice_header_row">
            <h3>Sub Company</h3>
          </div>

          {isLoading ? (
            <TableRowSkeleton count={4} height={40} />
          ) : search ? (
            search?.length > 0 ? (
              search?.map((item, index) => (
                <div className="invoice_item_row" key={index}>
                  <div className="invoice_item_row_sideLine" />
                  <div className="alignCenter flex">
                    <InputTextClickAway disabled value={item?.title} />
                    <CommonDelete />
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
                  <InputTextClickAway disabled value={item?.title} />
                  <CommonDelete
                    isLoading={deleteLoading}
                    mutate={deleteMutate}
                    data={{
                      orgId,
                      data: {
                        subsiduaries: [item?._id],
                      },
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* {
        isLoading  ? <TableRowSkeleton height={40} count={4} /> : new Array(5).fill("").map((_, index) => (
          <div className="invoice_item_row" key={index}>
            <div className="invoice_item_row_sideLine" />
            <div className="alignCenter flex">
              <InputTextClickAway disabled value={"SSSS"} />
              <CommonDelete />
            </div>
          </div>
        ))
      } */}
      {/* 
      {new Array(5).fill("").map((_, index) => (
        <div className="invoice_item_row" key={index}>
          <div className="invoice_item_row_sideLine" />
          <div className="alignCenter flex">
            <InputTextClickAway disabled value={"SSSS"} />
            <CommonDelete />
          </div>
        </div>
      ))} */}
    </div>
  );
}

export default SubCompany;
