import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import CompanyLogo from 'assets/images/pairroxz-logo white.png';
import InputTextClickAway from 'components/clickawayComponent/InputTextClickAway';
import CommonDelete from 'components/CommonDelete';
import CommonDialog from 'components/CommonDialog';
import CustomButton from 'components/CustomButton';
import IosIcon from 'components/icons/IosIcon';
import Loading from 'components/loading/Loading';
import NoData from 'components/NoData';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import React, { useEffect, useState } from 'react';
import { useTransaction } from 'react-query/invoice/transaction/useTransaction';
import { useViewInvoice } from 'react-query/invoice/useViewInvoice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import { currencySymbol } from 'utils/currency';
import { dateCondition } from 'utils/dateCondition';
import { capitalizeFirstLetter } from 'utils/textTruncate';
import AddTransaction from './AddTransaction';
import DownloadInvoice from './DownloadInvoice';
import TransactionRow from './TransactionRow';
import './ViewInvoice.scss';
import { useDeleteInvoice } from 'react-query/invoice/useDeleteInvoice';
function ViewInvoice(props) {
    const ref = React.createRef();
    const { push } = useHistory();
    const orgId = useSelector(
        (state) => state.userReducer?.selectedOrganisation?._id
    );
    const { data, isLoading, isError, refetch } = useViewInvoice({
        orgId,
        invoiceId: props?.match?.params?.invoiceId,
    });

    const { data: transactionData, isLoading: transactionLoading } =
        useTransaction({ orgId, invoiceId: props?.match?.params?.invoiceId });
    const [amountDetails, setAmountDetails] = useState({
        subTotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        amountPaid: 0,
        balanceDue: 0,
    });
    useEffect(() => {
        if (data) {
            // let taxAmount = 0;
            // data?.taxes((item) => {
            //   taxAmount+=Number(item?.taxedAmount)
            //   return null;
            // })
            // const subTotal = data
            console.log('data', data);
            setAmountDetails({
                ...amountDetails,
                subTotal: Number(data?.basicAmount),
                tax: Number(data?.totalTaxes || 0),
                discount: Number(data?.discount?.discountedAmount || 0),
                amountPaid: Number(data?.paidAmount || 0),
                total: Number(data?.finalAmount || 0),
                balanceDue:
                    Number(data?.finalAmount || 0) -
                    Number(data?.paidAmount || 0),
            });
        }
    }, [data]);

    const { mutate: deleteInvoiceMutate, isLoading: isDeleteLoading } =
        useDeleteInvoice();
    const deleteInvoice = () => {};

    return isError ? (
        <NoData error />
    ) : isLoading ? (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Loading
                loadingType={'spinner'}
                backgroundColor={'#FFF'}
                size={32}
            />
        </div>
    ) : (
        <>
            <div className='view_invoice_container' ref={ref}>
                <div className='d_flex my-3'>
                    <div className='flex'>
                        <div className='alignCenter flex'>
                            <p>Home</p>
                            <p>&nbsp; {'>'}&nbsp; </p>
                            <p>Invoice</p>
                        </div>
                        <img
                            src={CompanyLogo}
                            alt='noImage'
                            className='companyLogo mt-3'
                        />
                    </div>

                    <div style={{ flex: 0.3 }}>
                        <div className='d_flex justifyContent_end mb-1'>
                            {/* <PDFViewer height={600} width={600}>
                                <DownloadInvoice item={data} />
                            </PDFViewer> */}
                            <PDFDownloadLink
                                document={<DownloadInvoice item={data} />}
                                fileName={`Invoice # ${data?.sNo}.pdf`}
                            >
                                {({ blob, url, loading, error }) =>
                                    loading ? (
                                        'Loading document...'
                                    ) : (
                                        <CustomButton
                                            backgroundColor={'var(--yellow)'}
                                            className={
                                                'view_invoice_container_button'
                                            }
                                        >
                                            <p>Download Invoice</p>
                                        </CustomButton>
                                    )
                                }
                            </PDFDownloadLink>

                            <CustomButton
                                onClick={() =>
                                    push({
                                        pathname: `/main/invoice/updateInvoice`,
                                        state: data,
                                    })
                                }
                                className={'view_invoice_container_button ml-1'}
                            >
                                <p>Edit</p>
                            </CustomButton>
                            <CommonDelete
                                type={'text'}
                                mutate={deleteInvoiceMutate}
                                isLoading={isDeleteLoading}
                                data={{
                                    orgId,
                                    invoiceId: data?._id,
                                    projectId: data?.project?._id,
                                }}
                            />
                        </div>
                        {/* <p className="companyAddress">
              49, Chhatrasal Nagar, Nandpuri Colony, Malviya Nagar, Jaipur,
              Rajasthan 302017
            </p> */}
                    </div>
                </div>

                <div className='d_flex invoice_details'>
                    <div className='flex'>
                        <p className='font20'>Invoice Number</p>
                        <p className='font25'>{`#${data?.sNo}`}</p>
                        <p className='font20'>
                            Invoice Date:
                            {dateCondition(data?.raisedOn, 'DD MMM YYYY')}
                        </p>
                        <p className='font20'>
                            Due Date:
                            {dateCondition(data?.dueDate, 'DD MMM YYYY')}
                        </p>
                    </div>

                    <div className='billingAddressContainer'>
                        <p className='font20'>Billed To</p>
                        <p className='font18 my-1' style={{ textAlign: 'end' }}>
                            {data?.billTo}
                        </p>
                        <p className='font18'>{data?.customer?.email}</p>
                    </div>
                </div>

                <div className=' invoice_box'>
                    <div className='alignCenter mb-2'>
                        <div className='invoice_box_item'>
                            <p>Project</p>
                            <p>{data?.project?.title}</p>
                        </div>

                        <div className='invoice_box_item'>
                            <p>Payment Phase</p>
                            <p>{data?.paymentPhase?.title}</p>
                        </div>
                    </div>

                    <div className='alignCenter '>
                        <div className='invoice_box_item'>
                            <p>Currency</p>
                            <p>{data?.currency}</p>
                        </div>

                        {data?.paymentPhase?.milestones?.length > 0 && (
                            <div className='invoice_box_item'>
                                <p>Milestone</p>
                                <p>
                                    {data?.paymentPhase?.milestones
                                        ?.map((row) =>
                                            capitalizeFirstLetter(row?.title)
                                        )
                                        .join()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className='alignCenter my-4 '>
                        <p className='flex font25'>Service Details</p>
                        <CommonDialog
                            actionComponentButton={
                                <CustomButton>
                                    <p>Add Transaction</p>
                                </CustomButton>
                            }
                            modalTitle='Add Transaction'
                            content={
                                <AddTransaction
                                    orgId={orgId}
                                    invoiceId={props?.match?.params?.invoiceId}
                                    refetch={refetch}
                                />
                            }
                            minWidth={'50vw'}
                        />
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <td>Title</td>
                                {/* <td>Description</td> */}
                                {/* <td>Due Amount</td> */}
                                <td>Amount</td>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.services?.map(
                                ({ paymentPhaseId: item, amount }) =>
                                    item ? (
                                        <tr className='' key={item?._id}>
                                            <td className='service_details_row'>
                                                {/* {item.title} */}
                                                <div>
                                                    <p>{item?.title}</p>
                                                    <span
                                                        style={{
                                                            fontSize: 15,
                                                            color: 'var(--progressBarBgColor)',
                                                        }}
                                                    >
                                                        {item?.description}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* <td className='service_details_row'>
                                            {item?.description}
                                        </td> */}
                                            <td className='service_details_row'>
                                                {console.log('item', amount)}
                                                {currencySymbol(data?.currency)}
                                                {amount}
                                            </td>
                                            {/* <td className='service_details_row'>
                                                {currencySymbol(data?.currency)}
                                                {item?.amount}
                                            </td> */}
                                        </tr>
                                    ) : null
                            )}
                        </tbody>
                    </table>

                    {transactionLoading ? (
                        <TableRowSkeleton count={4} />
                    ) : (
                        transactionData?.length > 0 && (
                            <div className='my-4'>
                                <p className='font25'>Transaction List</p>
                                <div className='invoice_transaction_header_row'>
                                    <div className='d_flex'>
                                        <div style={{ width: 10 }} />
                                        <p style={{ marginLeft: 10 }}>
                                            Payment Date
                                        </p>
                                    </div>
                                    <p>Gateway</p>
                                    <p>Amount</p>
                                    <p>Gateway Fees</p>
                                </div>

                                {transactionData?.map((item, index) => (
                                    <TransactionRow
                                        key={item?._id}
                                        item={item}
                                        orgId={orgId}
                                        index={index}
                                        refetch={refetch}
                                    />
                                    //                   <div className="invoice_transaction_row_item" key={item?._id}>
                                    //                     <div className="d_flex">
                                    //                       <div className="invoice_item_transaction_sideLine" />
                                    //                       <InputTextClickAway
                                    //                         value={dateCondition(item?.date, "DD MMM YYYY")}
                                    //                         disabled
                                    //                         className={"alignCenter"}
                                    //                       />
                                    //                     </div>
                                    //                     <InputTextClickAway
                                    //                       value={item?.gateway}
                                    //                       disabled
                                    //                       className={"alignCenter"}
                                    //                       textClassName="textEllipse"
                                    //                       paddingLeftNone
                                    //                     />
                                    //                     <InputTextClickAway
                                    //                       value={item?.amount}
                                    //                       disabled
                                    //                       className={"alignCenter"}
                                    //                       textClassName="textEllipse"
                                    //                       paddingLeftNone
                                    //                     />
                                    //                     <InputTextClickAway
                                    //                       value={item?.description}
                                    //                       disabled
                                    //                       className={"alignCenter textEllipse"}
                                    //                       textClassName="textEllipse"
                                    //                       paddingLeftNone
                                    //                     />
                                    // <LightTooltip title="Info" arrow>

                                    // <div className="alignCenter cursorPointer justifyContent_center" onClick={() => {}}>
                                    //                   <IosIcon name="info"/>
                                    //                     </div>
                                    // </LightTooltip>
                                    //                     </div>
                                ))}
                            </div>
                        )
                    )}

                    <div className=''>
                        <div className='invoiceFooter'>
                            <div style={{ flex: 0.5 }}>
                                <div className='alignCenter invoiceFooter_left'>
                                    <p className='mr-5'>Sub Total</p>
                                    <p>
                                        {currencySymbol(data?.currency)}
                                        {amountDetails?.subTotal?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className='alignCenter invoiceFooter_right flex'>
                                <p>Total</p>
                                <p>
                                    {currencySymbol(data?.currency)}
                                    {amountDetails?.total?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className='invoiceFooter'>
                            <div style={{ flex: 0.5 }}>
                                {data.taxes.map((el, i) => (
                                    <div style={{ flex: 0.5 }}>
                                        <div className='alignCenter invoiceFooter_left'>
                                            <p className='mr-5'>{el.taxName}</p>
                                            <p>
                                                {currencySymbol(data?.currency)}
                                                {Number(
                                                    el?.taxedAmount
                                                )?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='alignCenter invoiceFooter_right flex'>
                                <p>Amount Paid</p>
                                <p>
                                    {currencySymbol(data?.currency)}
                                    {amountDetails?.amountPaid?.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className='invoiceFooter'>
                            <div style={{ flex: 0.5 }}>
                                <div className='alignCenter invoiceFooter_left '>
                                    <p>{data?.discount?.discountName}</p>
                                    <p>
                                        - {currencySymbol(data?.currency)}
                                        {amountDetails?.discount?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className='alignCenter invoiceFooter_right flex balanceDue'>
                                <p>Balance Due</p>
                                <p>
                                    {currencySymbol(data?.currency)}
                                    {amountDetails?.balanceDue?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewInvoice;
