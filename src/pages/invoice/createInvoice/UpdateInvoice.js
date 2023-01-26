

import { createInvoice, updateInvoice } from "api/invoice";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import CustomSelect from "components/CustomSelect";
import SelectRenderComponent from "components/SelectRenderComponent";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useAccount } from "react-query/invoice/account/useAccount";
import { useCustomerList } from "react-query/invoice/customer/useCustomerList";
import { useSubsidiaryList } from "react-query/invoice/subsidiary/useSubsidiaryList";
import { useInvoice } from "react-query/invoice/useInvoice";
import { usePaymentPhase } from "react-query/invoice/usePaymentPhase";
import { useProjects } from "react-query/projects/useProjects";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { currencySymbol } from "utils/currency";
import { dateCondition } from "utils/dateCondition";
import { capitalizeFirstLetter } from "utils/textTruncate";
import { errorToast } from "utils/toast";
import "./CreateInvoice.scss";
import PopoverSelect from "./popoverSelect/PopoverSelect";
import SelectCustomPopup from "./SelectCustomerPopup";

let selectPlaceHolder = {
  project: "Select Project",
  paymentPhase: "Select Payment Phase",
  // milestone:"Select Milestone",
  subCompany: "Select Sub Company",
  currency: "Currency",
  customer: "Select Customer",
  account: "Select Account",
};

