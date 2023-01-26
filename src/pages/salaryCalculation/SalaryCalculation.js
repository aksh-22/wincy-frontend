import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "./SalaryCalculation.css";
import TextInput from "components/textInput/TextInput";
import notAuthorized from "assets/images/notAuthorized.png";
const total_hours = 9;
function SalaryCalculation() {
  // const orgId = useSelector(
  //   (state) => state.userReducer?.selectedOrganisation?._id
  // );
  //   const { data } = useOrganisationUsers(orgId);

  const [details, setDetails] = useState({
    date: moment(new Date()).format("YYYY-MM"),
    name: "",
    salary: "",
    leave: "",
    hour: "",
    officialLeave: "",
    cumulativeLeave: "",
    cumulativeLeaveGrant: "",
    extraWorkingHour: "",
  });
  const [numbers, setNumbers] = useState({
    saturday: 0,
    sunday: 0,
    holiday: 0,
  });
  const [officialHours, setOfficialHours] = useState("")

  const [finalSalary, setFinalSalary] = useState(0);
  const [error, setError] = useState("");
  const [otherDetails, setOtherDetails] = useState({
    monthlyHour: 0,
    remaining: 0,
    deductedAmount: 0,
    leaveBalance: 0,
  });
  const onHandleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cumulativeLeaveGrant") {
      if (parseFloat(details.cumulativeLeave || 0) >= parseFloat(value || 0)) {
        setDetails({
          ...details,
          [name]: value,
        });
        setError("");
      } else {
        setError("Figure is not greater then cumulative leave");
        // alert("Amount is greater then cumulative leave")
      }
    } else if (name === "cumulativeLeave") {
      setDetails({
        ...details,
        [name]: value,
        cumulativeLeaveGrant: "",
      });
      setError("");
    } else {
      setDetails({
        ...details,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    const { date } = details;
    let numberOfSunday = getNumberOfSunday(
      date.split("-")[1],
      date.split("-")[0]
    );
    let numberOfSaturday = getNumberOfSaturday(
      date.split("-")[1],
      date.split("-")[0]
    );
    setNumbers({
      ...numbers,
      saturday: numberOfSaturday?.length,
      sunday: numberOfSunday?.length,
    });
  }, [details?.date]);

  const getNumberOfSunday = (m, y) => {
    var days = new Date(y, m, 0).getDate();
    var sundays = [(8 - new Date(m + "/01/" + y).getDay()) % 7];
    for (var i = sundays[0] + 7; i <= days; i += 7) {
      sundays.push(i);
    }
    if (sundays.includes(0)) {
      let newSundays = sundays?.filter((item) => item !== 0);
      return newSundays;
    }
    return sundays;
  };

  const getNumberOfSaturday = (m, y) => {
    var days = new Date(y, m, 0).getDate();
    var sundays = [7 - new Date(m + "/01/" + y).getDay()];
    for (var i = sundays[0] + 7; i <= days; i += 7) {
      sundays.push(i);
    }
    return sundays;
  };
  useEffect(() => {
    const {
      date,
      hour,
      salary,
      officialLeave,
      cumulativeLeaveGrant,
    } = details;
    const { saturday, sunday } = numbers;
    let devotedHour = parseInt(hour || 0);
    let numberOfDaysInMonth = new Date(
      date.split("-")[0],
      date.split("-")[1],
      0
    ).getDate();
    // Calculate saturday leave
    let saturdayLeave = saturday % 2 === 0 ? saturday / 2 : 3;
    const remainingDays =
      numberOfDaysInMonth -
      (saturdayLeave + sunday + parseFloat(officialLeave || 0));
    const totalHourInMonth =
      (numberOfDaysInMonth -
        (saturdayLeave + parseFloat(officialLeave || 0) + sunday)) *
        total_hours -
      saturdayLeave * 1;
    let leaveDays = saturdayLeave + sunday + parseFloat(officialLeave || 0);
    if (totalHourInMonth <= devotedHour) {
      salaryCalculation(
        remainingDays,
        0,
        salary,
        totalHourInMonth,
        numberOfDaysInMonth,
        leaveDays
      );
    } else {
      let difference = totalHourInMonth - devotedHour;
      let cumulativeLeaveGrantHour = parseFloat(cumulativeLeaveGrant || 0) * total_hours;
      let afterGrace = difference - cumulativeLeaveGrantHour;
      if (afterGrace > 0) {
        let differenceInDay = roundOffValue(afterGrace);
        salaryCalculation(
          remainingDays,
          differenceInDay,
          salary,
          totalHourInMonth,
          numberOfDaysInMonth,
          leaveDays
        );
      } else {
        salaryCalculation(
          remainingDays,
          0,
          salary,
          totalHourInMonth,
          numberOfDaysInMonth,
          leaveDays
        );
        // setFinalSalary(salary);
      }
    }
  }, [details, numbers]);

  const roundOffValue = (value) => {
    let differenceInDay = value / total_hours;
    let roundOffValue = Math.round(differenceInDay);
    if (differenceInDay === 0.5 || differenceInDay % 2 === 0) {
      return differenceInDay;
    } else if (roundOffValue >= differenceInDay) {
      return roundOffValue;
    } else {
      return roundOffValue + 0.5;
    }
  };

  const salaryCalculation = (
    totalDays,
    difference,
    salary,
    totalHourInMonth,
    numberOfDaysInMonth,
    leaveDays
  ) => {
    const { cumulativeLeave, cumulativeLeaveGrant } = details;
    let finalSalaryTemp = salary - (salary / numberOfDaysInMonth) * difference;
    
    setFinalSalary(finalSalaryTemp);
    setOtherDetails({
      ...otherDetails,
      remaining: difference,
      deductedAmount: (salary / numberOfDaysInMonth) * difference,
      leaveBalance:
        parseFloat(cumulativeLeave || 0) -
        parseFloat(cumulativeLeaveGrant || 0),
      monthlyHour: totalHourInMonth,
    });
    setOfficialHours(totalHourInMonth-(details?.cumulativeLeaveGrant > 0 ? (details?.cumulativeLeaveGrant*total_hours) : 0))
  };

  const dateChangeByArrow = (value) => {
    const { date } = details;
    if (value === "+") {
      if (parseInt(date.split("-")[1]) + 1 === 13) {
        setDetails({
          ...details,
          date: `${parseInt(date.split("-")[0]) + 1}-01`,
        });
      } else {
        setDetails({
          ...details,
          date: `${date.split("-")[0]}-${appendZero(
            parseInt(date.split("-")[1]) + 1
          )}`,
        });
      }
    } else {
      if (parseInt(date.split("-")[1] - 1) === 0) {
        setDetails({
          ...details,
          date: `${parseInt(date.split("-")[0]) - 1}-12`,
        });
      } else {
        setDetails({
          ...details,
          date: `${date.split("-")[0]}-${appendZero(
            parseInt(date.split("-")[1]) - 1
          )}`,
        });
      }
    }
  };

  const appendZero = (myNumber) => {
    return myNumber.toString().length < 2 ? "0" + myNumber : myNumber;
  };
  const userType = useSelector(
    (state) => state.userReducer?.userType?.userType
  );
  const userEmail = useSelector(
    (state) => state?.userReducer?.userData?.user?.email
  );

  return !(userType === "Admin" || userEmail === "info@pairroxz.com") ? (
    <div className="d_flex alignCenter justifyContent_center flexColumn">
      <img src={notAuthorized} alt="notAuthorized" />
      <p style={{ fontSize: 18 }}>You are not authorized.</p>
    </div>
  ) : (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ArrowBackIosIcon
          className="mr-2 cursorPointer"
          onClick={() => dateChangeByArrow("-")}
        />
        <CustomDatePicker
          containerStyle={{
            width: "auto",
          }}
          defaultValue={moment(details?.date, "YYYY-MM").toDate()}
          calenderView="year"
          onClickMonth={(e) =>
            setDetails({ ...details, date: moment(e).format("YYYY-MM") })
          }
        >
          <div className="d_flex alignCenter cursorPointer">
            <p
              style={{
                fontSize: 24,
                fontFamily: "Lato-Bold",
                //   margin : "0 10px"
              }}
            >
              {moment(details?.date).format("MMMM YYYY")}
            </p>
          </div>
        </CustomDatePicker>
        <ArrowForwardIosIcon
          className="ml-2 cursorPointer"
          onClick={() => dateChangeByArrow("+")}
        />
      </div>
      <div>
        <ul className="listSalary">
          <li
            className="d_flex alignCenter"
            style={{
              color: "var(--green)",
            }}
          >
            {" "}
            <p>Sunday :</p> <div className="numberBox">{numbers?.sunday}</div>
          </li>

          <li
            className="d_flex alignCenter"
            style={{
              color: "var(--chipYellow)",
            }}
          >
            {" "}
            <p>Saturday Leave :</p>{" "}
            <div className="numberBox">
              {numbers?.saturday % 2 === 0 ? numbers?.saturday / 2 : 3}
            </div>
          </li>
          <li
            className="d_flex alignCenter"
            style={{
              color: "var(--red)",
            }}
          >
            <p>Official Holiday :</p>{" "}
            <div className="numberBox">{details?.officialLeave || 0}</div>
          </li>
          <li
            className="d_flex alignCenter"
            style={{
              color: "var(--primary)",
            }}
          >
            <p>Official Hours :</p>{" "}
            <div className="numberBox"
            >{otherDetails?.monthlyHour}</div>
          </li>
        </ul>
      </div>
      <div className="d_flex inputContainer my-4">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 0.7,
          }}
        >
          {/* <TextInput
            className="inputBox"
            type="text"
            placeholder="Employee Name"
            value={details.name}
            name="name"
            onChange={onHandleChange}
            autoFocus
            variant="outlined"
            label="Employee Name"
          /> */}

          <TextInput
            variant="outlined"
            label="Official Holiday"
            className="inputBox"
            type="number"
            placeholder="Official Holiday"
            value={details.officialLeave}
            name="officialLeave"
            onChange={onHandleChange}
          />

