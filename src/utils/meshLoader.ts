import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ParticleCloudData, sampleGeometryToParticles } from '../generators/proceduralGeometries';

export async function parseUploadedModel(file: File, particleCount: number): Promise<ParticleCloudData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const arrayBuffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    try {
      if (extension === 'obj') {
        const text = new TextDecoder().decode(arrayBuffer);
        const objLoader = new OBJLoader();
        const obj = objLoader.parse(text);

        // Find first mesh
        let foundGeometry: THREE.BufferGeometry | null = null;
        obj.traverse((child) => {
          if (!foundGeometry && (child as THREE.Mesh).isMesh) {
            foundGeometry = (child as THREE.Mesh).geometry;
          }
        });

        if (foundGeometry) {
          resolve(sampleGeometryToParticles(foundGeometry, particleCount, file.name.replace(/\.[^/.]+$/, '')));
        } else {
          reject(new Error('No 3D mesh found in OBJ file.'));
        }
      } else if (extension === 'gltf' || extension === 'glb') {
        const gltfLoader = new GLTFLoader();
        gltfLoader.parse(
          arrayBuffer,
          '',
          (gltf) => {
            let foundGeometry: THREE.BufferGeometry | null = null;
            gltf.scene.traverse((child) => {
              if (!foundGeometry && (child as THREE.Mesh).isMesh) {
                foundGeometry = (child as THREE.Mesh).geometry;
              }
            });

            if (foundGeometry) {
              resolve(sampleGeometryToParticles(foundGeometry, particleCount, file.name.replace(/\.[^/.]+$/, '')));
            } else {
              reject(new Error('No 3D mesh found in GLTF/GLB file.'));
            }
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Unsupported file format. Please upload .obj or .glb/.gltf file.'));
      }
    } catch (err) {
      reject(err);
    }
  });
}

