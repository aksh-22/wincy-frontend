import Image from "components/defaultImage/Image";
import bugModal from "css/BugModal.module.css";
import React, { memo, useState, useEffect } from "react";
import { ClickAwayListener, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useAddTodo } from "react-query/todo/useAddTodo";
import { errorToast } from "utils/toast";
import { useUpdateTodo } from "react-query/todo/useUpdateTodo";
import DragAndDrop from "components/DragAndDrop";
import { useSelector } from "react-redux";
import CommonDelete from "components/CommonDelete";
import { useDeleteTodo } from "react-query/todo/useDeleteTodo";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import DescriptionIcon from "@mui/icons-material/Description";
import TextInput from "components/textInput/TextInput";
import { LightTooltip } from "components/tooltip/LightTooltip";

function Todo({ data }) {
  const userType = useSelector((state) => state.userReducer?.userType);
  const [isOpen, setIsOpen] = useState(false);
  const [disabled] = useState(
    userType?.userId === data?.assignee?._id ? false : true
  );
  const { mutate: mutateUpdateTodo } = useUpdateTodo();

  const handleSortUpdate = (item) => {
    let sendData = {};
    let index = 0;
    item?.map((row) => {
      sendData[`${row?._id}`] = index++;
      return null;
    });

    let obj = {
      data: {
        todos: { ...sendData },
        assignee: data?.assignee?._id,
      },
      isSort: true,
      taskId: data?.taskId,
      orgId: data?.orgId,
      projectId: data?.projectId,
      milestoneId: data?.milestoneId,
      fromModule: "Milestone",
      sortData: item,
    };

    mutateUpdateTodo(obj);
  };

  return (
    <div
      style={{
        background: "#22274A",
        padding: 10,
        marginBottom: 20,
        borderRadius:8
      }}
    >
      <div
        className="d_flex alignCenter cursorPointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`milestone_arrowContainer ${
            isOpen ? "milestone_arrowContainer_90degree" : ""
          }`}
          style={{
            position: "relative",
            transform: isOpen ? "rotate(90deg)" : "inherit",
            marginRight: isOpen ? 10 : 0,
          }}
        >
          <ArrowRightIcon />
        </div>
        <div className="d_flex alignCenter flex">
          {
            <Image
              src={data?.assignee?.profilePicture}
              title={data?.assignee?.name}
              style={{
                height: 32,
                width: 32,
                fontSize: 16,
                border: "1px solid var(--defaultWhite)",
              }}
            />
          }{" "}
          &nbsp;&nbsp;
          <p className="ff_Lato_Bold">{data?.assignee?.name}'s To-Do</p>
        </div>
        <div>
          <p className="ralewayThinItalic " style={{ fontSize: 16 }}>
            {data?.completed}/{data?.todoLength}
          </p>
        </div>
      </div>

      {
        <div
          style={{
            display: isOpen ? "inherit" : "none",
          }}
        >
          {/* Add To Do Input */}
          <InputField data={data} />
          {/* Todo List */}
          <div
            style={{
              transition: `ease-in-out 3s !important`,
              minHeight: 10,
              maxHeight: 250,
              overflow: "auto",
            }}
          >
            <DragAndDrop
              data={data?.todo}
              renderComponent={<TodoRow data={data} disabled={disabled} />}
              onChange={handleSortUpdate}
              disabled={disabled}
            />
          </div>
        </div>
      }

      {/* {data?.todo?.map((item, index) => (
        <div
          key={item?._id}
          style={{
            background: item?.disabled ? "red" : "transparent",
          }}
        >
          <EditableRow
            apiKey={"title"}
            inputType="text"
            value={item?.title}
            nonTruncate
            onChange={handleUpdate}
            id={item?._id}
          />
        </div>
      ))} */}
    </div>
  );
}

export default memo(Todo);
const checkUserAccess = (data, userType) => {
  // console.log("data", data, userType);
  // console.log(data?.createdBy, userType?.userId);
  // if (["Admin", "Member++"].includes(userType?.userType)) return false;
  if (data?.createdBy === userType?.userId || data?.assignee === userType?.userId ) {
    return false;
  } else {
    return true;
  }
};
const TodoRow = memo(({ item, data, index }) => {
  // console.log("TodoRow render", item);
  const { mutate: mutateUpdateTodo } = useUpdateTodo();
  const { mutate: deleteMutate, isLoading: deleteLoading } = useDeleteTodo();
  const userType = useSelector((state) => state.userReducer?.userType);
  const [disabled, setDisabled] = useState(checkUserAccess(item, userType));
  useEffect(() => {
    setDisabled(checkUserAccess(item, userType));
  }, [item]);
  const handleUpdate = (value, id, key) => {
    const obj = {
      data: {
        [key ? key : "title"]: value,
        assignee: data?.assignee?._id,
      },
      taskId: data?.taskId,
      orgId: data?.orgId,
      projectId: data?.projectId,
      milestoneId: data?.milestoneId,
      todoId: item?._id,
      fromModule: "Milestone",
      key: key ? key : "title",
    };
    mutateUpdateTodo(obj);
  };
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div
      key={item?._id}
      style={{
        background: item?.disabled ? "rgba(255,255,255,0.1)" : "transparent",
        border: "1px solid #535274",
        padding: 10,
        // display: "flex",
        alignItems: "center",
        textDecoration: item?.completed ? "line-through" : "none",
        fontFamily: item?.completed ? "Lato-Italic" : "Lato-Regular",
        opacity: item?.completed ? 0.4 : 1,
      }}
    >
      <div className="alignCenter">
        <CheckBoxSquare
          isChecked={item?.completed}
          onClick={() => handleUpdate(!item?.completed, item?._id, "completed")}
          disabled={item?.disabled ?? disabled}
          className={`${
            item?.completed ? "checkedColor d_flex" : ""
          } p-0 pr-1_5`}
        />

        <EditableRow
          apiKey={"title"}
          inputType="text"
          value={item?.title}
          nonTruncate
          onChange={handleUpdate}
          id={item?._id}
          disabled={disabled}
        />
        <LightTooltip title="Description" arrow>
        <DescriptionIcon
          className="cursorPointer"
          onClick={() => setShowDescription(!showDescription)}
        />
        </LightTooltip>
        {!item?.disabled && !disabled && (
          <CommonDelete
            mutate={deleteMutate}
            isLoading={deleteLoading}
            data={{
              data: {
                todos: [item?._id],
                assignee: data?.assignee?._id,
              },
              taskId: data?.taskId,
              orgId: data?.orgId,
              projectId: data?.projectId,
              milestoneId: data?.milestoneId,
              todoId: item?._id,
              fromModule: "Milestone",
              todo: item,
            }}
          />
        )}
      </div>

      {/* description */}

      {showDescription && (
        <div className="alignCenter ">
          <CheckBoxSquare
            isChecked={item?.completed}
            onClick={() =>
              handleUpdate(!item?.completed, item?._id, "completed")
            }
            disabled={true}
            className={`${
              item?.completed ? "checkedColor d_flex" : ""
            } p-0 pr-1_5`}
            containerStyle={{ visibility: "hidden" }}
          />
          <DescriptionRow
            value={item?.description}
            onChange={handleUpdate}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
});

const InputField = ({ data }) => {
  const [input, setInput] = useState("");
  const [focused, setFocused] = React.useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const { mutate: mutateAddTodo } = useAddTodo();

  const handleSubmit = () => {
    if (input.length < 3) {
      return errorToast("Minimum 3 character required.");
    }
    let obj = {
      data: {
        title: input,
        assignee: data?.assignee?._id,
      },
      taskId: data?.taskId,
      orgId: data?.orgId,
      projectId: data?.projectId,
      milestoneId: data?.milestoneId,
      fromModule: "Milestone",
    };
    input?.trim()?.length && mutateAddTodo(obj);
    setInput("");
  };

  return (
    <div className="py-1">
      <div
        className={`${bugModal.commentInput} d_flex ${
          focused ? bugModal.focusedInput : "unFocused"
        } boxShadow`}
        style={{ marginBottom: 3 }}
      >
        <div
          className={bugModal.sideLine}
          style={{
            background: focused ? "var(--lightBlue)" : "var(--primary)",
          }}
        />
        <input
          type="text"
          name="prevent_autofill"
          id="prevent_autofill"
          value=""
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="password_fake"
          id="password_fake"
          value=""
          style={{ display: "none" }}
        />
        <input
          variant="naked"
          placeholder={`To-Do Title*`}
          value={input}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
              // else infoToast('Please enter a comment!');
            }
          }}
          autoFocus
          style={{ flex: 1, paddingLeft: 10 }}
          className="ralewaySemiBold"
        />
        <div
          className="parentInherit d_flex alignCenter"
          style={{
            background: focused ? "var(--lightBlue)" : "var(--primary)",
          }}
        >
          <IconButton onClick={() => handleSubmit()}>
            <AddIcon
              style={{
                color: "var(--defaultWhite)",
              }}
            />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const EditableRow = ({ value, onChange, id, disabled }) => {
  const [input, setInput] = useState(value);
  useEffect(() => {
    setInput(value);
  }, [value]);
  const [isEdit, setIsEdit] = useState(false);
  const handleSubmit = () => {
    if (value === input) {
      setIsEdit(false);
      return;
    }
    if (input?.trim()?.length === 0) {
      setInput(value);
      setIsEdit(false);
      return;
    }
    onChange(input, id);
    setIsEdit(false);
  };
  return !isEdit ? (
    <p
      onClick={() => !disabled && setIsEdit(true)}
      style={{
        flex: 1,
      }}
    >
      {value}
    </p>
  ) : (
    <ClickAwayListener onClickAway={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        autoFocus
      />
    </ClickAwayListener>
  );
};

const DescriptionRow = ({ value, onChange, id, disabled }) => {
  const [input, setInput] = useState(value);
  useEffect(() => {
    setInput(value);
  }, [value]);
  const [isEdit, setIsEdit] = useState(false);
  const handleSubmit = () => {
    if (value === input) {
      setIsEdit(false);
      return;
    }
    if (input?.trim()?.length === 0) {
      setInput(value);
      setIsEdit(false);
      return;
    }
    onChange(input, id , "description");
    setIsEdit(false);
  };
  return !isEdit ? (
    <p
      onClick={() => !disabled && setIsEdit(true)}
      style={{
        flex: 1,
        opacity: 0.5,
        fontSize: 13,
        fontFamily: "Lato-Light",
      }}
    >
      {value??"Click here to add description!!"}
    </p>
  ) : (
    <ClickAwayListener onClickAway={handleSubmit}>
      <TextInput
        // variant="outlined"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          console.log(e?.shiftKey);
          if (e.shiftKey && e.key === "Enter") {
            // form.submit();
            console.log("Line Break");
          } else if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        autoFocus
        multiline
        maxRows={3}
        style={{
          flex: 1,
        }}
      />
    </ClickAwayListener>
  );
};
