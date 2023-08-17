import "./RightPanel.css";
import { GridCell } from "../grid-cell/GridCell";
import { useStore } from "../../../store/store";
import { useMemo } from "react";
import { deepCopy } from "../../../store/utils";
import { blocks } from "../../../store/consts";

const rows = new Array(4).fill(new Array(4).fill(0));

export const RightPanel = () => {
  const { level, score, highScore, pause, gameOver, nextBlockIndex, onOff, getReady } = useStore();
  const info = useMemo(() => {
    if (gameOver) {
      return <div>Game Over<br />Press Start</div>;
    }
    if (getReady) {
      return <div className="counter">{getReady}</div>;
    }
    if (pause) {
      return "Pause";
    }
    return "Play";
  }, [pause, gameOver, getReady]);

  const grid = useMemo(() => {
    const g = deepCopy(rows);
    if (nextBlockIndex) {
      blocks[nextBlockIndex].forEach(([col, row]) => {
        g[col + 1][row - 3] = 1;
      });
    }
    return g;
  }, [nextBlockIndex]);

  return (
    <div className="right-panel">
      <div className="next-figure">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((elem, index) => (
              <GridCell key={index} opacity={elem ? 1 : 0.03} />
            ))}
          </div>
        ))}
      </div>

      { onOff && <><div className="stat-row">Level</div>
        <div className="stat-value">{level}</div>

        <div className="stat-row">Score</div>
        <div className="stat-value">{score}</div>

        <div className="stat-row">High score</div>
        <div className="stat-value">{highScore}</div>

        <div className="info">{info}</div>
      </>}</div>
  );
};
