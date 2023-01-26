import { IconButton } from "@material-ui/core";
// import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import moment from "moment";
import React, { useState, useEffect , useRef } from "react";
import Calendar from "react-calendar";
// import "./cal.scss";
import "./calTest.scss";
// import EventsTimeline from "./EventsTimeline";
import TileContent from "./TileContent";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import SkipNextIcon from "@mui/icons-material/SkipNext";
// import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import { useSelector } from "react-redux";
// import CustomButton from "components/CustomButton";

// import { events } from "./events";
import { useEvent } from "react-query/events/useEvent";
import AddEvent from "./eventModal/AddEvent";
import CommonDialog from "components/CommonDialog";
import ModalContainer from "./eventModal/ModalContainer";
import { useSelector } from "react-redux";
import CommonDelete from "components/CommonDelete";
import { useDeleteEvent } from "react-query/events/useDeleteEvent";
const colors = {
  Private: "var(--primary)",
  holiday: "var(--progressBarColor)",
  milestone: "var(--red)",
  Public: "var(--green)",
};

const MyMonthlyCalendar = () => {
  const userEmail = useSelector(
    (state) => state?.userReducer?.userData?.user?.email
  );
  const { deleteEventMutate , deleteLoading } = useDeleteEvent();
  const [currDate, setCurrDate] = useState(Date.now());
  const [currentMonthDate, setCurrentMonthDate] = useState(
    moment().format("MM-YYYY")
  );
  const messagesEndRef = useRef(null)
  const userType = useSelector((state) => state.userReducer?.userType);
  // const [prevDate, setPrevDate] = useState(Date.now());
  // const [viewType, setViewType] = useState("month");
  const [clickX, setClickX] = useState(0);

  // const [flipCard, setFlipCard] = useState(false);

  // const userData = useSelector((state) => state?.userReducer?.userData?.user);

  // const name = userData.name.split(" ")[0];

  const classController = (date) => {
    // setFlipCard(true);
    // setTimeout(() => {
    //   setCurrDate(date);
    // }, 60);
    setTimeout(() => {
      // setFlipCard(false);
      // setPrevDate(date);
    }, 1000);
  };

  let time;
  const hour = moment().hour();

  if (hour > 16) {
    time = "Good evening";
  } else if (hour > 11) {
    time = "Good afternoon";
  } else {
    time = "Good morning";
  }

  useEffect(() => {
    refetch();
  }, [currentMonthDate]);
  const onViewChange = ({ action, activeStartDate, value, view }) => {
    // setViewType(view);
    let newValue = moment(activeStartDate).format("MM-YYYY");
    console.log("newValue" , newValue)
    if (newValue !== currentMonthDate) {
      setCurrentMonthDate(newValue);
    }
    console.log("newValue", newValue, currentMonthDate);
  };

  const { refetch, data, events } = useEvent(currentMonthDate);
  console.log("data", currentMonthDate);

  const monthChangeByArrow = (value) => {
    const date = currentMonthDate;
    if (value === "+") {
      if (parseInt(date.split("-")[0]) + 1 === 13) {
        setCurrentMonthDate(`01-${parseInt(date.split("-")[1]) + 1}`);
      } else {
        setCurrentMonthDate(
          `${parseInt(date.split("-")[0]) + 1}-${date.split("-")[1]}`
        );
      }
    } else {
      if (parseInt(date.split("-")[0] - 1) === 0) {
        console.log("true");
        setCurrentMonthDate(`12-${parseInt(date.split("-")[1]) - 1}`);
      } else {
        console.log("false");
        setCurrentMonthDate(
          `${parseInt(date.split("-")[0]) - 1}-${date.split("-")[1]}`
        );
      }
    }
  };
  return (
    <>
      {/* <div style={{ margin: 10 }}>
        <h2>
          {time} ,<span style={{ color: "var(--primary)" }}> {name}</span>{" "}
        </h2>
        {console.log(name)}
      </div> */}

      <div className="calendar">
        {/* <div style={{ padding: 10 }} className="dateComponent"></div> */}
        <Calendar
          className="mainCalComp"
          prevLabel={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <IconButton
                className="btn"
                onClick={() => monthChangeByArrow("-")}
              >
                <ChevronLeftIcon />
              </IconButton>
              {/* <CustomButton>Today</CustomButton> */}
            </div>
          }
          nextLabel={
            <IconButton className="btn" onClick={() => monthChangeByArrow("+")}>
              <NavigateNextIcon />
            </IconButton>
          }
          next2Label={<p></p>}
          prev2Label={<p></p>}
          tileClassName="tiles"
          tileContent={({ activeStartDate, date, view }) => (
            <TileContent
              data={events[moment(date).format("DD-MM-YYYY")]}
              currDate={currDate}
              date={date}
              clickX={clickX}
            />
          )}
          onClickDay={(date, e) => {

            setClickX(e.clientX);
            setCurrDate(date);
            console.log(date, currDate);
            moment(date).format("DD-MM-YYYY") !==
              moment(currDate).format("DD-MM-YYYY") && classController(date);
setTimeout(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  
}, 500);
            }}
          onViewChange={onViewChange}
          // onViewChange={() =>alert("View Change")}
          // onChange={() => alert("On change")}
          // onDrillUp = {({ activeStartDate, view }) => alert('Drilled up to: ', activeStartDate , view)}
        />
        <div className="dateInfo">
          {/* <div className="calCover">
          <time
            style={{ position: "absolute" }}
            datetime={moment(prevDate).format("DD-MM-YYYY")}
            class={`icon ${flipCard && "flipp"}`}
          >
            <em>{moment(prevDate).format("dddd")}</em>
            <strong>{moment(prevDate).format("MMM")}</strong>
            <span>{moment(prevDate).format("DD")}</span>
          </time>
          <time datetime={moment(currDate).format("DD-MM-YYYY")} class="icon">
            <em>{moment(currDate).format("dddd")}</em>
            <strong>{moment(currDate).format("MMM")}</strong>
            <span>{moment(currDate).format("DD")}</span>
          </time>
        </div> */}

          <ul className="eventsList">
            <CommonDialog
              minWidth={"30vw"}
              actionComponent={
                <AddEvent
                  title="Add Event"
                  style={{
                    backgroundColor: colors["holiday"],
                  }}
                />
              }
              modalTitle="Add Event"
              content={<ModalContainer date={currDate} />}
            />
           {!events[moment(currDate).format("DD-MM-YYYY")]?.length &&  <div ref={messagesEndRef} />}

            {events[moment(currDate).format("DD-MM-YYYY")]?.length
              ? events[moment(currDate).format("DD-MM-YYYY")]?.map(
                  (el, index) => {
                    return (
                     <React.Fragment
                     key={index}
                     
                     >
                       <li
                        className="eventsListEl"
                        style={{ backgroundColor: colors[el.type]  }}
                      >
                        <div style={{ display: "flex", flex: 1 }}>
                          <div className="flex"
                       
                          >
                            <p>{el?.title} </p>
                            <p
                            style={{
                          color :"rgba(239, 239, 239, 0.9)"
                            }}
                            >{el?.description}</p>{" "}
                          </div>
                          {
                            (((el?.category !== "Milestone" && ["Admin" , "Member++"].includes(userType?.userType) ) || el?.type === "Private") || (userEmail === "info@pairroxz.com"))&& <div className="alignCenter">
                            <CommonDialog
                              minWidth={"30vw"}
                              actionComponent={<AddEvent type="edit" />}
                              modalTitle="Edit Event"
                              content={
                                <ModalContainer date={currDate} data={el} />
                              }
                            />

                            <CommonDelete
                              arrow
                              mutate={deleteEventMutate}
                              isLoading={deleteLoading}
                              data={{
                                type:
                                  el?.type === "Private" ? "private" : "public",
                                eventId: el?._id,
                                date : moment(currDate).format("MM-YYYY")
                              }}
                            />
                          </div>
                          }
                          
                        </div>
                      </li>
           {index === 0 &&  <div ref={messagesEndRef} />}

                     </React.Fragment>
                      
                    );
                  }
                )
              : // <p>No Event on this date</p>
                ""}
          </ul>
          {/* <EventsTimeline
          data={data[moment(currDate).format("DD-MM-YYYY")]}
          date={moment(currDate).format("DD")}
          day={moment(currDate).format("dddd")}
        /> */}
          {/* <ul className="info">
            <li style={{ color: "var(--red)" }}>milestone</li>
            <li style={{ color: "var(--progressBarColor)" }}>holiday</li>
            <li style={{ color: "var(--primary)" }}>personal</li>
            <li style={{ color: "var(--green)" }}>other</li>
          </ul> */}
        </div>
      </div>
    </>
  );
};

export default MyMonthlyCalendar;
