import React , {memo} from 'react'
import BugFlowChart from './bugFlowChart/BugFlowChart'

function BugSummary() {
    return (
        <div>
            
         <BugFlowChart />
        </div>
    )
}

export default memo(BugSummary)
