"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface GlobeProps {
  visible: boolean;
  reducedMotion: boolean;
}

export function Globe({ visible, reducedMotion }: GlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return undefined;
    const host = hostRef.current;
    if (!host) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.14, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    const earthGeometry = new THREE.SphereGeometry(2.25, 96, 96);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.02,
      roughness: 0.86,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = -0.92;
    earth.rotation.x = 0.08;
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(2.32, 96, 96);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7fb8ff,
      transparent: true,
      opacity: 0.13,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    const rim = new THREE.Mesh(
      new THREE.SphereGeometry(2.36, 96, 96),
      new THREE.MeshBasicMaterial({
        color: 0xb7dcff,
        transparent: true,
        opacity: 0.055,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(rim);

    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(-3.6, 2.2, 4);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x2f5a8d, 0.55));

    let texture: THREE.Texture | null = null;
    new THREE.TextureLoader().load("/media/space/earth-blue-marble.jpg", (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture = loaded;
      earthMaterial.map = loaded;
      earthMaterial.needsUpdate = true;
      renderer.render(scene, camera);
    });

    let raf = 0;

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const animate = () => {
      earth.rotation.y += 0.0018;
      atmosphere.rotation.y += 0.0011;
      rim.rotation.y += 0.0011;
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    if (!reducedMotion) raf = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      texture?.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, [reducedMotion, visible]);

  if (!visible) return null;

  return <div ref={hostRef} className="cosmic-globe-wrap" aria-hidden />;
}
