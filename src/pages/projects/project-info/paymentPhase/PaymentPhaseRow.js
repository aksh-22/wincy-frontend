import InputTextClickAway from 'components/clickawayComponent/InputTextClickAway';
import CustomButton from 'components/CustomButton';
import CustomCircularProgressBar from 'components/CustomCircularProgressBar';
import CustomMenu from 'components/CustomMenu';
import CustomSideBar from 'components/customSideBar/CustomSideBar';
import IosIcon from 'components/icons/IosIcon';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import React, { useState } from 'react';
import { useUpdatePaymentPhase } from 'react-query/invoice/paymentPhase/useUpdatePaymentPhase';
import { addSpaceUpperCase } from 'utils/addSpaceUpperCase';
import statusColor from 'utils/getStatusColor';
import { paymentPhaseStatus } from 'utils/status';
import PaymentPhaseSidebar from './PaymentPhaseSidebar';

function PaymentPhaseRow({
    item,
    orgId,
    projectId,
    index,
    showInfoIcon = true,
    showStatus = true,
    isStatic = false,
    textClass,
}) {
    let statusColorVal = statusColor(item?.status);

    const [isOpen, setIsOpen] = useState(false);
    const { mutate } = useUpdatePaymentPhase();
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

    const onStatusClick = (statusClicked) => {
        statusClicked &&
            mutate({
                orgId,
                projectId,
                paymentPhaseId: item?._id,
                data: {
                    status: statusClicked.value,
                },
                index,
            });
    };

    return (
        <>
            <div className='paymentPhase_itemRow' key={item?._id}>
                <div className='d_flex textEllipse flex'>
                    <div className='paymentPhase_itemRow_sideLine' />
                    <div className='alignCenter textEllipse flex'>
                        <InputTextClickAway
                            value={item?.title}
                            className={`textEllipse ${textClass}`}
                            textClassName={'textEllipse'}
                            onChange={onHandleChange('title')}
                            disabled={isStatic}
                        />
                    </div>
                </div>
                <div className='alignCenter justifyContent_center'>
                    {item?.milestones?.length > 0 ? (
                        <div style={{ width: 20 }}>
                            <CustomCircularProgressBar
                                percentage={
                                    item?.progress
                                        ? (
                                              ((item?.progress?.Completed ??
                                                  0) /
                                                  ((item?.progress
                                                      ?.NotStarted ?? 0) +
                                                      (item?.progress?.Active ??
                                                          0) +
                                                      (item?.progress
                                                          ?.Completed ?? 0))) *
                                              100
                                          ).toFixed(0)
                                        : 0
                                }
                            />
                        </div>
                    ) : (
                        <div style={{ width: 20 }} />
                    )}
                    {showInfoIcon ? (
                        <LightTooltip arrow title='Info'>
                            <div onClick={() => setIsOpen(true)}>
                                <IosIcon
                                    name='info'
                                    className='mx-1 cursorPointer'
                                />
                            </div>
                        </LightTooltip>
                    ) : null}
                </div>
                <InputTextClickAway
                    className={`alignCenter ${textClass}`}
                    value={item?.amount}
                    textClassName={'textCenter flex'}
                    disabled={isStatic}
                />
                <InputTextClickAway
                    value={item?.dueAmount}
                    className={`alignCenter ${textClass}`}
                    textClassName={'textCenter flex'}
                    disabled={isStatic}
                />
                <div className='alignCenter justifyContent_center'>
                    {showStatus ? (
                        <CustomMenu
                            menuItems={paymentPhaseStatus}
                            id={item?._id}
                            menuName='bugStatus'
                            handleMenuClick={onStatusClick}
                            // name={currentlyEditingMenu}
                            activeMenuItem={addSpaceUpperCase(item?.status)}
                            actionButton={
                                <CustomButton
                                    onClick={onStatusClick}
                                    backgroundColor={statusColorVal}
                                >
                                    <p>{item?.status}</p>
                                </CustomButton>
                            }
                        />
                    ) : //

                    null}
                </div>
            </div>

            <CustomSideBar show={isOpen} toggle={() => setIsOpen(!isOpen)}>
                <PaymentPhaseSidebar
                    item={item}
                    handleClose={() => setIsOpen(false)}
                    index={index}
                    orgId={orgId}
                    projectId={projectId}
                />
            </CustomSideBar>
        </>
    );
}

export default PaymentPhaseRow;
