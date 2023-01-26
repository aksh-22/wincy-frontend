import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { BarChartExample } from 'components/chart/Chart';
import CustomDatePicker from 'components/customDatePicker/CustomDatePicker';
import IosIcon from 'components/icons/IosIcon';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useGetReferenceGroup } from 'react-query/lead/leadDashboard/useGetReferenceGroup';
import { useTodayFollowUpLead } from 'react-query/lead/leadDashboard/useTodayFollowUpLead';
import { useSelector } from 'react-redux';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import Gp1 from '../../../assets/images/gp1.png';
import Gp2 from '../../../assets/images/gp2.png';
import './LeadDashboard.scss';
import CountUp from 'react-countup';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ClipLoader from 'react-spinners/ClipLoader';
import { LightTooltip } from 'components/tooltip/LightTooltip';
import CustomProgressBar from 'components/customProgressBar/CustomProgressBar';
import { capitalizeFirstLetter } from 'utils/textTruncate';
const progressParClassName = [
    '#007cff',
    '#c83b77',
    '#f4822c',
    '#007cff',
    '#c83b77',
    '#f4822c',
    '#007cff',
    '#c83b77',
    '#f4822c',
];
function LeadDashboard() {
    const orgId = useSelector(
        (state) => state.userReducer?.selectedOrganisation?._id
    );
    const [totalLeadCount, setTotalLeadCount] = useState(0);
    const [awardedLead, setAwardedLead] = useState(0);
    const [lastAwardedLead, setLastAwardedLead] = useState({});
    const [ranges, setRanges] = useState({
        startDate: null,
        endDate: null,
        key: 'rollup',
    });
    const { data: todayFollowUpData, isLoading: todayFollowUpLoading } =
        useTodayFollowUpLead(orgId);
    const { data: getReferenceDate, isLoading: getReferenceDateLoading } =
        useGetReferenceGroup(orgId, ranges);
    useEffect(() => {
        let count = 0;
        getReferenceDate?.leadsCount?.map((item) => {
            count += item?.count ?? 0;
            return null;
        });
        setTotalLeadCount(count);
        setAwardedLead(getReferenceDate?.awarded);
        setLastAwardedLead(getReferenceDate?.lastAwardedLead);
    }, [getReferenceDate]);
    return (
        <div>
            <div className='leadDashboard'>
                <div className='leftSec'>
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}
                    >
                        <CustomDatePicker
                            onChange={(e) => {
                                setRanges(e);
                            }}
                            rangePicker
                            containerStyle={{
                                width: '300px',
                            }}
                            innerContainerStyle='justifyContent_end'
                        >
                            <div
                                className='customFilter '
                                style={{
                                    width: ranges?.startDate ? 300 : 235,
                                }}
                            >
                                <span className='alignCenter'>
                                    <DateRangeRoundedIcon
                                        style={{
                                            marginRight: '5px',
                                            width: '18px',
                                            marginBottom: 2,
                                        }}
                                    />
                                    {!ranges?.startDate ? (
                                        <p>Select Date for filter</p>
                                    ) : (
                                        <p>
                                            {moment(
                                                ranges?.startDate,
                                                'MM-DD-YYYY'
                                            ).format('MMM DD , YYYY')}{' '}
                                            -{' '}
                                            {moment(
                                                ranges?.endDate,
                                                'MM-DD-YYYY'
                                            ).format('MMM DD , YYYY')}
                                        </p>
                                    )}
                                </span>
                                <div className='alignCenter'>
                                    {ranges?.startDate && (
                                        <LightTooltip
                                            title='Remove date filter'
                                            arrow
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setRanges({
                                                        startDate: null,
                                                        endDate: null,
                                                        key: 'rollup',
                                                    });
                                                }}
                                                className='alignCenter'
                                            >
                                                <CancelRoundedIcon
                                                    style={{
                                                        fontSize: 18,
                                                    }}
                                                />
                                            </div>
                                        </LightTooltip>
                                    )}
                                    <KeyboardArrowDownRoundedIcon />
                                </div>
                            </div>
                        </CustomDatePicker>
                    </div>

                    <div className='bxOne cardBg'>
                        <div className='totalLeads'>
                            <p>Total Leads</p>
                            <div className='icnImg'>
                                <span>
                                    <CountUp
                                        end={totalLeadCount}
                                        duration={2}
                                        separator=','
                                    />
                                </span>
                                <div style={{ marginLeft: 5, marginTop: 5 }}>
                                    <ClipLoader
                                        loading={getReferenceDateLoading}
                                        color={'white'}
                                        size={18}
                                    />
                                </div>
                                <img src={Gp1} alt='no_image' />
                            </div>
                        </div>
                        <div className='paidLeads'>
                            <p>Total Sales</p>
                            <div className='icnImg'>
                                <span>
                                    <span
                                        style={{
                                            marginRight: 5,
                                            fontWeight: 300,
                                        }}
                                    >
                                        $
                                    </span>
                                    <CountUp
                                        // end={totalLeadCount}
                                        decimals={
                                            (getReferenceDate?.sales ?? 0) %
                                                1 !==
                                            0
                                        }
                                        end={getReferenceDate?.sales ?? 0}
                                        duration={2}
                                        separator=','
                                    />
                                </span>
                                <div style={{ marginLeft: 5, marginTop: 5 }}>
                                    <ClipLoader
                                        loading={getReferenceDateLoading}
                                        color={'white'}
                                        size={18}
                                    />
                                </div>
                                <img src={Gp2} alt='no_image' />
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }} className='totalLeads'>
                            <p>Total Awarded Leads</p>
                            <div className='icnImg'>
                                <span>
                                    <CountUp
                                        end={awardedLead}
                                        duration={2}
                                        separator=','
                                    />
                                </span>
                                <div style={{ marginLeft: 5, marginTop: 5 }}>
                                    <ClipLoader
                                        loading={getReferenceDateLoading}
                                        color={'white'}
                                        size={18}
                                    />
                                </div>
                                <img src={Gp1} alt='no_image' />
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }} className='paidLeads'>
                            <p>Last Awarded Lead</p>
                            <div className='icnImg'>
                                <span>
                                    {lastAwardedLead &&
                                    Object.keys(lastAwardedLead).length > 0 ? (
                                        <>
                                            <p>{lastAwardedLead?.name}</p>
                                            <p>
                                                {moment(
                                                    lastAwardedLead?.updatedAt
                                                ).format('DD-MM-YYYY')}
                                            </p>
                                        </>
                                    ) : (
                                        <p style={{ color: 'red' }}>
                                            No Last Awarded Lead
                                        </p>
                                    )}
                                </span>
                                <div style={{ marginLeft: 5, marginTop: 5 }}>
                                    <ClipLoader
                                        loading={getReferenceDateLoading}
                                        color={'white'}
                                        size={18}
                                    />
                                </div>
                                <img src={Gp1} alt='no_image' />
                            </div>
                        </div>
                    </div>
                    {/* <div className="bxTwo cardBg">
            <h2 className="fontWeightNormal mb-4">Sale in a month</h2>
            <BarChartExample data={barChartData} />
          </div>
          <div></div>
          <div className="bxThree cardBg">
            <h2 className="fontWeightNormal offWhite mb-4">Leads in a month</h2>
            <BarChartExample data={barChartData} />
          </div> */}
                </div>
                <div className='rightSec'>
                    <div className='bxFour cardBg'>
                        <h2 className='fontWeightNormal offWhite'>
                            Today's Follow-ups
                        </h2>
                        <table className='table customTable'>
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Follow-up Date</th>
                                    <th>Domain</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todayFollowUpLoading ? (
                                    new Array(4).fill('').map((_, index) => (
                                        <tr key={index}>
                                            <th>
                                                <TableRowSkeleton
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                />
                                            </th>
                                            <th>
                                                <TableRowSkeleton
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                />
                                            </th>
                                            <th>
                                                <TableRowSkeleton
                                                    style={{
                                                        marginRight: 10,
                                                    }}
                                                />
                                            </th>
                                        </tr>
                                    ))
                                ) : todayFollowUpData?.leads?.length === 0 ? (
                                    <tr>
                                        <td colSpan={3}>
                                            <div className='alignCenter justifyContent_center flexColumn'>
                                                <IosIcon
                                                    name='notFound'
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        marginBottom: 20,
                                                    }}
                                                />
                                                <p>No Data Found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    todayFollowUpData?.leads?.map(
                                        (item, index) => (
                                            <tr key={index}>
                                                <td
                                                    className='textEllipse'
                                                    style={{
                                                        maxWidth: '100px',
                                                        paddingRight: '20px',
                                                    }}
                                                >
                                                    {item?.name}
                                                </td>
                                                <td>
                                                    {moment(
                                                        item?.nextFollowUp
                                                    ).format('DD-MMM-YYYY')}
                                                </td>
                                                <td>{item?.domain ?? 'N/A'}</td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className='bxFive cardBg'>
                        <h2 className='fontWeightNormal offWhite'>
                            Source we receive the leads most
                        </h2>
                        <div className='CustomBar'>
                            {getReferenceDateLoading ? (
                                <TableRowSkeleton count={4} />
                            ) : (
                                <div className='mt-2'>
                                    {getReferenceDate?.leadsCount?.map(
                                        (item, index) => (
                                            <div
                                                className='NewProgressBar'
                                                key={index}
                                            >
                                                <span>
                                                    {capitalizeFirstLetter(
                                                        item?._id
                                                    )}
                                                </span>

                                                <CustomProgressBar
                                                    value={
                                                        ((item?.count ?? 0) /
                                                            totalLeadCount) *
                                                        100
                                                    }
                                                    labelPositionRight
                                                    colorCode={
                                                        progressParClassName?.[
                                                            index
                                                        ]
                                                    }
                                                    height={10}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                        {/* {Math.floor(Math.random() * (3 - 1 + 1) + 1)} */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeadDashboard;

export const barChartData = {
    labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    dataUnit: 'People',
    datasets: [
        {
            label: 'Sales',
            backgroundColor: '#625DF5',
            borderRadius: 14,
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
        },
        //   {
        //     label: "join",
        //     backgroundColor: "#9cabff",
        //     barPercentage: 0.8,
        //     categoryPercentage: 0.8,
        //     data: [
        //       110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95,
        //       75, 90, 75, 90,
        //     ],
        //   },
    ],
};
export const barChartMultiple = {
    labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    dataUnit: 'USD',
    datasets: [
        {
            label: 'Income',
            backgroundColor: '#9cabff',
            data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
        },
        {
            label: 'Expense',
            backgroundColor: '#f4aaa4',
            data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125],
        },
    ],
};
export const barChartStacked = {
    labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ],
    stacked: true,
    dataUnit: 'USD',
    datasets: [
        {
            label: 'Income',
            backgroundColor: '#9cabff',
            data: [110, 80, 125, 55, 95, 75, 90, 110, 80, 125, 55, 95],
        },
        {
            label: 'Expense',
            backgroundColor: '#f4aaa4',
            data: [75, 90, 110, 80, 125, 55, 95, 75, 90, 110, 80, 125],
        },
    ],
};
