import { useSelector } from 'react-redux';
import CustomChip from 'components/CustomChip';

export default function TechnologyPopData({ technology }) {
  const technologies = useSelector(
    (state) => state.userReducer?.userData?.technologies
  );
  return   <div
         className="teamPopData_wrap boxShadow flexWrap justifyContent_around"
  style={{backgroundColor: "var(--newBlue)" , maxWidth:150}}
>
 {
         technology?.map(
          (x, i) =>
            i > 2 && (
              <div key={x}    className={`normalFont d_flex alignCenter justifyContent_center`} style={{padding:5}}>
                <CustomChip label={x} bgColor={technologies[x]} />
              </div>
            )
        )
 }
  </div>

}
