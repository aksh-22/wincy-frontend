import ArrowRightSharpIcon from "@mui/icons-material/ArrowRightSharp";
import CustomInput from "components/customInput/CustomInput";
import CustomPopper from "components/CustomPopper";
import IosIcon from "components/icons/IosIcon";
import NoData from "components/NoData";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useCallback, useEffect, useState } from "react";
import { useTransaction } from "react-query/invoice/transaction/useTransaction";
import { useInvoice } from "react-query/invoice/useInvoice";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import { dateCondition } from "utils/dateCondition";
import { AddIconComponent } from "./AddIconComponent";
import ProfilePopupCss from "css/ProfilePopup.module.css";
import "./Invoice.scss";
import TransactionRow from "./viewInvoice/TransactionRow";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterInInvoice, {
  convertFinancialYearToString,
} from "./FilterInInvoice";
import Loading from "components/loading/Loading";
import { useQueryClient } from "react-query";
import { useSubsidiaryList } from "react-query/invoice/subsidiary/useSubsidiaryList";
import { PDFViewer } from "@react-pdf/renderer";
import DownloadInvoice from "./viewInvoice/DownloadInvoice";
import { useContext } from "react";
import { InvoiceFilterContext } from "context/invoiceFilterContext";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CustomButton from "components/CustomButton";
import { capitalizeFirstLetter } from "utils/textTruncate";
function Invoice() {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data: subsidiaryList, isLoading: subsidiaryLoading } =
    useSubsidiaryList({ orgId });
  const { push } = useHistory();
  const [search, setSearch] = useState(null);
  // const [filter, setFilter] = useState({
  //   financialYear: null,
  //   sortBy: "asc",
  //   subsiduary: null,
  // });
  const { filter, setFilter } = useContext(InvoiceFilterContext);
  const { data, isLoading, isRefetching } = useInvoice({
    orgId,
    financialYear: filter?.financialYear
      ? convertFinancialYearToString(filter?.financialYear)
      : null,
    subsiduary: filter?.subsiduary,
  });
  const onSearch = (event) => {
    const { value } = event?.target;
    if (data?.length > 0) {
      if (!value?.trim()?.length) return setSearch(null);

      let result = data?.filter((_item) =>
        _item?.sNo?.toLowerCase().includes(value?.toLowerCase())
      );
      setSearch(result);
    }
  };
  const filterCount = useCallback(() => {
    let count = 0;
    for (let key in filter) {
      if (filter[key] === "asc") {
      } else if (filter[key] !== null) {
        count++;
      }
    }
    return count;
  }, [filter]);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (data) {
      let temp = data.sort(function (a, b) {
        return filter?.sortBy === "desc"
          ? Number(b?.sNo?.split("/").pop()) - Number(a?.sNo?.split("/").pop())
          : Number(a?.sNo?.split("/").pop()) - Number(b?.sNo?.split("/").pop());
      });
      queryClient.setQueryData(
        [
          "invoice",
          orgId,
          filter?.financialYear
            ? convertFinancialYearToString(filter?.financialYear)
            : null,
          filter?.subsiduary,
        ],
        temp
      );
    }
  }, [filter, data]);

  return (
    <div className="invoice_main_container">
      <div className="alignCenter mb-2">
        <div className="alignCenter flex">
          <p>Home</p>
          <p>&nbsp; {">"}&nbsp; </p>
          <p>Invoice</p>
        </div>

        {/* <PDFViewer
        style={{width:"100vw" , height:"100vh"}}
        >
        <DownloadInvoice item={obj} />
        </PDFViewer> */}
        <CustomPopper
          zIndex={999}
          paperClassName={ProfilePopupCss.paperClass}
          innerPopper={ProfilePopupCss.popperClassColor}
          width="auto"
          value={
            <LightTooltip title="Filter" arrow>
              <div
                style={{
                  position: "relative",
                }}
              >
                {filterCount() > 0 && (
                  <div className="filterBatch">
                    <p>{filterCount()}</p>
                  </div>
                )}
                {isRefetching && (
                  <Loading loadingType={"spinner"} backgroundColor="#FFF" />
                )}
                <FilterListIcon
                  style={{
                    color: "var(--defaultWhite)",
                    fontSize: 35,
                  }}
                />
              </div>
            </LightTooltip>
          }
          maxWidth={1200}
          valueStyle={{
            display: "flex",
            fontSize: 14,
            color: "white",
            margin: "0px 20px",
          }}
          content={
            <FilterInInvoice
              orgId={orgId}
              filter={filter}
              clearFilter={() =>
                setFilter({
                  financialYear: null,
                  sortBy: "asc",
                  subsiduary: null,
                })
              }
              filterCount={filterCount}
              setFilter={setFilter}
            />
          }
        />
        <div className="alignCenter">
          <AddIconComponent
            tooltipTitle="Create Invoice"
            onClick={() => push("/main/invoice/createInvoice")}
          />
          <CustomInput placeholder="Search" type="search" onChange={onSearch} />
        </div>
      </div>
      {!subsidiaryLoading ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <BtnWrapper>
            {subsidiaryList?.map((item) => (
              <CustomButton
                key={item?._id}
                type={filter?.subsiduary === item?._id ? "contained" : "text"}
                onClick={() => {
                  setFilter({
                    ...filter,
                    subsiduary:
                      filter?.subsiduary === item?._id ? null : item?._id,
                  });
                }}
              >
                <p className="filter_title">
                  {capitalizeFirstLetter(
                    item.title.length > 20
                      ? item?.title.substring(0, 20) + "..."
                      : item?.title
                  )}
                </p>
              </CustomButton>
            ))}
          </BtnWrapper>
        </div>
      ) : null}
      {!isLoading && data?.length > 0 && (
        <div className="invoice_main_header_row">
          <h3>Invoices</h3>
          <h3>Due Date</h3>
          <h3>Currency</h3>
          <h3>Amount</h3>
          <h3>Amount Paid</h3>
          <h3>Balance</h3>
          <h3>Status</h3>
        </div>
      )}

      {isLoading ? (
        <TableRowSkeleton count={4} height={40} />
      ) : search ? (
        search?.length > 0 ? (
          search?.map((item, index) => (
            <InvoiceRow key={item?._id} item={item} orgId={orgId} />
          ))
        ) : (
          <div className="mt-4">
            <NoData />
          </div>
        )
      ) : data?.length > 0 ? (
        data?.map((item) => (
          <InvoiceRow key={item?._id} item={item} orgId={orgId} />
        ))
      ) : (
        <NoData />
      )}
    </div>
  );
}

