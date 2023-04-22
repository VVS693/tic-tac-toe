import { useEffect, useState } from "react";
import { FieldData } from "./types";

export const useNewGame = () => {


const initialData = [
    Array(3).fill(FieldData.NULL),
    Array(3).fill(FieldData.NULL),
    Array(3).fill(FieldData.NULL),
]

  const [dataField, setDataField] = useState<FieldData[][]>(initialData);



  return { dataField, setDataField, initialData };
};
