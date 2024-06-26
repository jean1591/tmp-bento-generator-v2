import { CellCoordinates, classNames, isCellCurrentCell } from "@/utils";
import {
  setMergeButtonDisable,
  setSelectedCellOne,
  setSelectedCellTwo,
} from "../lib/store/features/bentoSettings/slice";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../lib/store/store";
import { useEffect } from "react";

export const Bento = () => {
  const dispatch = useDispatch();
  const { bento, columnNumber, selectedCellOne, selectedCellTwo } = useSelector(
    (state: RootState) => state.bentoSettings
  );

  const handleCellOnClick = (rowIndex: number, columnIndex: number) => {
    const isSelectedCellOne = isCellCurrentCell(
      selectedCellOne,
      rowIndex,
      columnIndex
    );
    const isSelectedCellTwo = isCellCurrentCell(
      selectedCellTwo,
      rowIndex,
      columnIndex
    );

    // Cancel selectedCellOne
    if (selectedCellOne && isSelectedCellOne) {
      dispatch(setSelectedCellOne(null));
      return;
    }

    // Cancel selectedCellTwo
    if (selectedCellTwo && isSelectedCellTwo) {
      dispatch(setSelectedCellTwo(null));
      return;
    }

    // Select selectedCellOne
    if (
      (!selectedCellOne && selectedCellTwo) ||
      (!selectedCellOne && !selectedCellTwo)
    ) {
      dispatch(setSelectedCellOne({ rowIndex, columnIndex }));
      return;
    }

    // Select selectedCellTwo
    if (selectedCellOne) {
      dispatch(setSelectedCellTwo({ rowIndex, columnIndex }));

      return;
    }
  };

  useEffect(() => {
    if (selectedCellOne && selectedCellTwo) {
      dispatch(setMergeButtonDisable(false));
    } else if (
      selectedCellOne &&
      !selectedCellTwo &&
      (bento[selectedCellOne.rowIndex][selectedCellOne.columnIndex][0] !== 1 ||
        bento[selectedCellOne.rowIndex][selectedCellOne.columnIndex][1] !== 1)
    ) {
      dispatch(setMergeButtonDisable(false));
    } else {
      dispatch(setMergeButtonDisable(true));
    }
  }, [selectedCellOne, selectedCellTwo]);

  return (
    <div
      className={classNames(
        columnNumber === 3 ? "grid-cols-3" : "",
        columnNumber === 4 ? "grid-cols-4" : "",
        columnNumber === 5 ? "grid-cols-5" : "",
        columnNumber === 6 ? "grid-cols-6" : "",
        columnNumber === 7 ? "grid-cols-7" : "",
        columnNumber === 8 ? "grid-cols-8" : "",
        "grid gap-4"
      )}
    >
      {bento.map((row, rowIndex) =>
        row.map((size, columnIndex) => {
          if (size[0] !== 0 && size[1] !== 0) {
            return (
              <div
                key={[rowIndex, columnIndex].toString()}
                className={classNamesGenerator(
                  size,
                  selectedCellOne,
                  selectedCellTwo,
                  rowIndex,
                  columnIndex
                )}
                onClick={() => handleCellOnClick(rowIndex, columnIndex)}
              >
                <p className="text-center"></p>
              </div>
            );
          }
        })
      )}
    </div>
  );
};

const classNamesGenerator = (
  size: number[],
  cellOne: CellCoordinates | null,
  cellTwo: CellCoordinates | null,
  rowIndex: number,
  columnIndex: number
) => {
  return classNames(
    // size[0] is column span
    size[0] === 7 ? "col-span-7" : "",
    size[0] === 6 ? "col-span-6" : "",
    size[0] === 5 ? "col-span-5" : "",
    size[0] === 4 ? "col-span-4" : "",
    size[0] === 3 ? "col-span-3" : "",
    size[0] === 2 ? "col-span-2" : "",
    // size[1] is row span
    size[1] === 7 ? "row-span-7" : "",
    size[1] === 6 ? "row-span-6" : "",
    size[1] === 5 ? "row-span-5" : "",
    size[1] === 4 ? "row-span-4" : "",
    size[1] === 3 ? "row-span-3" : "",
    size[1] === 2 ? "row-span-2" : "",
    isCellCurrentCell(cellOne, rowIndex, columnIndex) ||
      isCellCurrentCell(cellTwo, rowIndex, columnIndex)
      ? "bg-indigo-950/80 shadow-2xl"
      : "bg-indigo-950/30 shadow-sm",
    "min-h-20 transition ease-in-out duration-500 rounded-lg"
  );
};
