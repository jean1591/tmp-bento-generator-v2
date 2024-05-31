"use client";

import { Bento, classNames } from "@/utils";
import {
  CellCoordinates,
  setBento,
} from "./lib/store/features/bentoSettings/slice";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "./lib/store/store";
import { cloneDeep } from "lodash";
import { useState } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const bento = useSelector((state: RootState) => state.bentoSettings.bento);

  const [cellOne, setCellOne] = useState<CellCoordinates | null>(null);
  const [cellTwo, setCellTwo] = useState<CellCoordinates | null>(null);

  const handleCellOnClick = (rowIndex: number, columnIndex: number) => {
    const isSelectedCellOne = isCellCurrentCell(cellOne, rowIndex, columnIndex);
    const isSelectedCellTwo = isCellCurrentCell(cellTwo, rowIndex, columnIndex);

    // Cancel selectedCellOne
    if (cellOne && isSelectedCellOne) {
      setCellOne(null);
      return;
    }

    // Cancel selectedCellTwo
    if (cellTwo && isSelectedCellTwo) {
      setCellTwo(null);
      return;
    }

    // Select selectedCellOne
    if ((!cellOne && cellTwo) || (!cellOne && !cellTwo)) {
      setCellOne({ rowIndex, columnIndex });
      return;
    }

    // Select selectedCellTwo
    if (cellOne) {
      setCellTwo({ rowIndex, columnIndex });
      return;
    }
  };

  const handleMerge = () => {
    if (!cellOne || !cellTwo) {
      return;
    }

    // Find most up left cell
    let cellToUpdate = cellOne;
    let cellToHide = cellTwo;

    if (
      cellOne?.columnIndex ** 2 + cellOne?.rowIndex ** 2 >
      cellTwo?.columnIndex ** 2 + cellTwo?.rowIndex ** 2
    ) {
      cellToUpdate = cellTwo;
      cellToHide = cellOne;
    }

    // TODO: check cellToUpdate.row/columIndex +/- 1 cellToCheck.row/columIndex
    // Update horizontal
    if (cellToUpdate.rowIndex === cellToHide.rowIndex) {
      const updatedBento = cloneDeep(bento);

      const currentCellLength =
        bento[cellToUpdate.rowIndex][cellToUpdate.columnIndex][0];

      updatedBento[cellToUpdate.rowIndex][cellToUpdate.columnIndex] = [
        currentCellLength + 1,
        1,
      ];
      updatedBento[cellToHide.rowIndex][cellToHide.columnIndex] = [0, 0];

      dispatch(setBento(updatedBento));
    }
    // Update vertical
    else if (cellToUpdate.columnIndex === cellToHide.columnIndex) {
      const updatedBento = cloneDeep(bento);

      updatedBento[cellToUpdate.rowIndex][cellToUpdate.columnIndex] = [1, 2];
      updatedBento[cellToHide.rowIndex][cellToHide.columnIndex] = [0, 0];

      dispatch(setBento(updatedBento));
    }

    setCellOne(null);
    setCellTwo(null);

    return;
  };

  return (
    <div className="mt-20">
      <div className="flex items-center justify-center">
        <button
          className={classNames(
            cellOne && cellTwo ? "bg-blue-800" : "bg-slate-400",
            "text-center text-slate-200 px-7 py-3 rounded-lg"
          )}
          onClick={handleMerge}
        >
          Merge
        </button>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-5">
        {bento.map((row, rowIndex) =>
          row.map((size, columnIndex) => {
            if (size[0] !== 0 && size[1] !== 0) {
              return (
                <div
                  key={[rowIndex, columnIndex].toString()}
                  className={classNamesGenerator(
                    size,
                    cellOne,
                    cellTwo,
                    rowIndex,
                    columnIndex
                  )}
                  onClick={() => handleCellOnClick(rowIndex, columnIndex)}
                >
                  <p className="text-center text-black">
                    {`(${columnIndex}, ${rowIndex})`}
                  </p>
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}

const isCellCurrentCell = (
  firstCell: CellCoordinates | null,
  rowIndex: number,
  columnIndex: number
): boolean => {
  return (
    firstCell !== null &&
    firstCell.columnIndex === columnIndex &&
    firstCell.rowIndex === rowIndex
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
    size[0] === 3 ? "col-span-3" : "",
    size[0] === 2 ? "col-span-2" : "",
    // size[1] is row span
    size[1] === 3 ? "row-span-3" : "",
    size[1] === 2 ? "row-span-2" : "",
    isCellCurrentCell(cellOne, rowIndex, columnIndex)
      ? "border-red-100 bg-red-200 shadow-2xl"
      : "",
    isCellCurrentCell(cellTwo, rowIndex, columnIndex)
      ? "border-green-100 bg-green-200 shadow-2xl"
      : "",
    "border min-h-32 transition ease-in-out duration-500 rounded-lg border-blue-100 bg-blue-200 shadow-sm"
  );
};