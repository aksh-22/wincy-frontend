import { LightTooltip } from 'components/tooltip/LightTooltip';
import React, { useEffect } from 'react';
import { useSubsidiaryList } from 'react-query/invoice/subsidiary/useSubsidiaryList';
import css from 'css/FilterInProject.module.css';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import Checkbox from '@mui/material/Checkbox';
import { capitalizeFirstLetter } from 'utils/textTruncate';
import moment from 'moment';
import { useProjects } from 'react-query/projects/useProjects';

let startYear = Number(moment(new Date()).format('YYYY'));
let endYear = Number(moment(new Date()).subtract(1, 'year').format('YYYY'));
export let financialYearArray = [];
for (let i = 0; i < 20; i++) {
    if (i > 0) {
        startYear -= 1;
        endYear -= 1;
    }
    financialYearArray.push({
        startYear,
        endYear,
        _id: i,
    });
}

function FilterInInvoice({
    orgId,
    filterCount,
    clearFilter,
    isSelected,
    setFilter,
    filter,
}) {
    const { data: subsidiaryList, isLoading: subsidiaryLoading } =
        useSubsidiaryList({ orgId });
    useEffect(() => {}, []);

    const { data: projectList } = useProjects('Active');

    console.log('projectList', projectList);

    return (
        <div>
            <div
                className='p-1 d_flex '
                style={{
                    background: '#353581',
                    color: 'blue',
                }}
            >
                <div
                    className='flex'
                    style={{
                        color: '#FFF',
                        fontSize: 14,
                    }}
                >
                    Quick Filters
                </div>
                <LightTooltip
                    arrow
                    title={
                        filterCount === 0 ? 'There are no active filters' : ''
                    }
                >
                    <div
                        className={`cursorPointer clearFilter ${
                            filterCount === 0 ? 'clearFilterDisable' : ''
                        }`}
                        onClick={clearFilter}
                    >
                        Clear All
                    </div>
                </LightTooltip>
            </div>
            <div className=' p-10px d_flex  filterContainer'>
                <div className=' filterChildContainer'>
                    <p
                        className='mb-1'
                        style={{
                            // fontFamily: "Comfortaa-Medium",
                            fontSize: 13,
                        }}
                    >
                        {'Sub Company'}
                    </p>

                    <ul className={css.optionsContainer}>
                        {subsidiaryLoading ? (
                            <TableRowSkeleton count={4} />
                        ) : (
                            subsidiaryList?.map((item, index) => (
                                <LightTooltip
                                    arrow
                                    key={item?._id}
                                    title={
                                        item?.title?.length > 20
                                            ? item?.title
                                            : ''
                                    }
                                >
                                    <div>
                                        <li
                                            onClick={() => {
                                                setFilter({
                                                    ...filter,
                                                    subsiduary:
                                                        filter?.subsiduary ===
                                                        item?._id
                                                            ? null
                                                            : item?._id,
                                                });
                                            }}
                                            className={`${css.tile}  ${
                                                index > 0 ? 'mt-5px' : ''
                                            } ${
                                                subsidiaryList.length - 1 ===
                                                index
                                                    ? 'mb-1'
                                                    : ''
                                            } ${
                                                filter?.subsiduary === item?._id
                                                    ? css.activeTile
                                                    : ''
                                            }`}
                                        >
                                            <div
                                                className={css.textColumn}
                                                // style={{ fontSize: "1rem" }}
                                            >
                                                <Checkbox
                                                    checked={
                                                        filter?.subsiduary ===
                                                        item?._id
                                                    }
                                                    size='small'
                                                    sx={{
                                                        color: '#c8c8d0',
                                                        '&.Mui-checked': {
                                                            color: '#FFF',
                                                        },
                                                    }}
                                                />
                                                <p className='filter_title'>
                                                    {capitalizeFirstLetter(
                                                        item.title.length > 20
                                                            ? item?.title.substring(
                                                                  0,
                                                                  20
                                                              ) + '...'
                                                            : item?.title
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    </div>
                                </LightTooltip>
                            ))
                        )}
                    </ul>
                </div>

                <div className=' filterChildContainer'>
                    <p
                        className='mb-1'
                        style={{
                            fontSize: 13,
                        }}
                    >
                        {'Financial Year'}
                    </p>

                    <ul className={css.optionsContainer}>
                        {financialYearArray?.map((item, index) => (
                            <div key={index}>
                                <li
                                    onClick={() => {
                                        setFilter({
                                            ...filter,
                                            financialYear:
                                                filter?.financialYear?._id ===
                                                item?._id
                                                    ? null
                                                    : item,
                                        });
                                    }}
                                    className={`${css.tile}  ${
                                        index > 0 ? 'mt-5px' : ''
                                    } ${
                                        financialYearArray?.length - 1 === index
                                            ? 'mb-1'
                                            : ''
                                    } ${
                                        filter?.financialYear?._id === item?._id
                                            ? css.activeTile
                                            : ''
                                    }`}
                                >
                                    <div
                                        className={css.textColumn}
                                        // style={{ fontSize: "1rem" }}
                                    >
                                        <Checkbox
                                            checked={
                                                filter?.financialYear?._id ===
                                                item?._id
                                            }
                                            size='small'
                                            sx={{
                                                color: '#c8c8d0',
                                                '&.Mui-checked': {
                                                    color: '#FFF',
                                                },
                                            }}
                                        />
                                        <p className='filter_title'>
                                            {item?.endYear}-{item.startYear}
                                        </p>
                                    </div>
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>

                <div className=' filterChildContainer'>
                    <p
                        className='mb-1'
                        style={{
                            fontSize: 13,
                        }}
                    >
                        {'Sort By'}
                    </p>

                    <ul className={css.optionsContainer}>
                        <li
                            onClick={() => {
                                setFilter({
                                    ...filter,
                                    sortBy: 'asc',
                                });
                            }}
                            className={`${css.tile}  mb-1 ${
                                filter?.sortBy === 'asc' ? css.activeTile : ''
                            }`}
                        >
                            <div
                                className={css.textColumn}
                                // style={{ fontSize: "1rem" }}
                            >
                                <Checkbox
                                    checked={filter?.sortBy === 'asc'}
                                    size='small'
                                    sx={{
                                        color: '#c8c8d0',
                                        '&.Mui-checked': {
                                            color: '#FFF',
                                        },
                                    }}
                                />
                                <p className='filter_title'>
                                    Ascending (default)
                                </p>
                            </div>
                        </li>

                        <li
                            onClick={() => {
                                setFilter({
                                    ...filter,
                                    sortBy: 'desc',
                                });
                            }}
                            className={`${css.tile}  mb-1 ${
                                filter?.sortBy === 'desc' ? css.activeTile : ''
                            }`}
                        >
                            {' '}
                            <div
                                className={css.textColumn}
                                // style={{ fontSize: "1rem" }}
                            >
                                <Checkbox
                                    checked={filter?.sortBy === 'desc'}
                                    size='small'
                                    sx={{
                                        color: '#c8c8d0',
                                        '&.Mui-checked': {
                                            color: '#FFF',
                                        },
                                    }}
                                />
                                <p className='filter_title'>Descending</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className=' filterChildContainer'>
                    <p
                        className='mb-1'
                        style={{
                            fontSize: 13,
                        }}
                    >
                        Project By
                    </p>

                    <ul className={css.optionsContainer}>
                        {projectList?.projects?.length
                            ? projectList.projects.map((el) => (
                                  <li
                                      key={el._id}
                                      onClick={() => {
                                          setFilter({
                                              ...filter,
                                              project:
                                                  filter.project === el._id
                                                      ? null
                                                      : el._id,
                                          });
                                      }}
                                      className={`${css.tile}  mb-1 ${
                                          filter?.project === el._id
                                              ? css.activeTile
                                              : ''
                                      }`}
                                  >
                                      <div
                                          className={css.textColumn}
                                          // style={{ fontSize: "1rem" }}
                                      >
                                          <Checkbox
                                              checked={
                                                  filter?.project === el._id
                                              }
                                              size='small'
                                              sx={{
                                                  color: '#c8c8d0',
                                                  '&.Mui-checked': {
                                                      color: '#FFF',
                                                  },
                                              }}
                                          />
                                          <p className='filter_title'>
                                              {el.title}
                                          </p>
                                      </div>
                                  </li>
                              ))
                            : null}
                    </ul>
                </div>
                <div className=' filterChildContainer'>
                    <p
                        className='mb-1'
                        style={{
                            fontSize: 13,
                        }}
                    >
                        Month By
                    </p>
                    <ul className={css.optionsContainer}>
                        {moment.monthsShort().map((el, i) => (
                            <li
                                key={el}
                                onClick={() => {
                                    setFilter({
                                        ...filter,
                                        month: filter.month === i ? null : i,
                                    });
                                }}
                                className={`${css.tile}  mb-1 ${
                                    filter?.month === i ? css.activeTile : ''
                                }`}
                            >
                                <div
                                    className={css.textColumn}
                                    // style={{ fontSize: "1rem" }}
                                >
                                    <Checkbox
                                        checked={filter?.month === i}
                                        size='small'
                                        sx={{
                                            color: '#c8c8d0',
                                            '&.Mui-checked': {
                                                color: '#FFF',
                                            },
                                        }}
                                    />
                                    <p className='filter_title'>{el}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FilterInInvoice;

export const convertFinancialYearToString = ({ startYear, endYear }) => {
    return `${moment(endYear, 'YYYY').format('YY')}-${moment(
        startYear,
        'YYYY'
    ).format('YY')}`;
};
