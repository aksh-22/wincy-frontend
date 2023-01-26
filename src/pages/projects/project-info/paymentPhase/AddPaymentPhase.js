import {
  createPaymentPhase,
  updatePaymentPhaseMilestone,
} from "api/paymentPhase";
import CustomButton from "components/CustomButton";
import CustomInput from "components/customInput/CustomInput";
import CustomSelect from "components/CustomSelect";
import { useProjectTeam } from "hooks/useUserType";
import React, { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { useMilestones } from "react-query/milestones/useMilestones";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "utils/textTruncate";
import { usePaymentPhase } from "react-query/invoice/usePaymentPhase";

function AddPaymentPhase({ onClose }) {
  const { currency } = useSelector((state) => state.userReducer?.userData);
  const { orgId, projectId } = useProjectTeam();
  const { data } = useMilestones(orgId, projectId);
  const [selectedMilestone, setSelectedMilestone] = useState(["Milestone"]);
  const query = useQueryClient();

  const [details, setDetails] = useState({
    title: "",
    description: "",
    currency: "Currency*",
    amount: "",
  });
  const [error, setError] = useState({
    title: "",
    description: "",
    currency: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: paymentPhaseList } = usePaymentPhase({
    projectId,
    orgId,
  });

  const [milestoneData, setMilestoneData] = useState([])
  useEffect(() => {
    if(paymentPhaseList && data){
    let tempMilestone=   paymentPhaseList?.filter((item) => item?.milestoneIds?.length > 0);
    tempMilestone = tempMilestone?.map((item) => item?.milestoneIds?.map((row) => row))
    tempMilestone = tempMilestone?.flat()
    let tempMilestoneList = data[3]?.milestonesData?.filter((item) => !tempMilestone?.includes(item?._id));
    setMilestoneData(tempMilestoneList)
    }
  }, [paymentPhaseList ,  data[3]?.milestonesData]);

  const onMilestoneChange = useCallback((event) => {
    const { value } = event?.target;
    let temp = value?.filter((item) => item !== "Milestone");
    setSelectedMilestone(
      temp?.length === 0 || temp === undefined ? ["Milestone"] : [...temp]
    );
  }, []);

  const onSubmit = () => {
    const { title, currency, amount, description } = details;
    let tempError = error;
    let isError = false;
    if (!title?.trim()?.length) {
      isError = true;
      tempError = {
        ...tempError,
        title: "Title field is required.",
      };
    }

    if (currency === "Currency*") {
      isError = true;
      tempError = {
        ...tempError,
        currency: "Currency field is required.",
      };
    }

    if (amount === "") {
      isError = true;
      tempError = {
        ...tempError,
        amount: "Amount field is required.",
      };
    }

    if (amount <= 0 && amount !== "") {
      isError = true;
      tempError = {
        ...tempError,
        amount: "Amount is greater than zero",
      };
    }

    if (isError) {
      return setError(tempError);
    }
    setIsLoading(true);
    createPaymentPhase({
      orgId,
      projectId,
      data: {
        title,
        description,
        amount: Number(amount),
        currency,
      },
    })
      .then((res) => {
        if (selectedMilestone[0] === "Milestone") {
          setIsLoading(false);

          let paymentPhaseList = query.getQueryData([
            "paymentPhase",
            orgId,
            projectId,
          ]);
          paymentPhaseList.unshift({
            ...res,
          });
          query.setQueryData(
            ["paymentPhase", orgId, projectId],
            paymentPhaseList
          );
          onClose();
        }

        selectedMilestone?.length > 0 &&
          selectedMilestone[0] !== "Milestone" &&
          updatePaymentPhaseMilestone({
            orgId,
            projectId,
            data: {
              newMilestones: selectedMilestone?.map((item) => item?._id),
              paymentPhaseId: res?._id,
            },
          })
            .then((_res) => {
              let paymentPhaseList = query.getQueryData([
                "paymentPhase",
                orgId,
                projectId,
              ]);
              console.log("_res" , _res);
              paymentPhaseList.unshift({
                ..._res,
                milestones : selectedMilestone,
              });
              query.setQueryData(
                ["paymentPhase", orgId, projectId],
                paymentPhaseList
              );
            })
            .finally(() => {
              setIsLoading(false);
              onClose();
            });
      })
      .catch((err) => setIsLoading(false));
  };

  const onChangeText = (event) => {
    const { value, name } = event?.target;
    setDetails({
      ...details,
      [name]: value,
    });
    error?.[name] &&
      setError({
        ...error,
        [name]: "",
      });
  };
  return (
    <div>
      <CustomInput
        placeholder={"Title*"}
        wrapperClassName="mb-2"
        error={error?.title}
        value={details?.title}
        name="title"
        onChange={onChangeText}
      />

      <CustomInput
        placeholder={"Amount*"}
        wrapperClassName="mb-2"
        error={error?.amount}
        value={details?.amount}
        name="amount"
        onChange={onChangeText}
      />

      <CustomSelect
        variant={"outlined"}
        placeholder="Currency*"
        menuItems={currency ?? []}
        error={error?.currency}
        value={details?.currency}
        name="currency"
        labelClassName={"normalFont"}
        containerClassName={"selectOutlined mb-2"}
        handleChange={onChangeText}
        errorText={error?.currency}
        errorStyle={{ marginLeft: 0 }}
      />

      <CustomSelect
        variant={"outlined"}
        placeholder={"Milestone"}
        menuItems={milestoneData?? []}
        value={selectedMilestone}
        handleChange={onMilestoneChange}
        menuRenderComponent={<SelectRender />}
        selectRenderComponent={<SelectRender />}
        labelClassName={"normalFont"}
        containerClassName={"selectOutlined mb-2"}
        multiple
      />

      <CustomInput
        placeholder={"Description"}
        type="textarea"
        wrapperClassName="mb-2"
        error={error?.description}
        value={details?.description}
        name="description"
        onChange={onChangeText}
      />
      <div className="justifyContent_end alignCenter">
        <CustomButton type="outlined" className={"mr-2"} onClick={onClose}>
          <p>Close</p>
        </CustomButton>
        <CustomButton onClick={onSubmit} loading={isLoading}>
          <p>Add</p>
        </CustomButton>
      </div>
    </div>
  );
}

export default AddPaymentPhase;

function SelectRender({ item, selected }) {
  return selected ? (
    <div className={`normalFont d_flex alignCenter textEllipse`}>
      <p className="textEllipse">
        {" "}
        {item
          ?.map((row) =>
            row === "Milestone"
              ? "Milestone"
              : capitalizeFirstLetter(row?.title)
          )
          .join()}
      </p>
    </div>
  ) : (
    <div className={`normalFont d_flex alignCenter textEllipse`}>
      <p className="pl-1 textEllipse"> {capitalizeFirstLetter(item?.title)}</p>
    </div>
  );
}
