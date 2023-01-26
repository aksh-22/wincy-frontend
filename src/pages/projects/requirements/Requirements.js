import React from "react";
import RequirementInputField from "./RequirementInputField";
import RequirementRow from "./RequirementRow";

function Requirements({ title, data = [] }) {
  return (
    <div
      style={{
        backgroundColor: "#22274A",
        // border:"1px solid #535274",
        padding: 10,
      }}
    >
      <p className="ralewaySemiBold" style={{ fontSize: 18 }}>
        {title}
      </p>

      <RequirementInputField />

      {new Array(5)
        .fill({
          createdBy: [
            {
              _id: "60e41d6d299e6a307ebf8ecb",
              name: "Pratik Purohit",
              email: "necixy@hotmail.com",
            },
          ],
          title: "Sed ut perspiciatis unde omnis iste natus error sit",
          createdAt: "2021-07-06T09:07:57.312Z",
          completed : false
        })
        .map((item, index) => (
          <RequirementRow key={index} data={item} index={index} />
        ))}
    </div>
  );
}

export default Requirements;
