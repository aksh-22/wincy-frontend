import CommonDialog from "components/CommonDialog";
import NoData from "components/NoData";
import { Fragment } from "react";
import { useGetQueries } from "react-query/queries/useGetQueries";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import AddQuery from "./AddQuery";
import "./Queries.scss";
import QueryRow from "./QueryRow";
function Queries({
  projectId,
  orgId,
  showAddQuery,
  setShowAddQuery,
  queryStatus,
}) {
  const { data, isLoading, isError } = useGetQueries(
    orgId,
    projectId,
    queryStatus
  );
  const userType = useSelector((state) => state.userReducer?.userType);
  return isError ? (
    <NoData error />
  ) : isLoading ? (
    <TableRowSkeleton height={50} count={5} />
  ) : (
    <div
      className="queryContainer"
      style={{
        padding: data?.queries?.length ? 20 : 0,
      }}
    >
      {showAddQuery && (
        <CommonDialog
          shouldOpen
          OtherClose={() => setShowAddQuery(false)}
          content={
            <AddQuery
              orgId={orgId}
              projectId={projectId}
              handleClose_2={() => setShowAddQuery(false)}
            />
          }
          minWidth={"30vw"}
          modalTitle="Create Query"
        />
      )}

      {data?.queries?.map((item, index) => (
        <Fragment key={item._id}>
          <QueryRow
            disabled={userType?.userId !== item?.createdBy?._id}
            item={item}
            orgId={orgId}
            projectId={projectId}
            index={index}
          />
          {data?.queries?.length - 1 !== index && <hr />}
        </Fragment>
      ))}
    </div>
  );
}

export default Queries;
