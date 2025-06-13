/// <reference types="vite/client" />
import * as THREE from 'three';
import { MaterialParameters, Material, Texture } from 'three';

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
  export class MeshLineGeometry {
    constructor();
    setPoints(points: THREE.Vector3[]): void;
  }

  export interface MeshLineMaterialParameters extends MaterialParameters {
    color?: THREE.Color | string | number;
    opacity?: number;
    alphaTest?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    transparent?: boolean;
    lineWidth?: number;
    sizeAttenuation?: boolean;
    near?: number;
    far?: number;
    dashArray?: number;
    dashOffset?: number;
    dashRatio?: number;
    resolution?: THREE.Vector2;
    useMap?: boolean;
    map?: Texture | null;
    repeat?: THREE.Vector2;
  }

  export class MeshLineMaterial extends Material {
    constructor(parameters?: MeshLineMaterialParameters);
    color: THREE.Color;
    opacity: number;
    alphaTest: number;
    depthTest: boolean;
    depthWrite: boolean;
    transparent: boolean;
    lineWidth: number;
    sizeAttenuation: boolean;
    near: number;
    far: number;
    dashArray: number;
    dashOffset: number;
    dashRatio: number;
    resolution: THREE.Vector2;
    useMap: boolean;
    map: Texture | null;
    repeat: THREE.Vector2;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: ReactThreeFiber.Object3DProps<MeshLineGeometry>;
      meshLineMaterial: ReactThreeFiber.Object3DProps<MeshLineMaterial> & {
        color?: string | number | THREE.Color;
        depthTest?: boolean;
        resolution?: [number, number];
        useMap?: boolean;
        map?: THREE.Texture;
        repeat?: [number, number];
        lineWidth?: number;
      };
    }
  }
}