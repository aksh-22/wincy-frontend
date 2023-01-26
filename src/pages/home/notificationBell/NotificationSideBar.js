import React, { useState } from 'react'
import { useGetNotification } from 'react-query/notification/useGetNotification';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
import NotificationRow from './NotificationRow'

function NotificationSideBar({orgId , toggle}) {
  const [pageNo, setPageNo] = useState(1);
  const { data, isLoading } = useGetNotification({
    orgId,
    status: "All",
    pageNo: pageNo,
    pageSize: "1000",
  });
  return (
    <div>
        <div className='alignCenter p-1'>
  <h3 className='flex'>Notification</h3 >
   </div>

   {isLoading ? (
                <TableRowSkeleton count={5} style={{margin:10}}/>
              ) : (
                data?.notifications?.map((item) => (
                  <NotificationRow
                    key={item?._id}
                    data={item}
                    pageNo={pageNo}
                    status={"All"}
                    handleClose={toggle}
                  />
                ))
              )}
    </div>
  )
}

export default NotificationSideBar