<TextInput
            variant="outlined"
            label="Cumulative Leaves"
            className="inputBox"
            type="number"
            placeholder="Cumulative Leaves"
            value={details.cumulativeLeave}
            name="cumulativeLeave"
            onChange={onHandleChange}
          />
          <TextInput
            variant="outlined"
            label="Cumulative Leaves Grant"
            className="inputBox"
            type="number"
            placeholder="Cumulative Leaves Grant"
            value={details.cumulativeLeaveGrant}
            name="cumulativeLeaveGrant"
            onChange={onHandleChange}
            error={error ? true : false}
            helperText={error}
          />


<TextInput
            variant="outlined"
            label="Official Hours"
            className="inputBox"
            type="number"
            placeholder="Official Hours"
            value={officialHours}
            name="hour"
            // onChange={onHandleChange}
            disabled
          />
          
          <TextInput
            variant="outlined"
            label="Total Devoted Hours"
            className="inputBox"
            type="number"
            placeholder="Total Devoted Hours"
            value={details.hour}
            name="hour"
            onChange={onHandleChange}
          />

<TextInput
            variant="outlined"
            label="Salary"
            className="inputBox"
            type="number"
            placeholder="Salary"
            value={details.salary}
            name="salary"
            onChange={onHandleChange}
          />
          

          {/* <TextInput
            variant="outlined"
            label="Extra Working Hours"
            className="inputBox"
            type="number"
            placeholder="Extra Working Hours"
            value={details.extraWorkingHour}
            name="extraWorkingHour"
            onChange={onHandleChange}

          /> */}
        </div>
        <div className=" alignCenter d_flex" style={{ flex: 0.3 }}>
          <div className="salaryBlock">
            <p className="mb-2">
              Deducted Salary for{" "}
              <span style={{ color: "var(--red)" }}>
                {otherDetails?.remaining} days
              </span>
            </p>
            <p className="mb-2">
              {details?.salary || 0}-
              <span style={{ color: "var(--red)" }}>
                {Math.trunc(otherDetails?.deductedAmount)}
              </span>
            </p>
            <p>Total Payment will be</p>
            <h1 className="my-2" style={{ fontSize: 42 }}>
              {parseInt(finalSalary) === 0 ? "0.00" : Math.trunc(finalSalary)}
            </h1>
            <p>
              Cumulative Leave Balance :{" "}
              <span>{otherDetails?.leaveBalance}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryCalculation;
