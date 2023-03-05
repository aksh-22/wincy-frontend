import CommonDialog from 'components/CommonDialog';
import React from 'react';
import { useState } from 'react';
import { usePaymentPhase } from 'react-query/invoice/usePaymentPhase';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import AddPaymentPhase from './AddPaymentPhase';
import './PaymentPhase.scss';
import PaymentPhaseRow from './PaymentPhaseRow';
import BottomActionBar from 'components/bottomActionBar/BottomActionBar';
function PaymentPhase({ projectId, orgId, showAddPhase, setShowAddPhase }) {
    const { isLoading, data } = usePaymentPhase({
        projectId,
        orgId,
    });

    let totalAmount = 0;

    let dueAmount = 0;

    data?.forEach((el) => {
        totalAmount += Number(el.amount);
        dueAmount += Number(el.dueAmount);
    });

    return (
        <div className='paymentPhaseContainer'>
            {showAddPhase && (
                <CommonDialog
                    shouldOpen
                    minWidth={'30vw'}
                    OtherClose={() => setShowAddPhase(false)}
                    modalTitle='Add Payment Phase'
                    content={
                        <AddPaymentPhase
                            onClose={() => setShowAddPhase(false)}
                        />
                    }
                />
            )}

            <div className='paymentPhase_headingRow'>
                <p>Title</p>
                <p />
                <p className='textCenter'>Amount</p>
                <p className='textCenter'>Due Amount</p>
                <p className='textCenter'>Status</p>
            </div>
            {isLoading ? (
                <TableRowSkeleton count={4} />
            ) : (
                <div>
                    {data?.map((item, index) => {
                        return (
                            <PaymentPhaseRow
                                key={item?._id}
                                item={item}
                                orgId={orgId}
                                projectId={projectId}
                                index={index}
                            />
                        );
                    })}
                    <div style={{ marginTop: 50 }}>
                        <PaymentPhaseRow
                            item={{
                                title: 'Total',
                                amount: totalAmount + '',
                                dueAmount: dueAmount + '',
                            }}
                            showInfoIcon={false}
                            showStatus={false}
                            isStatic={true}
                            textClass='paymentPhaseTotalText'
                        />
                    </div>
                </div>
            )}

            {/* <BottomActionBar isOpen={true} isSelected={['s']} /> */}
        </div>
    );
}

export default PaymentPhase;