function UpdateInvoice() {
    const {location} = useHistory();
  const { currency } = useSelector((state) => state.userReducer?.userData);

  const { data: projectData } = useProjects("Active");
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data: accountList, isLoading: accountLoading } = useAccount({
    orgId,
  });
  const { data: invoiceList } = useInvoice({ orgId });

  //   useEffect(() => {

  // if(invoiceList){

  //   setDetails({
  //     ...details,
  // sNo : invoiceList?.length ? `PS/GST/${moment(new Date()).format("DD-YY")}/`:  `PS/GST/${moment(new Date()).format("DD-YY")}/001`
  //   })
  // }

  //   }, [invoiceList])

  const [details, setDetails] = useState({
    project: selectPlaceHolder.project,
    paymentPhase: selectPlaceHolder.paymentPhase,
    // milestone:selectPlaceHolder.milestone,
    subsiduary: selectPlaceHolder.subCompany,
    currency: selectPlaceHolder.currency,
    sNo: "",
    raisedOn: "",
    dueDate: "",
    totalAmount: "",
    customer: selectPlaceHolder.customer,
    noteForClient: "",
    paymentTerms: "",
    discountName: "",
    discountedAmount: "",
    account: selectPlaceHolder.account,
  });
  const [error, setError] = useState({
    project: "",
    paymentPhase: "",
    currency: "",
    sNo: "",
    customer: "",
    raisedOn: "",
    account: "",
    dueDate: "",
    services: [
      {
        rate: "",
        quantity: "",
        description: "",
      },
    ],
    tax: [
      {
        taxName: "",
        taxedAmount: "",
      },
    ],
  });

  const [services, setServices] = useState([
    {
      rate: "",
      quantity: "1",
      description: "",
    },
  ]);
  const [tax, setTax] = useState([
    {
      taxName: "",
      taxedAmount: "",
    },
  ]);

  useEffect(() => {
    let temp = location?.state;
    setDetails({
        ...details,
        sNo: temp?.sNo,
        dueDate:moment(dateCondition(temp?.dueDate) , "DD-MM-YYYY").toDate(),
        currency:temp?.currency,
        raisedOn : moment(dateCondition(temp?.raisedOn) , "DD-MM-YYYY").toDate(),
        project : temp?.project,
        paymentPhase:temp?.paymentPhase,
        subsiduary:temp?.subsiduary,
        account:temp?.account,
        customer:{
            ...temp?.customer,
            address : temp?.billTo
        },
        discountName : temp?.discount?.discountName,
        discountedAmount : temp?.discount?.discountedAmount,
        paymentTerms : temp?.paymentTerms??"",
        noteForClient : temp?.noteForClient??""
    })
    setServices(temp?.services)
    setTax(temp?.taxes?.length ? temp?.taxes : [
        {
          taxName: "",
          taxedAmount: "",
        },
      ]);
         setError({
        ...error,
        tax : temp?.taxes?.length ?  temp?.taxes?.map((_) => ({
            taxedAmount :"",
            taxName : ""
        })) : [{
            taxedAmount :"",
            taxName : ""
        }],
        services:temp?.services?.length ? temp?.services?.map((_) => ({
            rate: "",
            quantity: "",
            description: "",
        })) : [
            {
              rate: "",
              quantity: "",
              description: "",
            },
          ],
      })
  }, [location])
  


  const { data: paymentPhaseData, isLoading: paymentPhaseLoading } =
    usePaymentPhase({
      orgId,
      projectId:
        details?.project === selectPlaceHolder.project
          ? null
          : details?.project?._id,
    });
  const { data: subsidiaryListData, isLoading: subsidiaryListLoading } =
    useSubsidiaryList({ orgId });
  const { data: customerList } = useCustomerList({ orgId });

  const onHandleChange = (event) => {
    const { value, name } = event?.target;
    setDetails({
      ...details,
      [name]: value,
    });

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onChangeService = (event, index) => {
    const { name, value } = event?.target;
    let temp = [...services];
    temp[index][name] = value;
    setServices(temp);
    let tempError = error;
    if (error?.services[index][name]) {
      tempError.services[index][name] = "";
      setError({
        ...tempError,
      });
    }
  };

  const onHandleCustomerChange = (customerData) => {
    setDetails({
      ...details,
      customer: customerData,
    });
  };

  const onHandleTaxChange = (event, index) => {
    const { name, value } = event?.target;
    let temp = [...tax];
    temp[index][name] = value;
    setTax(temp);

    let tempError = error;
    if (error?.tax[index][name]) {
      tempError.tax[index][name] = "";
      setError({
        ...tempError,
      });
    }
  };

  const onValidate = () => {
    const {
      project,
      paymentPhase,
      sNo,
      subsiduary,
      currency,
      raisedOn,
      dueDate,
      customer,
      account,
    } = details;
    let tempError = { ...error };
    let isError = false;
    if (project === selectPlaceHolder.project) {
      isError = true;
      tempError = {
        ...tempError,
        project: "Project is required.",
      };
    }
    if (paymentPhase === selectPlaceHolder.paymentPhase) {
      isError = true;
      tempError = {
        ...tempError,
        paymentPhase: "Payment phase is required.",
      };
    }

    if (!(sNo + "")?.trim()?.length) {
      isError = true;
      tempError = {
        ...tempError,
        sNo: "Invoice number is required.",
      };
    }
    if (invoiceList?.find((item) => item?.sNo === sNo) && location?.state?.sNo !== sNo) {
      isError = true;
      tempError = {
        ...tempError,
        sNo: "Invoice number is already exist.",
      };
    }

    if (subsiduary === selectPlaceHolder.subCompany) {
      isError = true;
      tempError = {
        ...tempError,
        subsiduary: "Sub company field is required.",
      };
    }

    if (currency === selectPlaceHolder.currency) {
      isError = true;
      tempError = {
        ...tempError,
        currency: "Currency field is required.",
      };
    }

    if (account === selectPlaceHolder.account) {
      isError = true;
      tempError = {
        ...tempError,
        account: "Account field is required.",
      };
    }

    if (raisedOn === "") {
      isError = true;
      tempError = {
        ...tempError,
        raisedOn: "Invoice date field is required.",
      };
    }

    if (dueDate === "") {
      isError = true;
      tempError = {
        ...tempError,
        dueDate: "Due date field is required.",
      };
    }

    if (customer === selectPlaceHolder.customer) {
      isError = true;
      tempError = {
        ...tempError,
        customer: "Customer field is required.",
      };
    }

    services?.map((item, index) => {
      if (!item?.description?.trim()?.length) {
        let isTemp = [...tempError.services];
        isError = true;
        isTemp[index].description = "Description field is required.";
        tempError = {
          ...tempError,
          services: isTemp,
        };
      }

      tax?.map((item, index) => {
        if (item?.taxName?.trim()?.length && !item?.taxedAmount) {
          let isTemp = [...tempError.tax];
          isError = true;
          isTemp[index].taxedAmount = "Tax amount field is required.";
          tempError = {
            ...tempError,
            tax: isTemp,
          };
        }

        if (!item?.taxName?.trim()?.length && item?.taxedAmount) {
          let isTemp = [...tempError.tax];
          isError = true;
          isTemp[index].taxName = "Tax name field is required.";
          tempError = {
            ...tempError,
            tax: isTemp,
          };
        }
        return null;
      });

      if (!item?.quantity?.trim()?.length) {
        let isTemp = [...tempError.services];
        isError = true;
        isTemp[index].quantity = "Quantity field is required.";
        tempError = {
          ...tempError,
          services: isTemp,
        };
      }

      if (!item?.rate?.trim()?.length) {
        let isTemp = [...tempError.services];
        isError = true;
        isTemp[index].rate = "Rate field is required.";
        tempError = {
          ...tempError,
          services: isTemp,
        };
      }
      return null;
    });

    setError(tempError);
    if (isError) {
      errorToast("Please fill error message field.");
    }
    return isError;
  };
  const query = useQueryClient();
  const { goBack } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = () => {
    if (onValidate()) {
      return null;
    }

    let obj = {
      ...details,
      services: services,
      billTo: details?.customer?.address,
      account: details?.account?._id,
      subsiduary: details?.subsiduary?._id,
      customer: details?.customer?._id,
      sNo: details?.sNo + "",
    };

    let tempTax = tax?.filter((item) => item?.taxName && item?.taxedAmount);

    if (tempTax?.length) {
      obj.taxes = tempTax;
    }

    if (details?.discountedAmount) {
      obj = {
        ...obj,
        discountedAmount: Number(details.discountedAmount),
      };
    }
    // tax?.map((item) => {
    //   if(item?.taxName && item?.taxedAmount){
    //     tempTax.push(item)
    //   }
    //   return null;
    // })
    setIsLoading(true);

    updateInvoice({
      orgId,
      projectId: details?.project?._id,
      paymentPhaseId: details?.paymentPhase?._id,
      invoiceId : location?.state?._id,
      data: JSON.parse(JSON.stringify(obj, (k, v) => v || undefined)),
    })
      .then((res) => {
        let invoiceList = query.getQueryData(["invoice", orgId , null, null]);
        invoiceList?.unshift({
          ...res?.invoice,
        });
        try {
          query.setQueryData(["invoice", orgId, null, null], invoiceList);
          goBack();
        } catch (err) {
          goBack();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const [total, setTotal] = useState({
    subTotal: 0,
    total: 0,
  });
  useEffect(() => {
    let subTotal = 0;
    services?.map((item) => {
      subTotal += Number(item?.quantity) * Number(item?.rate).toFixed(2);
      return null;
    });
    let totalTax = 0;
    tax?.map((item) => (totalTax += Number(item?.taxedAmount)));
    setTotal({
      subTotal,
      total: totalTax + subTotal - Number(details?.discountedAmount),
    });
  }, [services, tax, details?.discountedAmount]);

  return (
    <div className="create_invoice_container">
      <div className="alignCenter flex">
        <p>Home</p>
        <p>&nbsp; {">"}&nbsp; </p>
        <p>Invoice</p>
        <p>&nbsp; {">"}&nbsp; </p>
        <p>Update Invoice</p>
      </div>

      <div className="invoice_container">
        <p className="create_invoice_heading">Project Information</p>

        <div className="d_flex">
          <CustomSelect
            menuItems={projectData?.projects ?? []}
            selectRenderComponent={<SelectRenderComponent />}
            menuRenderComponent={<SelectRenderComponent />}
            handleChange={onHandleChange}
            value={details?.project?.title ?? selectPlaceHolder?.project}
            placeholder={selectPlaceHolder.project}
            name="project"
            errorText={error?.project}
            variant={"outlined"}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex mr-4"
          />
          <CustomSelect
            menuItems={paymentPhaseData ?? []}
            selectRenderComponent={<SelectRenderComponent />}
            menuRenderComponent={<SelectRenderComponent />}
            handleChange={onHandleChange}
            value={details?.paymentPhase}
            placeholder={selectPlaceHolder.paymentPhase}
            name="paymentPhase"
            errorText={error?.paymentPhase}
            variant={"outlined"}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex"
            isLoading={paymentPhaseLoading}
          />
          <div className="flex" />
        </div>

        {/* <div className="mt-2 alignCenter">
        <div className=" flex mr-4" />

          <PopoverSelect 
          popUpComponent={<SelectMilestonePopup />}
          className=" flex "

          />
                    <div className="flex" />
        </div> */}
      </div>

      <div className="invoice_container">
        <p className="create_invoice_heading">Payment Information</p>

        <div className="d_flex flexWrap">
          <div className="flex mr-4">
            <div className="invoice_number" style={{ marginRight: 0 }}>
              <div className="invoice_number_back">#</div>

              <input
                type="text"
                placeholder="Invoice Number"
                name="sNo"
                value={details?.sNo}
                onChange={onHandleChange}
                
              />
            </div>
            <p
              style={{
                color: "var(--red)",
                fontSize: 12,
              }}
            >
              {error?.sNo}
            </p>
          </div>

          <CustomSelect
            menuItems={subsidiaryListData ?? []}
            selectRenderComponent={<SelectRenderComponent />}
            menuRenderComponent={<SelectRenderComponent />}
            handleChange={onHandleChange}
            value={details?.subsiduary}
            placeholder={selectPlaceHolder.subCompany}
            name="subsiduary"
            errorText={error?.subsiduary}
            variant={"outlined"}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex mr-4"
            isLoading={subsidiaryListLoading}
          />
          <CustomSelect
            placeholder={selectPlaceHolder.currency}
            menuItems={currency ?? []}
            errorText={error?.currency}
            value={details?.currency}
            name="currency"
            variant={"outlined"}
            handleChange={onHandleChange}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex"
          />
        </div>

        <div className="alignCenter mt-2">
          <div className="flex mr-4">
            <CustomInput
              type="date"
              className={"flex"}
              placeholder="Invoice Date"
              value={details?.raisedOn}
              onDateChange={(value) => {
                setDetails({
                  ...details,
                  raisedOn: value,
                });
              }}
              error={error?.raisedOn}
            />
          </div>

          <div className="flex mr-4">
            <CustomInput
              type="date"
              className={"flex"}
              placeholder="Due Date"
              value={details?.dueDate}
              onDateChange={(value) => {
                setDetails({
                  ...details,
                  dueDate: value,
                });
              }}
              error={error?.dueDate}
            />
          </div>

          <div className="flex">
            <CustomSelect
              menuItems={accountList ?? []}
              selectRenderComponent={
                <SelectRenderComponent objectKey={"accountName"} />
              }
              menuRenderComponent={
                <SelectRenderComponent objectKey={"accountName"} />
              }
              handleChange={onHandleChange}
              value={details?.account}
              placeholder={selectPlaceHolder.account}
              name="account"
              errorText={error?.account}
              variant={"outlined"}
              labelClassName={"normalFont"}
              containerClassName="selectOutlined flex "
              isLoading={accountLoading}
            />
          </div>
        </div>

        {/* <div className="alignCenter mt-2">
        <CustomSelect
            menuItems={accountList ?? []}
            selectRenderComponent={<SelectRenderComponent objectKey={"accountName"}/>}
            menuRenderComponent={<SelectRenderComponent objectKey={"accountName"}/>}
            handleChange={onHandleChange}
            value={details?.account}
            placeholder={selectPlaceHolder.account}
            name="account"
            errorText={error?.account}
            variant={"outlined"}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex mr-4"
          />
          <div className="flex mr-4"/>
          <div className="flex"/>

          </div> */}
      </div>

      <div className="invoice_container">
        <p className="create_invoice_heading">Client Information</p>
        <div className="alignCenter mb-2">
          <PopoverSelect
            className="selectOutlined flex mr-4"
            value={details?.customer?.fullName}
            placeholder={selectPlaceHolder.customer}
            error={error?.customer}
            popUpComponent={
              <SelectCustomPopup
                data={customerList}
                onChange={onHandleCustomerChange}
                selectedValue={details?.customer}
              />
            }
          />
          <div className="flex mr-4" />
          <div className="flex" />
        </div>
        <CustomInput
          type="textarea"
          placeholder={"Bill To"}
          value={details?.customer?.address}
          onChange={(event) => {
            setDetails({
              ...details,
              customer: {
                ...details?.customer,
                address: event?.target?.value,
              },
            });
          }}
          // className="mb-2"

          // onChange={onHandleChange}
          // name={"customer"}
          // value={details?.customer}
        />
      </div>

      <div className="invoice_service_container">
        <div className="invoice_service_header">
          <p>Services</p>
          <p className="textCenter">Quantity</p>
          <p className="textCenter">Rate</p>
          <p className="textCenter pl-1">Amount</p>
        </div>

        {services?.map((item, index) => (
          <div className="invoice_service_row" key={index}>
            <CustomInput
              placeholder={"Description of service"}
              className="mr-2"
              value={item?.description}
              name="description"
              onChange={(event) => onChangeService(event, index)}
              error={error?.services[index]?.description}
            />
            <CustomInput
              placeholder={"Quantity"}
              className="mr-2"
              value={item?.quantity}
              name="quantity"
              onChange={(event) => onChangeService(event, index)}
              error={error?.services[index]?.quantity}
            />
            <CustomInput
              placeholder={"0"}
              className="mr-2"
              value={item?.rate}
              name="rate"
              onChange={(event) => onChangeService(event, index)}
              error={error?.services[index]?.rate}
            />

            <p className="alignCenter textEllipse">
            {currencySymbol(details?.currency)}
              <span className="textEllipse">
                {Number(item?.quantity) * Number(item?.rate).toFixed(2)}
              </span>
            </p>
          </div>
        ))}

        {services?.length > 1 && (
          <CustomButton
            className={"mr-1"}
            onClick={() => {
              let temp = [...services];
              temp.pop();
              let tempError = [...error.services];
              tempError.pop();
              setError({
                ...error,
                services: tempError,
              });
              setServices(temp);
            }}
          >
            Remove
          </CustomButton>
        )}
        <CustomButton
          backgroundColor={"var(--yellow)"}
          onClick={() => {
            let temp = [...services];
            let tempError = [...error.services];
            temp.push({
              rate: "",
              quantity: "1",
              description: "",
            });
            tempError.push({
              rate: "",
              quantity: "",
              description: "",
            });
            setError({
              ...error,
              services: [...tempError],
            });
            setServices(temp);
          }}
        >
          Add Service
        </CustomButton>
      </div>

      <div className="invoiceTotal mt-2">
        <div className="alignCenter">
          <div style={{ flex: 0.7 }} />
          <div className="alignCenter" style={{ flex: 0.3 }}>
            <p className="flex ff_Lato_Bold">Sub Total</p>
            <p className="amountText">{currencySymbol(details?.currency)}{total?.subTotal?.toFixed(2)} </p>
          </div>
        </div>

        {tax?.map((item, index) => (
          <div className="alignCenter mt-2" key={index}>
            <div className="flex" />
            <div className="d_flex">
              <div style={{ flex: 0.3 }}>
                <CustomInput
                  className={"mr-2"}
                  placeholder="Tax"
                  value={item?.taxName}
                  onChange={(event) => onHandleTaxChange(event, index)}
                  name="taxName"
                  error={error?.tax[index].taxName}
                />
              </div>
              <div>
                <div className="invoice_number">
                  <input
                    type="number"
                    placeholder={`0.00`}
                    value={item?.taxedAmount}
                    onChange={(event) => onHandleTaxChange(event, index)}
                    name="taxedAmount"
                    onWheel={(event) => event.currentTarget.blur()}
                    min={0}
                  />
                  <div
                    className="invoice_number_back cursorPointer"
                    onClick={() => {
                      if (!(item?.taxedAmount && item?.taxName)) return null;
                      let temp = [...tax];
                      let tempError = [...error?.tax];
                      if (index === tax?.length - 1) {
                        temp.push({
                          taxedAmount: "",
                          taxName: "",
                        });
                        tempError.push({
                          taxedAmount: "",
                          taxName: "",
                        });
                      } else {
                        temp.splice(index, 1);
                        tempError.splice(index, 1);
                      }
                      setError({
                        ...error,
                        tax: tempError,
                      });
                      setTax(temp);
                    }}
                    style={{
                      cursor:
                        item?.taxedAmount && item?.taxName
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {index === tax?.length - 1 ? "+" : "-"}
                  </div>
                </div>
                {error?.tax[index].taxedAmount && (
                  <p
                    style={{
                      color: "var(--red)",
                      fontSize: 12,
                    }}
                  >
                    {error?.tax[index].taxedAmount}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="alignCenter my-2">
          <div className="flex" />
          <div className="alignCenter">
            <div style={{ flex: 0.3 }}>
              <CustomInput
                className={"mr-2"}
                placeholder="Discount"
                value={details?.discountName}
                name="discountName"
                onChange={onHandleChange}
              />
            </div>
            <div className="invoice_number">
              <input
                type="number"
                placeholder="0.00"
                value={details?.discountedAmount}
                name="discountedAmount"
                onChange={onHandleChange}
                onWheel={(event) => event.currentTarget.blur()}
                min={0}
              />
              <div
                className="invoice_number_back"
                style={{ background: "transparent", color: "#363D68" }}
              >
                +
              </div>
            </div>
          </div>
        </div>

        <div className="alignCenter">
          <div style={{ flex: 0.7 }} />
          <div className="alignCenter" style={{ flex: 0.3 }}>
            <p className="flex ff_Lato_Bold">Total</p>
            <p className="amountText">{currencySymbol(details?.currency)}{total?.total?.toFixed(2)} </p>
          </div>
        </div>
      </div>

      <div className="alignCenter flexWrap">
        <CustomInput
          type="textarea"
          placeholder={"Notes For Clients"}
          className="flex mb-2"
          onChange={onHandleChange}
          name={"noteForClient"}
          value={details?.noteForClient}
        />
        <CustomInput
          type="textarea"
          placeholder={"Payment Terms"}
          className="flex"
          onChange={onHandleChange}
          name={"paymentTerms"}
          value={details?.paymentTerms}
        />
      </div>

      <div className="alignCenter justifyContent_end my-2">
        {/* <CustomButton className={"mr-2"}>
          <p>Preview</p>
        </CustomButton> */}

        <CustomButton
          backgroundColor={"var(--yellow)"}
          onClick={onSubmit}
          loading={isLoading}
        >
          <p>Save</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default UpdateInvoice;
