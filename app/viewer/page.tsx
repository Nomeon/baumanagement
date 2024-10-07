'use client';

import * as THREE from 'three';
import * as OBC from '@thatopen/components';
import { useEffect, useRef,} from 'react';


export default function Viewer() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const worldRef = useRef<OBC.World | null>(null);
    const componentsRef = useRef<OBC.Components | null>(null);
    const fragmentIfcLoaderRef = useRef<OBC.IfcLoader | null>(null);
    const clipperRef = useRef<OBC.Clipper | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Init components and create world
            const components = new OBC.Components();
            const worlds = components.get(OBC.Worlds);
            const world = worlds.create<OBC.SimpleScene, OBC.SimpleCamera, OBC.SimpleRenderer>();
            world.scene = new OBC.SimpleScene(components);
            world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
            world.camera = new OBC.SimpleCamera(components);
            components.init();
            componentsRef.current = components;

            // Create grids and raycasters
            const grids = components.get(OBC.Grids);
            const casters = components.get(OBC.Raycasters);
            grids.create(world);
            casters.get(world);

            const clipper = components.get(OBC.Clipper);
            clipperRef.current = clipper;

            // Set up world
            world.scene.three.background = null;
            world.scene.setup();
            world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);
            worldRef.current = world;

            // Set up IFC loader to load models
            setupLoader();

            return () => {
                components.dispose();
            };
        }
    });

    const setupLoader = async () => {
        const fragments = componentsRef.current?.get(OBC.FragmentsManager);
        const fragmentIfcLoader = componentsRef.current?.get(OBC.IfcLoader);
        if (!fragments || !fragmentIfcLoader) {
            return;
        }
        await fragmentIfcLoader?.setup();
        // fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
        fragmentIfcLoaderRef.current = fragmentIfcLoader;
        console.log('IFC Loader configured.');
    }

    const loadIfc = async (event: any) => {
        if (!worldRef.current || !fragmentIfcLoaderRef.current) {
            return;
        }
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const buffer = new Uint8Array(data);
        const model = await fragmentIfcLoaderRef.current.load(buffer); 
        model.name = file.name
        worldRef.current.scene.three.add(model);
    }

    const toggleClipper = () => {
        if (!clipperRef.current) {
            return;
        }
        clipperRef.current.enabled = !clipperRef.current.enabled;
        console.log(clipperRef.current.enabled);
    }

    const createClipper = (event: any) => {
        if (clipperRef.current?.enabled) {
            console.log('Clipper test')
            clipperRef.current.create(worldRef.current!);
        }
    }

    return (
        <div>
            <div id="container" ref={containerRef} onDoubleClick={createClipper} className="w-screen h-screen" />
            <input className="absolute top-4 left-4" type='file' onChange={loadIfc} />
            <button className="absolute top-20 left-4" onClick={toggleClipper}>Clip</button>
        </div>
    );
}
