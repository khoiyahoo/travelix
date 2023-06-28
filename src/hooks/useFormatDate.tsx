import { useState, useEffect } from "react";

const useFormattedDate = (date) => {
  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(
    () => setFormattedDate(new Date(date).toLocaleDateString()),
    []
  );

  return formattedDate;
};

export default useFormattedDate;