import { create } from "zustand";
import { deepCopy, randomIntFromInterval } from "./utils";
import { blocks, defaultStore } from "./consts";

import { persist } from "zustand/middleware";

export const useStore = create(persist(
  (set) => ({
    ...defaultStore,
    setOnOff: () => set((state) => ({ ...state, ...defaultStore, onOff: !state.onOff })),
    reset: () => set((state) => {
      return {
        ...state,
        ...defaultStore,
      };
    }),
    setPause: () => set((state) => {
      if (state.gameOver) {
        return {
          ...state,
          ...defaultStore,
        };
      }
      return { ...state, pause: !state.pause };
    }),
    timerCallback: () => set((state) => {
      if (state.pause || state.gameOver || !state.onOff) {
        return state;
      }
      if (state.getReady) {
        return { ...state, getReady: state.getReady - 1 };
      }

      let block = deepCopy(state.block);
      const grid = deepCopy(state.grid);
      const maxIndex = grid.length;
      let canGoFar = true;
      let blockIndex = state.blockIndex;
      let nextBlockIndex = state.nextBlockIndex;
      let level = state.level;
      let count = state.count;

      grid.forEach((row, index) => {
        if (row.every((item) => item === 2)) {
          grid.splice(index, 1);
          grid.unshift(new Array(row.length).fill(0));
        }
      });

      if (!block) {
        blockIndex = nextBlockIndex || randomIntFromInterval(blocks.length - 1);
        block = blocks[blockIndex];
        nextBlockIndex = randomIntFromInterval(blocks.length - 1);
        block.forEach(([col, row]) => {
          grid[col][row] = 1;
        });
        count += 1;
        level = Math.min(Math.ceil(count / 10), 10);
      }

      let newBlock = block;
      block.forEach(([col, row]) => {
        if (col + 1 >= maxIndex || (grid[col + 1] && grid[col + 1][row] === 2)) {
          canGoFar = false;
        }
      });

      if (canGoFar) {
        newBlock = deepCopy(block).map(([col, row]) => {
          return [col + 1, row];
        });
        block.forEach(([col, row]) => {
          grid[col][row] = 0;
        });
      }
      newBlock.forEach(([col, row]) => {
        grid[col][row] = canGoFar ? 1 : 2;
      });

      let gameOver = false;
      grid.forEach((row, index) => {
        if (index < 4) {
          row.forEach((item) => {
            if (item === 2) {
              gameOver = true;
            }
          });
        }
      });

      return {
        ...state,
        grid,
        block: canGoFar ? newBlock : null,
        blockIndex,
        nextBlockIndex,
        gameOver,
        count,
        level,
      };
    }),
    rotate: () => set((state) => {
      const block = deepCopy(state.block);
      const grid = deepCopy(state.grid);
      if (!block || state.gameOver || state.pause) {
        return state;
      }

      // Функция для вращения вокруг определенной точки
      function rotateAroundPivot(block, pivotIndex) {
        const [cx, cy] = block[pivotIndex]; // Вращаем вокруг pivotIndex блока
        return block.map(([x, y]) => {
          const rx = cx - (y - cy);
          const ry = cy + (x - cx);
          return [rx, ry];
        });
      }

      // Находим текущую максимальную высоту (максимальное значение x)
      const currentMaxHeight = Math.max(...block.map(([x]) => x));

      // Попытайтесь вращать вокруг каждой точки блока
      for (let pivotIndex = 0; pivotIndex < block.length; pivotIndex++) {
        let rotatedBlock = rotateAroundPivot(block, pivotIndex);

        // Находим новую максимальную высоту
        const newMaxHeight = Math.max(...rotatedBlock.map(([x]) => x));

        // Сдвигаем блок вниз на разницу в высоте
        rotatedBlock = rotatedBlock.map(([x, y]) => [x - (newMaxHeight - currentMaxHeight), y]);

        const canRotate = rotatedBlock.every(([x, y]) => {
          if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length || !grid[x]) {
            return false;
          }
          if (grid[x][y] === 2) {
            return false;
          }
          return true;
        });

        if (canRotate) {
          block.forEach(([x, y]) => {
            grid[x][y] = 0;
          });
          rotatedBlock.forEach(([x, y]) => {
            grid[x][y] = 1;
          });

          return {
            ...state,
            grid,
            block: rotatedBlock,
          };
        }
      }

      // Если ни одно из вращений не успешно, вернуть исходное состояние
      return state;
    }),
    moveLeftRight: (direction) => set((state) => {
      const block = deepCopy(state.block);
      const grid = deepCopy(state.grid);
      if (!block || state.gameOver || state.pause) {
        return state;
      }

      const newBlock = deepCopy(block).map(([x, y]) => [x, y + direction]);

      const canMove = newBlock.every(([x, y]) => {
        if (y < 0 || y >= grid[0].length || x < 0 || x >= grid.length || !grid[x]) {
          return false;
        }
        if (grid[x][y] === 2) {
          return false;
        }
        return true;
      });

      if (canMove) {
        block.forEach(([x, y]) => {
          grid[x][y] = 0;
        });
        newBlock.forEach(([x, y]) => {
          grid[x][y] = 1;
        });

        return {
          ...state,
          grid,
          block: newBlock,
        };
      }
      else {
        return state;
      }
    }),
    down: () => set((state) => {
      let block = deepCopy(state.block);
      const grid = deepCopy(state.grid);
      if (!block || state.gameOver || state.pause) {
        return state;
      }

      let canGoFar = true;
      while (canGoFar) {
        const newBlock = deepCopy(block).map(([x, y]) => {
          if (x + 1 >= grid.length || (grid[x + 1] && grid[x + 1][y] === 2)) {
            canGoFar = false;
          }
          return [x + 1, y];
        });

        if (canGoFar) {
          block = newBlock;
        }
      }

      state.block.forEach(([x, y]) => {
        grid[x][y] = 0;
      });
      block.forEach(([x, y]) => {
        grid[x][y] = 2;
      });

      return {
        ...state,
        grid,
        block: null,
      };
    }),
  }),
  {
    name: "my-tetris-storage",
    getStorage: () => localStorage,
  },
));
