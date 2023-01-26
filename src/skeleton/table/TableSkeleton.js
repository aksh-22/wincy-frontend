import React from 'react';
import 'css/Milestone.css';
import { Skeleton } from '@material-ui/lab';

function TableSkeleton({ count }) {
  return new Array(count ?? 1).fill('loading_table').map((item, index) => (
    <div className="d_flex alignCenter milestone_skeleton mb-2" key={index}>
      <div className={`d_flex alignCenter px-2 flex `}>
        <Skeleton
          variant="text"
          height={35}
          width={'100%'}
          className="mb-5px"
        />
      </div>

      <div className="d_flex alignCenter justifyContent-end px-3">
        <Skeleton variant="circle" width={25} height={25} />
      </div>
      <div className="milestone_cell">
        {' '}
        <Skeleton variant="text" height={35} width={'80%'} className="" />
      </div>
      <div className="milestone_cell">
        {' '}
        <Skeleton variant="text" height={35} width={'80%'} className="" />
      </div>
      <div className="milestone_cell">
        {' '}
        <Skeleton variant="text" height={35} width={'80%'} className="" />
      </div>
    </div>
  ));
}

export default TableSkeleton;
