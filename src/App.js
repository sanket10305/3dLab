import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { SoftShadows, Float, CameraControls, Sky, PerformanceMonitor, PointerLockControls, PresentationControls, OrbitControls } from "@react-three/drei"
import { useControls } from "leva"
import { Perf } from "r3f-perf"
import { easing } from "maath"
import { Model as Room } from "./Room"
import * as THREE from "three"

function Light() {
  const ref = useRef()
  useFrame((state, delta) => {
    easing.dampE(ref.current.rotation, [(state.pointer.y * Math.PI) / 50, (state.pointer.x * Math.PI) / 20, 0], 0.2, delta)
  })
  return (
    <group ref={ref}>
      <directionalLight position={[5, 5, -10]} castShadow intensity={1} shadow-mapSize={2048} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20, 0.2, 20]} />
      </directionalLight>
    </group>
  )
}

export default function App() {
  const [bad, set] = useState(false)
  const sky2 = useRef()
  const { impl, debug, enabled, samples, ...config } = useControls({
    debug: true,
    enabled: true,
    size: { value: 10, min: 0, max: 100, step: 0.1 },
    focus: { value: 0.5, min: 0, max: 2, step: 0.1 },
    samples: { value: 16, min: 1, max: 40, step: 1 }
  })

  return (
    <Canvas shadows camera={{ position: [0, 2, 7], fov: 70, far: 100 }}>
      {enabled && <SoftShadows {...config} samples={bad ? Math.min(6, samples) : samples} />}
      <PresentationControls
        enabled={true} // the controls can be disabled by setting this to false
        global={true} // Spin globally or by dragging the model
        cursor={true} // Whether to toggle cursor style on drag
        snap={false} // Snap-back to center (can also be a spring config)
        speed={1} // Speed factor
        zoom={1} // Zoom factor when half the polar-max is reached
        rotation={[0, 0, 0]} // Default rotation
        polar={[-0.5, 0.2]} // Vertical limits
        azimuth={[-0.4, Math.PI / 5]} // Horizontal limits
      >
        <Room scale={1} position={[0, -1, 0]} />
      </PresentationControls>
      <color attach="background" args={["#d0d0d0"]} />
      <fog attach="fog" args={["#d0d0d0", 8, 35]} />
      <ambientLight intensity={0.4} />
      <Light />
      <Sky inclination={0.52} scale={50} sunPosition={[200, 100, 100]} />
    </Canvas>
  )
}

function Sphere({ color = "hotpink", floatIntensity = 15, position = [0, 5, -8], scale = 1 }) {
  return (
    <Float floatIntensity={floatIntensity}>
      <mesh castShadow position={position} scale={scale}>
        <sphereGeometry />
        <meshBasicMaterial color={color} roughness={1} />
      </mesh>
    </Float>
  )
}
