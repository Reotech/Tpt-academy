import React from "react";
import { useFormikContext } from "formik";

import AppPicker from "./AppPicker";
// import ErrorMessage from "./ErrorMessage";

function AppFormPicker({
  items,
  name,
  placeholder,
  numberOfColumns,
  PickerItemComponent,
}) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  return (
    <>
      <AppPicker
        numberOfColumns={numberOfColumns}
        PickerItemComponent={PickerItemComponent}
        items={items}
        onSelectItem={(item) => setFieldValue(name, item)}
        placeholder={placeholder}
        selectedItem={values[name]}
      />
      {/* <ErrorMessage error={errors[name]} visible={touched[name]} /> */}
    </>
  );
}

export default AppFormPicker;
