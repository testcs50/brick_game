import { useEffect } from "react";
import { useStore } from "../../../store/store";
import { GridCell } from "../grid-cell/GridCell";
import "./Grid.css";

export const Grid = () => {
  const { grid, timerCallback, level } = useStore();

  useEffect(() => {
    const intervalId = setInterval(timerCallback, 1000 - (level - 1) * 100);
    return () => clearInterval(intervalId);
  }, [level, timerCallback]);

  return (
    <div className="grid-container">
      {grid.map((row, i) => (
        i > 3
          ? (<div key={i} className="row">
              {row.map((elem, index) => (
                <GridCell key={index} opacity={elem ? 1 : 0.03} />
              ))}
            </div>)
          : null
      ))}
    </div>
  );
};
