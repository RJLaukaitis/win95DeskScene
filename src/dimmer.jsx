import * as THREE from 'three';

class Dimmer {
  constructor(scene, camera, screenSize, position, rotation) {
    this.scene = scene;
    this.camera = camera;
    this.screenSize = screenSize;
    this.position = position;
    this.rotation = rotation;
    this.dimmingPlane = null;
  }

  createPerspectiveDimmer(maxOffset) {
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      color: 0x000000,
      transparent: true,
      opacity: 0.5,  // Ensure initial opacity is set
      blending: THREE.AdditiveBlending,
    });

    const plane = new THREE.PlaneGeometry(this.screenSize.width, this.screenSize.height);

    const mesh = new THREE.Mesh(plane, material);

    mesh.position.copy(this.offsetPosition(this.position, new THREE.Vector3(0, 0, maxOffset - 5)));

    mesh.rotation.copy(this.rotation);

    this.dimmingPlane = mesh;

    this.scene.add(mesh);
  }

  offsetPosition(position, offset) {
    const newPosition = new THREE.Vector3();
    newPosition.copy(position);
    newPosition.add(offset);
    return newPosition;
  }

  update() {
    if (this.dimmingPlane) {
      const planeNormal = new THREE.Vector3(0, 0, 1);
      const viewVector = new THREE.Vector3();
      viewVector.copy(this.camera.position);
      viewVector.sub(this.position);
      viewVector.normalize();

      const dot = viewVector.dot(planeNormal);

      const dimPos = this.dimmingPlane.position;
      const camPos = this.camera.position;

      const distance = Math.sqrt(
        (camPos.x - dimPos.x) ** 2 +
        (camPos.y - dimPos.y) ** 2 +
        (camPos.z - dimPos.z) ** 2
      );

      const opacity = 1 / (distance / 10000);

      const DIM_FACTOR = 0.7;

      this.dimmingPlane.material.opacity = Math.min((1 - opacity) * DIM_FACTOR + (1 - dot) * DIM_FACTOR, 1);
      
    }
  }
}

export default Dimmer;
