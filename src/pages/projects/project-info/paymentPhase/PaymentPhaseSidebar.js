import { getPaymentPhaseLinkedInvoices } from 'api/paymentPhase';
import InputTextClickAway from 'components/clickawayComponent/InputTextClickAway';
import CloseButton from 'components/CloseButton';
import CustomButton from 'components/CustomButton';
import CustomRow from 'components/CustomRow';
import CustomTextEditor from 'components/customTextEditor/CustomTextEditor';
import React from 'react';
import { useState } from 'react';
import { useDeletePaymentPhase } from 'react-query/invoice/paymentPhase/useDeletePaymentPhase';
import { useUpdatePaymentPhase } from 'react-query/invoice/paymentPhase/useUpdatePaymentPhase';
import { useSelector } from 'react-redux';
import { dateCondition } from 'utils/dateCondition';
import { capitalizeFirstLetter } from 'utils/textTruncate';

function PaymentPhaseSidebar({ item, handleClose, orgId, projectId, index }) {
    const { currency } = useSelector((state) => state.userReducer?.userData);
    const { mutate: deleteMutate, isLoading } = useDeletePaymentPhase();
    const { mutate } = useUpdatePaymentPhase();
    const editorRef = React.useRef('');
    const [invoiceLoading, setInvoiceLoading] = useState(false);

    const [linkedInvoices, setLinkedInvoices] = useState([]);

    const [fetched, setFetched] = useState(false);

    const onHandleChange = (key) => (value) => {
        mutate({
            orgId,
            projectId,
            paymentPhaseId: item?._id,
            data: {
                [key]: value,
            },
            index,
        });
    };

    const getInvoices = async () => {
        setInvoiceLoading(true);
        try {
            const a = await getPaymentPhaseLinkedInvoices(orgId, item?._id);
            console.log('a', a);
            setLinkedInvoices(a);
            setFetched(true);
        } catch (error) {
            console.error(error);
        }
        setInvoiceLoading(false);
    };

    return (
        <div>
            <div className='d_flex'>
                <div className='alignCenter flex'>
                    <InputTextClickAway
                        className='flex'
                        value={item?.title}
                        textStyle={{
                            fontFamily: 'Lato-Bold',
                            fontSize: 18,
                        }}
                        onChange={onHandleChange('title')}
                    />
                </div>
                <CloseButton
                    normalClose
                    onClick={handleClose}
                    mutate={deleteMutate}
                    data={{
                        data: {
                            paymentPhaseIds: [item?._id],
                        },
                        orgId: item?.organisation,
                        projectId: item?.project,
                        paymentPhaseId: item?._id,
                    }}
                    isLoading={isLoading}
                />
            </div>

            <div className='my-2'>
                <CustomTextEditor
                    value={item?.description}
                    ref={editorRef}
                    updateData={onHandleChange('description')}
                />
            </div>
            <CustomRow
                value={item?.currency}
                field='Currency'
                menuItems={currency ?? []}
                inputType='select'
                onChange={onHandleChange('currency')}
            />

            <CustomRow value={item?.status} field='Status' />
            {item?.milestones?.length > 0 &&
                item?.milestones?.map((item, index) => (
                    <CustomRow
                        key={item?._id}
                        field={`Milestone ${index + 1}`}
                        value={capitalizeFirstLetter(item?.title)}
                    />
                ))}
            <CustomRow
                value={dateCondition(item?.createdAt, 'DD MMM YYYY')}
                field='Created At'
            />
            <div style={{ marginTop: 20 }}>
                <h3 style={{ marginBottom: 10 }}>Linked Invoices</h3>
                {fetched ? (
                    linkedInvoices.length ? (
                        <>
                            <div className='linkedInvoiceList'>
                                <p>S No.</p>
                                <p>currency</p>
                                <p>Final Amount</p>
                                <p>Status</p>
                            </div>
                            {linkedInvoices.map((el) => (
                                <div
                                    key={el._id}
                                    className='linkedInvoiceListRow'
                                >
                                    <p>{el?.sNo}</p>
                                    <p>{el?.currency}</p>
                                    <p>{el?.finalAmount}</p>
                                    <p>{el?.status}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={{ opacity: 0.5 }}>No invoices found</p>
                    )
                ) : (
                    <CustomButton
                        loading={invoiceLoading}
                        onClick={getInvoices}
                    >
                        Show Linked Invoices
                    </CustomButton>
                )}
                {/* <CustomButton loading={invoiceLoading} onClick={getInvoices}>
                    Show Linked Invoices
                </CustomButton> */}
            </div>
        </div>
    );
}

export default PaymentPhaseSidebar;
