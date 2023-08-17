import { Grid } from "../grid/Grid";
import { RightPanel } from "../right-panel/RightPanel";
import "./Tetris.css";

export default function Tetris() {
  return (
    <div className="tetris">
      <Grid />
      <RightPanel />
    </div>
  );
}
