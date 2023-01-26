import CloseButton from "components/CloseButton";
import NoData from "components/NoData";
import React from "react";
import { useGetQueryReply } from "react-query/queries/reply/useGetQueryReply";
import { useDeleteQuery } from "react-query/queries/useDeleteQuery";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import "./Queries.scss";
import QueryRow from "./QueryRow";
import QueryRowReply from "./QueryRowReply";
import ReplyInputSection from "./ReplyInputSection";

function QueriesThread({ item, orgId, projectId , toggle , index , disabled , status }) {
  const { data, isError, isLoading } = useGetQueryReply(orgId, projectId , item?._id);
  const userType = useSelector((state) => state.userReducer?.userType);
  const {mutate , isLoading:deleteLoading} = useDeleteQuery(toggle)
    const messagesEndRef = React.createRef()

  return (
    <>
    <div className="queriesThread">
      <div className="alignCenter mb-1" style={{height:40}}>
        <div className="flex"></div>
      
        <CloseButton
        
        normalClose={!disabled} 
        isLoading={deleteLoading}
        mutate={mutate}
        data={{
          orgId,
          projectId,
          data:{
            queries : [item?._id]
          },
          index
        }}
        
        onClick={toggle}
        
        />
      </div>

      <QueryRow
        drawerDisabled
        item={item}
        orgId={orgId}
        projectId={projectId}
removeReply        
forward_status={status}
      />

      {data?.replies?.length > 0 && <div className="replies_section">
        <p className="replies">{data?.replies?.length??0} {data?.replies?.length??0 <=1  ? "Reply" : "Replies"}</p>
      </div>}

      {isError ? (
        <NoData />
      ) : isLoading ? (
        <TableRowSkeleton count={4} height={50} />
      ) : (
        data?.replies?.map((row , index) => <QueryRowReply index={index} removeHr={data?.replies?.length-1 === index} drawerDisabled key={row?._id} item={row} projectId={projectId} orgId={orgId} queryId={item?._id}/> )
      )}
         
        

      {
        ["Admin" , "Member++" , "Member+"].includes(userType?.userType) && <ReplyInputSection
        orgId={orgId}
        projectId={projectId}
        queryId={item?._id}
        messagesEndRef={messagesEndRef}
forward_status={status}

      />
      }
    </div>
    <div style={{ float:"left", clear: "both"  , height:60 }}
        ref={messagesEndRef}     
             />
    </>
  );
}

export default QueriesThread;
