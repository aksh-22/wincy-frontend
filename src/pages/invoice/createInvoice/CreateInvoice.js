import { createInvoice, getInvoiceNumber } from "api/invoice";
import CustomAutoComplete from "components/CustomAutoComplete";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import CustomSelect from "components/CustomSelect";
import SelectRenderComponent from "components/SelectRenderComponent";
import SelectWithSelect from "components/select/SelectWithSelect";
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
import { capitalizeFirstLetter } from "utils/textTruncate";
import { errorToast } from "utils/toast";
import "./CreateInvoice.scss";
import PopoverSelect from "./popoverSelect/PopoverSelect";
import SelectCustomPopup from "./SelectCustomerPopup";
import prePad from "utils/prePad";
import generateInvoiceNumber from "utils/generateInvoiceNumber";
import { ClipLoader } from "react-spinners";

let selectPlaceHolder = {
  project: "Select Project",
  paymentPhase: "Select Payment Phase",
  // milestone:"Select Milestone",
  subCompany: "Select Sub Company",
  currency: "Currency",
  customer: "Select Customer",
  account: "Select Account",
};

function CreateInvoice() {
  const { currency } = useSelector((state) => state.userReducer?.userData);

  const [invoiceNumberLoading, setInvoiceNumberLoading] = useState(false);

  const { data: projectData, isLoading: projectLoading } =
    useProjects("Active");
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data: accountList, isLoading: accountLoading } = useAccount({
    orgId,
  });

  const getInvoiceList = async (subId) => {
    setInvoiceNumberLoading(true);
    const inV = await getInvoiceNumber(orgId, subId);
    setDetails((prev) => ({ ...prev, sNo: generateInvoiceNumber(inV) }));
    setInvoiceNumberLoading(false);
  };

  // const { data: invoiceList } = useInvoice({ orgId });

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
    paymentPhase: [selectPlaceHolder.paymentPhase],
    // milestone:selectPlaceHolder.milestone,
    subsiduary: selectPlaceHolder.subCompany,
    currency: selectPlaceHolder.currency,
    sNo: "",
    raisedOn: moment().format("MM-DD-YYYY"),
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
        amount: "",
      },
    ],
    tax: [
      {
        taxName: "",
        taxedAmount: "",
      },
    ],
    discountName: "",
    discountedAmount: "",
  });

  const [services, setServices] = useState([]);
  const [tax, setTax] = useState([
    {
      taxName: "",
      taxedAmount: "",
    },
  ]);
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
    if (!details.currency) {
      errorToast("Select currency of your project");
      return;
    }
    const { value, name } = event?.target;
    if (name === "paymentPhase") {
      const isEmpty = value[0] === selectPlaceHolder.paymentPhase;
      let temp = value;

      if (isEmpty) {
        temp.splice(0, 1);
      } else if (!!!value?.length) {
        temp = [selectPlaceHolder.paymentPhase];
      }
      setDetails({
        ...details,
        [name]: temp,
      });
    } else if (name === "project") {
      setDetails({
        ...details,
        [name]: value,
        currency: value.paymentInfo.currency,
      });
    } else if (name === "subsiduary") {
      setDetails({
        ...details,
        [name]: value,
      });
      getInvoiceList(value._id);
    } else {
      setDetails({
        ...details,
        [name]: value,
      });
    }

    error[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };

  const onChangeProject = (_, value) => {
    if (value) {
      setDetails({
        ...details,
        project: value,
        currency: value.paymentInfo.currency,
      });
    } else {
      setDetails({
        ...details,
        project: selectPlaceHolder.project,
        currency: "",
        paymentPhase: [selectPlaceHolder.paymentPhase],
      });
    }
    error.project && setError((prev) => ({ ...prev, project: "" }));
  };

  const onChangeService = (event, index, id) => {
    const { name, value } = event?.target;
    let temp = [...services];
    temp[index] = {
      paymentPhaseId: id,
      amount: value,
    };
    setServices(temp);
    let tempError = error;
    if (error?.services[index]?.amount) {
      tempError.services[index].amount = "";
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
    let tempError = { ...error };
    tempError.customer = "";
    setError(tempError);
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
    if (paymentPhase[0] === selectPlaceHolder.paymentPhase) {
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
    // if (invoiceList?.includes(sNo)) {
    //     isError = true;
    //     tempError = {
    //         ...tempError,
    //         sNo: 'Invoice number is already exist.',
    //     };
    // }

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

    details.paymentPhase?.forEach((el, i) => {
      if (
        (Number(services[i]?.amount) < 1 || !Number(services[i]?.amount)) &&
        el.dueAmount > 0
      ) {
        tempError.services[i] = { amount: "Amount is required" };
        isError = true;
      }
    });

    tax.forEach((el, i) => {
      if (el.taxName && el.taxedAmount < 1) {
        tempError.tax[i] = { taxedAmount: "Tax amount is required" };
        isError = true;
      } else if (!el.taxName && el.taxedAmount > 0) {
        tempError.tax[i] = { taxName: "Tax name is required" };
        isError = true;
      }
    });

    if (details.discountName && Number(details.discountedAmount < 1)) {
      tempError.discountedAmount = "Discount amount is required";
      isError = true;
    } else if (!details.discountName && Number(details.discountedAmount > 0)) {
      tempError.discountName = "Discount name is required";
      isError = true;
    }

    // services?.map((item, index) => {
    //     if (!item?.description?.trim()?.length) {
    //         let isTemp = [...tempError.services];
    //         isError = true;
    //         isTemp[index].description = 'Description field is required.';
    //         tempError = {
    //             ...tempError,
    //             services: isTemp,
    //         };
    //     }

    //     tax?.map((item, index) => {
    //         if (item?.taxName?.trim()?.length && !item?.taxedAmount) {
    //             let isTemp = [...tempError.tax];
    //             isError = true;
    //             isTemp[index].taxedAmount = 'Tax amount field is required.';
    //             tempError = {
    //                 ...tempError,
    //                 tax: isTemp,
    //             };
    //         }

    //         if (!item?.taxName?.trim()?.length && item?.taxedAmount) {
    //             let isTemp = [...tempError.tax];
    //             isError = true;
    //             isTemp[index].taxName = 'Tax name field is required.';
    //             tempError = {
    //                 ...tempError,
    //                 tax: isTemp,
    //             };
    //         }
    //         return null;
    //     });

    //     if (!item?.quantity?.trim()?.length) {
    //         let isTemp = [...tempError.services];
    //         isError = true;
    //         isTemp[index].quantity = 'Quantity field is required.';
    //         tempError = {
    //             ...tempError,
    //             services: isTemp,
    //         };
    //     }

    //     if (!item?.rate?.trim()?.length) {
    //         let isTemp = [...tempError.services];
    //         isError = true;
    //         isTemp[index].rate = 'Rate field is required.';
    //         tempError = {
    //             ...tempError,
    //             services: isTemp,
    //         };
    //     }
    //     return null;
    // });

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

    // delete obj.paymentPhase;

    createInvoice({
      orgId,
      projectId: details?.project?._id,
      data: JSON.parse(JSON.stringify(obj, (k, v) => v || undefined)),
    })
      .then((res) => {
        let invoiceList = query.getQueryData(["invoice", orgId, null, null]);
        invoiceList?.unshift({
          ...res?.invoice,
        });
        try {
          query.setQueryData(["invoice", orgId, null, null], invoiceList);
          goBack();
        } catch (err) {
          // goBack();
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
      subTotal += Number(item?.amount);
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
        <p>Create Invoice</p>
      </div>

      <div className="invoice_container">
        <p className="create_invoice_heading">Project Information</p>

        <div className="d_flex">
          <SelectWithSelect
            options={projectData?.projects ?? []}
            loading={projectLoading}
            className="selectOutlined flex mr-4"
            placeholder={selectPlaceHolder.project}
            labelClassName="normalFont"
            onChange={onChangeProject}
            name="project"
            value={
              Array.isArray(details?.project) ? details?.project : undefined
            }
            errorText={error?.project}
            // labelKey
          />
          {/* <CustomSelect
                        menuItems={projectData?.projects ?? []}
                        selectRenderComponent={<SelectRenderComponent />}
                        menuRenderComponent={<SelectRenderComponent />}
                        handleChange={onHandleChange}
                        value={
                            details?.project?.title ??
                            selectPlaceHolder?.project
                        }
                        placeholder={selectPlaceHolder.project}
                        name='project'
                        errorText={error?.project}
                        variant={'outlined'}
                        labelClassName={'normalFont'}
                        containerClassName='selectOutlined flex mr-4'
                    /> */}
          <CustomSelect
            menuItems={paymentPhaseData ?? []}
            selectRenderComponent={<SelectRenderComponent />}
            menuRenderComponent={<SelectRenderComponent />}
            multiple
            handleChange={onHandleChange}
            value={details?.paymentPhase}
            name="paymentPhase"
            errorText={error?.paymentPhase}
            variant={"outlined"}
            labelClassName={"normalFont"}
            containerClassName="selectOutlined flex"
            isLoading={paymentPhaseLoading}
            placeholder={selectPlaceHolder.paymentPhase}
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
              {invoiceNumberLoading && (
                <div>
                  <ClipLoader
                    loading={invoiceNumberLoading}
                    color="red"
                    size={26}
                  />
                </div>
              )}
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

          {/* <CustomSelect
                        placeholder={selectPlaceHolder.currency}
                        menuItems={currency ?? []}
                        errorText={error?.currency}
                        value={details?.currency}
                        name='currency'
                        variant={'outlined'}
                        handleChange={onHandleChange}
                        labelClassName={'normalFont'}
                        containerClassName='selectOutlined flex'
                    /> */}
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
                let tempError = { ...error };
                tempError.raisedOn = "";
                setError(tempError);
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
                let tempError = { ...error };
                tempError.dueDate = "";
                setError(tempError);
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
          {/* <p className='textCenter'>Quantity</p> */}
          <p className="textCenter">Due Amount</p>
          <p className="textCenter">Amount</p>
        </div>
        {details.paymentPhase[0].title ? (
          details.paymentPhase?.map((item, index) => (
            <div className="invoice_service_row" key={index}>
              <div>
                <p>{item?.title}</p>
                <span
                  style={{
                    fontSize: 15,
                    color: "var(--progressBarBgColor)",
                  }}
                >
                  {item?.description}
                </span>
              </div>
              <p className="alignCenter">
                {currencySymbol(details?.currency)}
                <span className="textEllipse">{item.dueAmount}</span>
              </p>
              <CustomInput
                placeholder={"0"}
                className="mr-2"
                value={item?.rate}
                name="rate"
                onChange={(event) => onChangeService(event, index, item._id)}
                error={error?.services[index]?.amount}
              />
            </div>
          ))
        ) : (
          <p className="textCenter m-2">Select a payment phase</p>
        )}
        {/* {services?.length > 1 && (
                    <CustomButton
                        className={'mr-1'}
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
                    backgroundColor={'var(--yellow)'}
                    onClick={() => {
                        let temp = [...services];
                        let tempError = [...error.services];
                        temp.push({
                            rate: '',
                            quantity: '1',
                            description: '',
                        });
                        tempError.push({
                            rate: '',
                            quantity: '',
                            description: '',
                        });
                        setError({
                            ...error,
                            services: [...tempError],
                        });
                        setServices(temp);
                    }}
                >
                    Add Service
                </CustomButton> */}
      </div>
      <div className="invoiceTotal mt-2">
        <div className="alignCenter">
          <div style={{ flex: 0.7 }} />
          <div className="alignCenter" style={{ flex: 0.3 }}>
            <p className="flex ff_Lato_Bold">Sub Total</p>
            <p className="amountText">
              {currencySymbol(details?.currency)}
              {total?.subTotal?.toFixed(2)}{" "}
            </p>
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
                error={error.discountName}
              />
            </div>
            {/* <CustomInput
                                type='number'
                                className={'mr-2'}
                                placeholder='0.00'
                                value={details?.discountedAmount}
                                name='discountedAmount'
                                onChange={onHandleChange}
                                error={error.discountedAmount}
                            /> */}
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
                style={{
                  background: "transparent",
                  color: "#363D68",
                }}
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
            <p className="amountText">
              {currencySymbol(details?.currency)}
              {total?.total?.toFixed(2)}{" "}
            </p>
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

export default CreateInvoice;
