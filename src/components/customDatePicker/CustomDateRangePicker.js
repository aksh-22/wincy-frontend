import { useTheme } from "@material-ui/core/styles";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  createStaticRanges,
  DateRangePicker,
  defaultStaticRanges,
} from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function CustomDateRangePicker({ onChange, value }) {
  const theme = useTheme();
  const [ranges, setRanges] = useState([
    {
      startDate: null,
      endDate: null,
      key: "rollup",
    },
  ]);

  useEffect(() => {
    if (ranges[0]?.startDate) {
      if (
        // moment(ranges[0]?.startDate)?.format("MM-DD-YYYY") !==
        // moment(ranges[0]?.endDate)?.format("MM-DD-YYYY")
        true
      ) {
        onChange &&
          onChange({
            startDate: moment(ranges[0]?.startDate)?.format("MM-DD-YYYY"),
            endDate: moment(ranges[0]?.endDate)?.format("MM-DD-YYYY"),
            key: "rollup",
          });
      }
    }
  }, [ranges]);

  const staticRanges = createStaticRanges([
    ...defaultStaticRanges,
    {
      label: "This Year",
      range: () => ({
        startDate: moment().startOf("year").toDate(),
        endDate: moment().endOf("day").toDate(),
      }),
    },
    {
      label: "Last Year",
      range: () => ({
        startDate: moment().subtract(1, "years").startOf("year").toDate(),
        endDate: moment().subtract(1, "years").endOf("year").toDate(),
      }),
    },
  ]);

  return (
    <DateRangePicker
      startDatePlaceholder="Start Date"
      endDatePlaceholder="End Date"
      rangeColors={[theme.palette.primary.main]}
      ranges={ranges}
      onChange={(ranges) => setRanges([ranges.rollup])}
      staticRanges={staticRanges}
      inputRanges={[]}
    />
  );
}

export default CustomDateRangePicker;
