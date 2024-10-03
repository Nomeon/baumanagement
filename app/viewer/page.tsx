'use client';

import * as THREE from 'three';
import * as OBC from '@thatopen/components';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import BUIComponent with SSR disabled
const BUIComponent = dynamic(() => import('@/components/BUIComponent'), { ssr: false });

export default function Viewer() {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            const components = new OBC.Components();
            const worlds = components.get(OBC.Worlds);
            const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();

            world.scene = new OBC.SimpleScene(components);
            world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
            world.camera = new OBC.SimpleCamera(components);
            components.init();

            world.scene.three.background = null;

            const material = new THREE.MeshLambertMaterial({ color: '#6528D7' });
            const geometry = new THREE.BoxGeometry();
            const cube = new THREE.Mesh(geometry, material);
            world.scene.three.add(cube);

            world.scene.setup();

            world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

            return () => {
                components.dispose();
            };
        }
    }, []);

    return (
        <div>
            <div id="container" ref={containerRef} className="w-screen h-screen" />
            {/* Dynamically loaded BUI component */}
            <BUIComponent />
        </div>
    );
}
