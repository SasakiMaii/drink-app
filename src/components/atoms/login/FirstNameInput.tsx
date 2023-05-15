import React, { ChangeEvent } from "react";
import { SecondaryInput } from "../input/Input";

type FirstNameProps = {
  firstName: string;
  errorFirstName: boolean;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  errorLastName: boolean;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const FirstNameInput = (props: FirstNameProps) => {
  const {
    firstName,
    errorFirstName,
    setFirstName,
    lastName,
    errorLastName,
    onBlur,
  } = props;
  return (
    <SecondaryInput
      name="firstName"
      type="text"
      label="姓"
      required
      placeholder="例）ラクス"
      helperText={(() => {
        if (errorFirstName && firstName === "") {
          return "姓を入力してください";
        }
        if (
          (!errorFirstName && errorLastName && lastName === "") ||
          (errorFirstName &&
            errorLastName &&
            lastName === "" &&
            firstName !== "")
        ) {
          return " ";
        }
      })()}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setFirstName(e.target.value)
      }
      error={errorFirstName && firstName === ""}
      onBlur={onBlur}
      style={{ height: "100%" }}
    />
  );
};

export default FirstNameInput;
