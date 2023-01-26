import React from 'react';
import CustomAvatar from './CustomAvatar';

export default function TeamPopData({ team }) {
  return (
    <div
      className="teamPopData_wrap boxShadow"
  style={{backgroundColor: "var(--newBlue)",}}
    >
      {team?.map(
        (x, i) =>
          i > 2 && (
            <div
              key={i}
              className={`normalFont d_flex alignCenter p-1 commonHover ${team.length-1 !== i ? "divider" : ""}`}
            >
              <div style={{ marginRight: '10px' }}>
                <CustomAvatar
                  variant="circular"
                  medium
                  src={x.profilePicture}
                  title={x.name}
                />
              </div>

              <p>{x.name}</p>
            </div>
          )
      )}
    </div>
  );
}
