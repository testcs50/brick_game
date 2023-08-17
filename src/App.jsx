/* eslint-disable react/no-unknown-property */
import { Canvas, useThree } from "@react-three/fiber";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Center, Html } from "@react-three/drei";
import Tetris from "./components/tetris/Tetris";
import { useCallback, useRef } from "react";
import { downKey, leftKey, onOffKey, resetKey, rightKey, rotateKey, sPKey, upKey } from "../store/consts";
import { useStore } from "../store/store";

function Thing() {
  const ref = useRef(null);
  const model = useLoader(GLTFLoader, "./tetris3.0.d.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });
  const { rotate, moveLeftRight, down, setPause, reset, setOnOff } = useStore();

  const { viewport } = useThree();

  const onPointerDown = useCallback((ev) => {
    const name = ev.object.name;
    switch (name) {
      case rotateKey:
        rotate();
        break;

      case leftKey:
        moveLeftRight(-1);
        break;

      case rightKey:
        moveLeftRight(1);
        break;

      case upKey:
      case downKey:
        down();
        break;

      case sPKey:
        setPause();
        break;

      case onOffKey:
        setOnOff();
        break;

      case resetKey:
        reset();
        break;

      default:
        break;
    }
  }, [rotate, moveLeftRight, down, setPause, reset, setOnOff]);


  return (<Center onCentered={({ container, height, width }) => {
    container.scale.setScalar(viewport.height / height - 0.04);
    if (viewport.width < width) {
      container.scale.setScalar(viewport.width / width - 0.08);
    }
  }}>
    <group ref={ref} scaleScalar={2}>
      <primitive onPointerDown={onPointerDown} object={model.scene} />
      <Html style={{ pointerEvents: "none", width: 260 }} zIndexRange={[1, 0]} distanceFactor={3.45} transform position={[-0.07, 6.45, 0]} center>
        <Tetris />
      </Html>
    </group>
  </Center>
  );
}

{ /* <Center onCentered={({ container, height, width }) => {
      container.scale.setScalar(viewport.height / height - 0.04);
      if (viewport.width < width) {
        container.scale.setScalar(viewport.width / width - 0.08);
      }
    }}></Center> */ }

function App() {

  return (
    <Canvas>
      <color args={[ "#141109" ]} attach="background" />
      <ambientLight intensity={2.1} />
      <directionalLight position={[1, 2, 3]} />
      <Thing />
    </Canvas>
  );
}

export default App;
