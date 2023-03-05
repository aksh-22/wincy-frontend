import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import CustomInput from 'components/customInput/CustomInput';
import CustomPopper from 'components/CustomPopper';
import IosIcon from 'components/icons/IosIcon';
import NoData from 'components/NoData';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import React, { useCallback, useEffect, useState } from 'react';
import { useTransaction } from 'react-query/invoice/transaction/useTransaction';
import { useInvoice } from 'react-query/invoice/useInvoice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import { dateCondition } from 'utils/dateCondition';
import { AddIconComponent } from './AddIconComponent';
import ProfilePopupCss from 'css/ProfilePopup.module.css';
import './Invoice.scss';
import TransactionRow from './viewInvoice/TransactionRow';
import FilterListIcon from '@material-ui/icons/FilterList';
import FilterInInvoice, {
    convertFinancialYearToString,
} from './FilterInInvoice';
import Loading from 'components/loading/Loading';
import { useQueryClient } from 'react-query';
import { useSubsidiaryList } from 'react-query/invoice/subsidiary/useSubsidiaryList';
import { PDFViewer } from '@react-pdf/renderer';
import DownloadInvoice from './viewInvoice/DownloadInvoice';
import { useContext } from 'react';
import { InvoiceFilterContext } from 'context/invoiceFilterContext';
import BtnWrapper from 'components/btnWrapper/BtnWrapper';
import CustomButton from 'components/CustomButton';
import { capitalizeFirstLetter } from 'utils/textTruncate';
import { fixInvoices } from 'api/invoice';
import { currencySymbol } from 'utils/currency';
import statusColor from 'utils/getStatusColor';
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
    const { data, isLoading, isRefetching, refetch } = useInvoice({
        orgId,
        financialYear: filter?.financialYear
            ? convertFinancialYearToString(filter?.financialYear)
            : null,
        subsiduary: filter?.subsiduary,
        projectId: filter?.project,
        month: filter?.month,
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
            if (filter[key] === 'asc') {
            } else if (filter[key] !== null) {
                count++;
            }
        }
        return count;
    }, [filter]);

    useEffect(() => {
        console.log('filter.project', filter.project);
        refetch();
    }, [filter.project, filter.month]);

    const queryClient = useQueryClient();
    const userType = useSelector((state) => state.userReducer?.userType);

    useEffect(() => {
        if (data) {
            console.log('first');
            // let temp = data.sort(function (a, b) {
            //     return filter?.sortBy === 'desc'
            //         ? Number(b?.sNo?.split('/').pop()) -
            //               Number(a?.sNo?.split('/').pop())
            //         : Number(a?.sNo?.split('/').pop()) -
            //               Number(b?.sNo?.split('/').pop());
            // });
            // queryClient.setQueryData(
            //     [
            //         'invoice',
            //         orgId,
            //         filter?.financialYear
            //             ? convertFinancialYearToString(filter?.financialYear)
            //             : null,
            //         filter?.subsiduary,
            //     ],
            //     temp
            // );
        }
    }, [filter, data]);

    const onFixInvoices = async () => {
        const a = await fixInvoices();
        console.log('a', a);
    };

    return (
        <div className='invoice_main_container'>
            <div className='alignCenter mb-2'>
                <div className='alignCenter flex'>
                    <p>Home</p>
                    <p>&nbsp; {'>'}&nbsp; </p>
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
                    width='auto'
                    value={
                        <LightTooltip title='Filter' arrow>
                            <div
                                style={{
                                    position: 'relative',
                                }}
                            >
                                {filterCount() > 0 && (
                                    <div className='filterBatch'>
                                        <p>{filterCount()}</p>
                                    </div>
                                )}
                                {isRefetching && (
                                    <Loading
                                        loadingType={'spinner'}
                                        backgroundColor='#FFF'
                                    />
                                )}
                                <FilterListIcon
                                    style={{
                                        color: 'var(--defaultWhite)',
                                        fontSize: 35,
                                    }}
                                />
                            </div>
                        </LightTooltip>
                    }
                    maxWidth={1200}
                    valueStyle={{
                        display: 'flex',
                        fontSize: 14,
                        color: 'white',
                        margin: '0px 20px',
                    }}
                    content={
                        <FilterInInvoice
                            orgId={orgId}
                            filter={filter}
                            clearFilter={() =>
                                setFilter({
                                    financialYear: null,
                                    sortBy: 'asc',
                                    subsiduary: null,
                                })
                            }
                            filterCount={filterCount}
                            setFilter={setFilter}
                        />
                    }
                />
                <div className='alignCenter'>
                    <AddIconComponent
                        tooltipTitle='Create Invoice'
                        onClick={() => push('/main/invoice/createInvoice')}
                    />
                    <CustomInput
                        placeholder='Search'
                        type='search'
                        onChange={onSearch}
                    />
                </div>
            </div>
            {!subsidiaryLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnWrapper>
                        {subsidiaryList?.map((item) => (
                            <CustomButton
                                key={item?._id}
                                type={
                                    filter?.subsiduary === item?._id
                                        ? 'contained'
                                        : 'text'
                                }
                                onClick={() => {
                                    setFilter({
                                        ...filter,
                                        subsiduary:
                                            filter?.subsiduary === item?._id
                                                ? null
                                                : item?._id,
                                    });
                                }}
                            >
                                <p className='filter_title'>
                                    {capitalizeFirstLetter(
                                        item.title.length > 20
                                            ? item?.title.substring(0, 20) +
                                                  '...'
                                            : item?.title
                                    )}
                                </p>
                            </CustomButton>
                        ))}
                    </BtnWrapper>
                    {/* {userType.userType === 'Admin' ? (
                        <CustomButton onClick={onFixInvoices}>
                            Fix Invoices
                        </CustomButton>
                    ) : null} */}
                </div>
            ) : null}
            {!isLoading && data?.length > 0 && (
                <div className='invoice_main_header_row'>
                    <h3>Invoices</h3>
                    <h3>Due Date</h3>
                    <h3>Project name</h3>
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
                    <div className='mt-4'>
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
    return (
        <div className='mb-2'>
            <div
                className='invoice_main_header_item cursorPointer'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='d_flex'>
                    <div
                        className='invoice_item_row_sideLine '
                        style={{ background: 'var(--green)' }}
                    />
                    <div className='alignCenter flex'>
                        <ArrowRightSharpIcon
                            style={{
                                transform: isOpen
                                    ? 'rotate(90deg)'
                                    : 'rotate(0deg)',
                                transition: 'ease-in-out 0.2s',
                            }}
                        />
                        <p>{`#${item?.sNo}`}</p>
                    </div>
                    {item?.createdBy === userType?.userId ||
                    userType?.userType === 'Admin' ? (
                        <LightTooltip title='Info' arrow>
                            <div className='alignCenter mx-1 cursorPointer'>
                                <div
                                    onClick={() =>
                                        push(
                                            `/main/invoice/viewInvoice/${item?._id}`
                                        )
                                    }
                                >
                                    <IosIcon name='info' />
                                </div>
                            </div>
                        </LightTooltip>
                    ) : null}
                </div>
                <p>{dateCondition(item?.dueDate)}</p>
                <p>{item?.project?.title}</p>
                <p>
                    {item?.finalAmount ? (
                        <>
                            {currencySymbol(item?.currency)}
                            {item?.finalAmount}
                        </>
                    ) : (
                        '---'
                    )}
                </p>
                <p>
                    {item?.finalAmount ? (
                        <>
                            {currencySymbol(item?.currency)}
                            {item?.finalAmount}
                        </>
                    ) : (
                        '---'
                    )}
                </p>
                <p>
                    {item?.finalAmount ? (
                        <>
                            {currencySymbol(item?.currency)}
                            {Number(item?.finalAmount) -
                                Number(item?.paidAmount)}
                        </>
                    ) : (
                        '---'
                    )}
                </p>
                <p
                    style={{
                        background: statusColor(item.status),
                    }}
                >
                    {item?.status}
                </p>
            </div>

            {isOpen && (
                <>
                    {!isLoading && data?.length > 0 && (
                        <div className='invoice_main_header_sub_row'>
                            <div className='emptyCell' />

                            <h3 className='ml-2'>Payment Date</h3>
                            <h3>Gateway</h3>
                            <h3>Amount</h3>
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
                                type='invoice'
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
