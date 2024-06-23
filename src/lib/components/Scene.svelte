<script lang="ts">
	import Spaceship from '$lib/models/spaceship.svelte';
	import { T, useTask, useThrelte } from '@threlte/core';
	// import { OrbitControls } from '@threlte/extras';
	import { injectLookAtPlugin } from '../lookAtPlugin';
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		Raycaster,
		Vector2,
		type Mesh,
		Vector3,
		Group,
		PMREMGenerator,
		Color,
		Texture,
		WebGLRenderTarget,
		MeshStandardMaterial,
		PerspectiveCamera
	} from 'three';
	import Stars from './Stars.svelte';
	import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
	import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
	import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
	import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass.js';

	const dispatch = createEventDispatcher();

	let planeRef: Mesh;
	let sphereRef: Mesh;
	let spaceshipRef: Group;
	let spaceshipWidth: number;

	let translateY = 0;
	let translateYAccel = 0;
	let angleZ = 0;
	let angleZAccel = 0;

	const { camera, renderer, renderStage, scene } = useThrelte();
	let intersectionPoint: Vector3;

	let pmremGenerator = new PMREMGenerator(renderer);
	let envMapRT: WebGLRenderTarget<Texture>;

	const composer = new EffectComposer(renderer);

	function resize() {
		const aspect = innerWidth / innerHeight;
		(camera.current as PerspectiveCamera).aspect = aspect;
		(camera.current as PerspectiveCamera).fov =
			2 * Math.atan(spaceshipWidth / aspect / (2 * 20)) * (180 / Math.PI);
		(camera.current as PerspectiveCamera).updateProjectionMatrix();
		renderer.setSize(innerWidth, innerHeight);
		composer.setSize(innerWidth, innerHeight);
	}

	const setupEffectsComposer = () => {
		const renderPass = new RenderPass(scene, camera.current);
		composer.addPass(renderPass);

		const halftoneEffect = new HalftonePass(innerWidth, innerHeight, {
			radius: 5,
			rotateR: 8,
			rotateG: 45,
			rotateB: 30,
			scatter: 0,
			blending: 1,
			blendingMode: 4
		});
		composer.addPass(halftoneEffect);

		const bloomPass = new UnrealBloomPass(new Vector2(innerWidth, innerHeight), 0.275, 1, 0);
		composer.addPass(bloomPass);

		const filmPass = new FilmPass(2);
		composer.addPass(filmPass);

		const outputPass = new OutputPass();
		composer.addPass(outputPass);
	};

	useTask(
		(delta) => {
			if (intersectionPoint) {
				const targetY = intersectionPoint.y;
				translateYAccel += (targetY - translateY) * 0.002;
				translateYAccel *= 0.95;
				translateY += translateYAccel;

				const dir = intersectionPoint
					.clone()
					.sub(new Vector3(0, translateY, 0))
					.normalize();
				const dirCos = dir.dot(new Vector3(0, 1, 0));
				const angle = Math.acos(dirCos) - Math.PI * 0.5;
				angleZAccel += (angle - angleZ) * 0.01;
				angleZAccel *= 0.85;
				angleZ += angleZAccel;
			}

			// reflections
			if (envMapRT) envMapRT.dispose();

			spaceshipRef.visible = false;
			scene.background = null;
			envMapRT = pmremGenerator.fromScene(scene, 0, 0.1, 1000);
			scene.background = new Color('#598889').multiplyScalar(0.02);
			spaceshipRef.visible = true;
			spaceshipRef.traverse((child) => {
				const childMesh = child as Mesh;
				const mat = childMesh && (childMesh.material as MeshStandardMaterial);
				if (mat && mat.envMapIntensity) {
					mat.envMap = envMapRT.texture;
					mat.envMapIntensity = 100;
					mat.normalScale.set(0.3, 0.3);
				}
			});

			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);

	onMount(() => {
		setupEffectsComposer();

		const raycaster = new Raycaster();
		const pointer = new Vector2();

		function onPointerMove(event: PointerEvent) {
			pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(pointer, $camera);
			const intersects = raycaster.intersectObject(planeRef);
			intersectionPoint = intersects[0]?.point;

			if (intersectionPoint) {
				intersectionPoint.x = -3;
				intersectionPoint.y = Math.max(-1, Math.min(intersectionPoint.y, 2));
				sphereRef.position.copy(intersectionPoint);
			}
		}

		window.addEventListener('pointermove', onPointerMove);
		window.addEventListener('resize', resize);

		return () => {
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', resize);
		};
	});

	function meshLoaded() {
		dispatch('sceneloaded', true);
		resize();
	}

	injectLookAtPlugin();
</script>

<T.PerspectiveCamera
	makeDefault
	position={[-5, 6, 10]}
	fov={25}
	lookAt={[0, 0, 0]}
	onready={resize()}
>
	<!-- <OrbitControls enableDamping target={[0, 0, 0]} /> -->
</T.PerspectiveCamera>

<T.DirectionalLight intensity={1.8} position={[0, 10, 0]} castShadow shadow.bias={-0.0001} />
<T.AmbientLight intensity={0.2} />

<Stars />

<Spaceship
	bind:ref={spaceshipRef}
	bind:width={spaceshipWidth}
	on:loaded={meshLoaded}
	position={[0, translateY, 0]}
	rotation={[angleZ, 0, angleZ, 'ZXY']}
/>

<T.Mesh renderOrder={2} bind:ref={planeRef} visible={false}>
	<T.PlaneGeometry args={[20, 20]} />
	<T.MeshBasicMaterial color={[1, 0, 1]} />
</T.Mesh>

<T.Mesh position={[1, 2, 0]} bind:ref={sphereRef} visible={false}>
	<T.SphereGeometry args={[0.1, 20, 20]} />
	<T.MeshBasicMaterial color={[1, 0, 0]} />
</T.Mesh>
