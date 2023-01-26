import React from 'react'
import { Skeleton } from '@material-ui/lab';
import TableRowSkeleton from 'skeleton/tableRow/TableRowSkeleton';
function MilestoneSidebarSkeleton() {
    return (
        <div>
            <div>
            <Skeleton
                        className="sideBarClose boxShadow"
            variant="circle"  style={{width:50 , height : 50 , transform: 'translate(-35px, 5px)'}} />
            </div>
           <div className="ml-2">
           <TableRowSkeleton />
           </div>

            <TableRowSkeleton height={80}/>

            <div className={"my-1"} style={{border : "1px solid var(--divider)"}}>
                {new Array(5).fill("").map((item , index) => (
                     <div className={`d_flex px-1 ${index === 4 ? "mb-1"  : ""}`} key={index}>
                         <div className="flex pr-1"> <TableRowSkeleton height={35}/></div>
                         <div className="flex">      <TableRowSkeleton  height={35}/></div>
                        
                          </div>
                ))}
            </div>
            <TableRowSkeleton />

            <div className={"my-1"} style={{border : "1px solid var(--divider)"}}>
                {new Array(5).fill("").map((item , index) => (
                     <div className={`d_flex px-1 ${index === 4 ? "mb-1"  : ""}`} key={index}>
                         <div className="flex pr-1"> <TableRowSkeleton height={35}/></div>
                         <div className="flex">      <TableRowSkeleton  height={35}/></div>
                        
                          </div>
                ))}
            </div>
        </div>
    )
}

export default MilestoneSidebarSkeleton
