import CustomChip from "components/CustomChip";
import React , {useState , useCallback} from "react";
import classes from "./MyLeads.module.css";
import DraftsOutlinedIcon from "@material-ui/icons/DraftsOutlined";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import { Link } from "react-router-dom";
import { textTruncateMore } from "utils/textTruncate";
import moment from "moment";
import { leadChipStatusColor } from "utils/leadChipStatusColor";
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import CustomSideBar from "components/customSideBar/CustomSideBar";
import LeadInfoSideBar from "./leadInfoSideBar/LeadInfoSideBar";
import { useSelector } from "react-redux";
import { useUpdateLead } from "react-query/lead/useUpdateLead";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { dateCondition } from "utils/dateCondition";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { LightTooltip } from "components/tooltip/LightTooltip";
import Image from "components/defaultImage/Image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

// const color = {
//   Active: "var(--chipGreen)",
//   Hold: "var(--chipYellow)",
//   Win: "var(--chipBlue)",
//   Lost: "var(--chipRed)",
//   "Unresponsive Query": "var(--chipOrange)",
//   "Response Awaited": "var(--chipPink)",
// };

export default function Card({
  name,
  status,
  email,
  country,
  dateContactedFirst,
  nextFollowUp,
  id,
  item,
  tabStatus
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    
  } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // width: "100px",
    // height: "100px",
    // border: "2px solid red",
    // backgroundColor: "#cccccc",
    // margin: "10px",
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.7 : 1,
    outline :"none",
    cursor:"pointer"
  };
  const  [modalOpen , setModalOpen] = useState(false)
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { mutate: mutateUpdate } = useUpdateLead(tabStatus);
  const onHandleUpdate = useCallback(
    (fieldName, fieldValue) => {
      const obj = {
        orgId: orgId,
        leadId: item?._id,
        leadStatus: item?.status,
        data: {
          [fieldName]: fieldValue,
        },
      };

      mutateUpdate(obj);
    },
    [orgId, item, mutateUpdate]
  );
  return (
    // ----------card Body------------
    < 
    >
      <div className={classes.card}
      ref={setNodeRef} style={style}
  onClick={(e) =>{
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true)
  }}
      >
        {/* ------card header-------- */}

        <div className={classes.card_header}>
        <div

onClick={(e) =>{
  
       e.preventDefault();
     e.stopPropagation()

}}
style={{
  cursor :"grab",
  // width:20,
  // display:"flex",
  // alignItems:"center",
  // justifyContent:"center"
}}

>
<DragIndicatorIcon 
style={{
  outline:"none"
}}
{...listeners} {...attributes}
/>
</div> 
          <h2
            style={{
              fontFamily: "Lato-bold",
              textTransform: "capitalize",
              color: "var(--defaultWhite)",
              flex:1
            }}
          >
            {name ? textTruncateMore(name, 15) : "N/A"}
          </h2>

          {/* ----custom chip ----------*/}

          <CustomChip
            label={status ?? "N/A"}
            bgColor={leadChipStatusColor[status]}
            style={{ padding: 8, fontSize: 12 }}
          />
        </div>

        {/* -------card info------ */}

        <div className={classes.card_info}>
          <div>
            
            {item?.managedBy?.length > 0 ? <div className={classes.card_info_el}>
              <LightTooltip title="Manager By" arrow>
              <div className="alignCenter">
<Image 
src={item?.managedBy?.[0]?.profilePicture}
title={item?.managedBy?.[0]?.name}

/>
<p>{item?.managedBy?.[0]?.name ? textTruncateMore(item?.managedBy?.[0]?.name, 25) : "N/A"}</p>


              </div>
              </LightTooltip>
            </div> : 
             <div className={classes.card_info_el}>
              <DraftsOutlinedIcon className={classes.icon} />
              <p>{email ? textTruncateMore(email, 25) : "N/A"}</p>
            </div>}
            <div className={classes.card_info_el}>
              <LocationOnOutlinedIcon className={classes.icon} />
              <p>{country ? textTruncateMore(country, 25) : "N/A"}</p>
            </div>
          </div>
          <div className={classes.card_Icn}>
          {item?.isFavourite ? (
              <FavoriteRoundedIcon
                style={{
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHandleUpdate("isFavourite", false)}}
              />
            ) : (
              <FavoriteBorderIcon
                style={{
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHandleUpdate("isFavourite", true)}}
              />
            )}
              {/* <FavoriteBorderRoundedIcon style={{
                fontSize:'16px'
              }}/> */}
          </div>
        </div>

        {/* -------card footer----- */}

        <div className={classes.card_footer}>
          <div className={classes.card_footer_left}>
            <p className={classes.dateType}>Contact Date</p>
            <div className={classes.card_footer_date}>
              <EventOutlinedIcon className={classes.icon} />
              <p>
                {dateContactedFirst
                  ? ( dateCondition(dateContactedFirst))
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className={classes.card_footer_right}>
            <p className={classes.dateType}>Next Contact Date</p>
            <div className={classes.card_footer_date}>
              <EventOutlinedIcon className={classes.icon} />
              <p>
                {nextFollowUp
                  ? (dateCondition(nextFollowUp))

                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
        <CustomSideBar
      show={modalOpen}
      toggle={() => setModalOpen(false)}
      >
        <LeadInfoSideBar info={item} 
  tabStatus={tabStatus}
  />
      </CustomSideBar>
    </>
  );
}
