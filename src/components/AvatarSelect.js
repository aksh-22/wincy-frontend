import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import CustomAvatar from "./CustomAvatar";
import Image from "components/defaultImage/Image";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  MenuListProps: {
    style: {
      display: "flex",
      flexDirection: "column",
    },
  },
};

export default function MultipleSelectCheckmarks({
  menuItems = [],
  selectRenderComponent,
  value,
}) {
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        {/* <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel> */}
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) =>
            React.cloneElement(selectRenderComponent, {
              item: selected,
            })
          }
          MenuProps={MenuProps}
        >
          {menuItems.map((name) => (
            <MenuItem key={name} value={name}>
              {/* <Checkbox checked={personName.indexOf(name) > -1} /> */}
              <Image src={name?.profilePicture} title={name?.name} />
              <ListItemText primary={name?.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
