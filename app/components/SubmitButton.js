import React from "react";
import { useFormikContext } from "formik";

import AppButton from "./AppButton";

function SubmitButton({ title, bgColor, txtColor }) {
  const { handleSubmit } = useFormikContext();
  return (
    <AppButton
      bgColor={bgColor}
      txtColor={txtColor}
      title={title}
      onPress={handleSubmit}
    />
  );
}

export default SubmitButton;
