<script lang="ts">
	import { useTask, useThrelte } from '@threlte/core';
	import {
		ChromaticAberrationEffect,
		EffectComposer,
		EffectPass,
		RenderPass,
		ShaderPass
	} from 'postprocessing';
	import { onMount } from 'svelte';
	import { ShaderMaterial, type Camera } from 'three';

	const { scene, renderer, camera, size, autoRender, renderStage } = useThrelte();

	const composer = new EffectComposer(renderer);

	const setupEffectComposer = (camera: Camera) => {
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));

		const chromaticAberrationEffect = new ChromaticAberrationEffect();
		composer.addPass(new EffectPass(camera, chromaticAberrationEffect));
	};

	$: setupEffectComposer($camera);
	$: composer.setSize($size.width, $size.height);

	onMount(() => {
		let before = autoRender.current;
		autoRender.set(false);
		return () => {
			autoRender.set(before);
		};
	});

	useTask(
		(delta) => {
			composer.render(delta);
		},
		{ stage: renderStage, autoInvalidate: false }
	);
</script>