const InvoiceRow = ({ item, orgId }) => {
  const { push } = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useTransaction({ orgId, invoiceId: item?._id });
  const userType = useSelector((state) => state.userReducer?.userType);
  console.log(userType?.userId, item?.createdBy);
  return (
    <div className="mb-2">
      <div
        className="invoice_main_header_item cursorPointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="d_flex">
          <div
            className="invoice_item_row_sideLine "
            style={{ background: "var(--green)" }}
          />
          <div className="alignCenter flex">
            <ArrowRightSharpIcon
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "ease-in-out 0.2s",
              }}
            />
            <p>{`#${item?.sNo}`}</p>
          </div>
          {item?.createdBy === userType?.userId ||
          userType?.userType === "Admin" ? (
            <LightTooltip title="Info" arrow>
              <div className="alignCenter mx-1 cursorPointer">
                <div
                  onClick={() => push(`/main/invoice/viewInvoice/${item?._id}`)}
                >
                  <IosIcon name="info" />
                </div>
              </div>
            </LightTooltip>
          ) : null}
        </div>
        <p>{dateCondition(item?.dueDate)}</p>
        <p>{item?.currency}</p>
        <p>{item?.finalAmount}</p>
        <p>{item?.paidAmount}</p>
        <p>{Number(item?.finalAmount) - Number(item?.paidAmount)}</p>
        <p
          style={{
            background:
              item?.status !== "Partially Paid"
                ? "var(--green)"
                : "var(--chipYellow)",
          }}
        >
          {item?.status}
        </p>
      </div>

      {isOpen && (
        <>
          {!isLoading && data?.length > 0 && (
            <div className="invoice_main_header_sub_row">
              <div className="emptyCell" />

              <h3 className="ml-2">Payment Date</h3>
              <h3>Gateway</h3>
              <h3>Account</h3>
              <h3>Gateway Fees </h3>
            </div>
          )}

          {isLoading ? (
            <TableRowSkeleton count={4} />
          ) : (
            data?.map((row, index) => (
              <TransactionRow
                index={index}
                item={row}
                orgId={orgId}
                type="invoice"
              />
              // <div className="invoice_main_sub_header_item" key={row?._id}>
              //   <div className="emptyCell" />
              //   <div className="d_flex">
              //     <div
              //       className="invoice_item_row_sideLine "
              //       style={{ background: "var(--green)" }}
              //     />
              //     <div className="alignCenter flex">
              //       <p
              //         style={{
              //           textAlign: "center",
              //           flex: 1,
              //         }}
              //       >
              //         {dateCondition(row?.date)}
              //       </p>
              //     </div>
              //   </div>
              //   <h3>{row?.gateway}</h3>
              //   <h3>{row?.amount}</h3>
              //   <h3>{row?.description}</h3>
              // </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Invoice;

let obj = {
  status: "Unpaid",
  _id: "62a08a3c472a199cf0fa5ff9",
  subsiduary: {
    accounts: [],
    _id: "629dd43a57a9980016eb061a",
    createdBy: "61543116d8aa0b00169fbfc4",
    title: "PZ Solutions",
    address: "49 Chatrashal nagar,",
    gstNo: "BTP111116801D",
    additionalInfo: "#Solutions",
    organisation: "61554220a289af245c8b38f8",
    createdAt: "2022-06-06T10:17:30.423Z",
    updatedAt: "2022-06-06T10:17:30.423Z",
    __v: 0,
  },
  currency: "USD",
  sNo: "PS/GST/21-22/001",
  raisedOn: "2022-06-08T18:30:00.000Z",
  dueDate: "2022-06-09T18:30:00.000Z",
  customer: {
    _id: "629dd45957a9980016eb0648",
    createdBy: "61543116d8aa0b00169fbfc4",
    fullName: "Munish Gupta",
    email: "munishgupta@gmail.com",
    address: "Somewhere in Canada",
    organisation: "61554220a289af245c8b38f8",
    createdAt: "2022-06-06T10:18:01.535Z",
    updatedAt: "2022-06-06T10:18:01.535Z",
    __v: 0,
  },
  account: {
    _id: "629dd48557a9980016eb067a",
    createdBy: "61543116d8aa0b00169fbfc4",
    accountName: "Pairroxz Solutions",
    accountNumber: "xxxx7444",
    ifscCode: "AXISIFSC",
    swiftCode: "AXISSWIFT",
    micrCode: "AXISMICR",
    organisation: "61554220a289af245c8b38f8",
    subsiduary: "629dd43a57a9980016eb061a",
    createdAt: "2022-06-06T10:18:45.370Z",
    updatedAt: "2022-06-06T10:18:45.370Z",
    __v: 0,
  },
  services: [
    {
      _id: "62a08a3c472a199cf0fa5ffa",
      rate: "19",
      quantity: "1",
      description:
        "New design Implementation for Button New design Implementation for Button",
      amount: "19",
    },
    {
      _id: "62a08a3c472a199cf0fa5fsa",
      rate: "19",
      quantity: "1",
      description:
        "New design Implementation for Button New design Implementation for Button",
      amount: "19",
    },
  ],
  billTo: "Somewhere in Canada",
  paidAmount: "0",
  paymentPhase: {
    milestones: [
      {
        tasks: ["62aab5a2a052c20016383b63"],
        status: "Active",
        consumedTime: 0,
        _id: "61dec62254e4f20016946887",
        title: "Milestone 2",
        project: "61d9335060f28500165b4d88",
        createdBy: "615abfbe8a99c8001634397b",
        createdAt: "2022-01-12T12:14:26.888Z",
        updatedAt: "2022-06-16T04:48:22.893Z",
        __v: 1,
      },
    ],
    status: "Pending",
    _id: "62a0889b472a199cf0fa5ede",
    title: "Milestone 2",
    project: "61d9335060f28500165b4d88",
    organisation: "61554220a289af245c8b38f8",
    description: "",
    createdBy: "61543116d8aa0b00169fbfc4",
    currency: "USD",
    amount: "10",
    milestoneStatus: [
      {
        isCompleted: false,
        _id: "62a0889c472a199cf0fa5ee3",
        milestone: "61dec62254e4f20016946887",
      },
    ],
    createdAt: "2022-06-08T11:31:39.354Z",
    updatedAt: "2022-06-08T11:31:40.853Z",
    __v: 0,
  },
  project: {
    platforms: ["iOS", "Android", "Backend", "Admin-Panel"],
    attachments: [],
    milestones: [
      "61dec61b54e4f20016946884",
      "61dec62254e4f20016946887",
      "61dec63454e4f2001694688a",
      "61dec63854e4f2001694688d",
      "61dec68c54e4f20016946890",
      "62a9a5f3f754a200164fad50",
    ],
    team: [
      "61543116d8aa0b00169fbfc4",
      "6155621f84835d0016d32155",
      "615abfbe8a99c8001634397b",
    ],
    technologies: ["PHP", "MySQL"],
    status: "Active",
    consumedTime: 0,
    _id: "61d9335060f28500165b4d88",
    title: "Bolo PunditJi",
    credentials: [],
    organisation: "61554220a289af245c8b38f8",
    createdAt: "2022-01-08T06:46:40.615Z",
    updatedAt: "2022-06-15T09:27:15.497Z",
    __v: 26,
  },
  organisation: "61554220a289af245c8b38f8",
  createdBy: "61543116d8aa0b00169fbfc4",
  totalTaxes: "0",
  basicAmount: "19",
  discount: {
    _id: "62a08a3c472a199cf0fa5ffb",
    discountName: "Discount",
    discountedAmount: "0",
  },
  finalAmount: "19",
  serialSequence: 1,
  taxes: [],
  createdAt: "2022-06-08T11:38:36.163Z",
  updatedAt: "2022-06-08T11:38:36.163Z",
  __v: 0,
  noteForClient: "SDSDSDSDSDsd s ds d sd ",
  paymentTerms: "ASDASDADas da sdas da sda",
};
