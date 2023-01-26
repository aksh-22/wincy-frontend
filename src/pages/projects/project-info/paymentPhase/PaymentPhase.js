import CommonDialog from "components/CommonDialog";
import React from "react";
import { usePaymentPhase } from "react-query/invoice/usePaymentPhase";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import AddPaymentPhase from "./AddPaymentPhase";
import "./PaymentPhase.scss";
import PaymentPhaseRow from "./PaymentPhaseRow";
function PaymentPhase({ projectId, orgId, showAddPhase, setShowAddPhase }) {
  const { isLoading, data } = usePaymentPhase({
    projectId,
    orgId,
  });
  return (
    <div className="paymentPhaseContainer">
      {showAddPhase && (
        <CommonDialog
          shouldOpen
          minWidth={"30vw"}
          OtherClose={() => setShowAddPhase(false)}
          modalTitle="Add Payment Phase"
          content={<AddPaymentPhase onClose={() => setShowAddPhase(false)} />}
        />
      )}

      <div className="paymentPhase_headingRow">
        <p>Title</p>
        <p />
        <p className="textCenter">Amount</p>
        <p className="textCenter">Currency</p>
        <p className="textCenter">Status</p>
      </div>
      {isLoading ? (
        <TableRowSkeleton count={4} />
      ) : (
        data?.map((item , index) => (
          <PaymentPhaseRow key={item?._id} item={item} orgId={orgId} projectId={projectId} index={index}/>
        ))
      )}
    </div>
  );
}

export default PaymentPhase;
