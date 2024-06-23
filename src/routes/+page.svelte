<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/Scene.svelte';

	let loaded = false;
</script>

<Canvas>
	<Scene on:sceneloaded={() => (loaded = true)} />
</Canvas>

<div
	class="pointer-events-none absolute inset-0 bg-black transition-[background-color] duration-1000 {loaded
		? 'animate-[blur_3s_ease-in-out_forwards] bg-transparent'
		: ''}"
></div>

<div
	class="absolute top-0 h-0 w-full bg-black opacity-0 transition-all duration-1000 md:animate-[grow_1s_ease-in-out_forwards] md:opacity-100 md:animation-delay-[800ms]"
></div>
<div
	class="absolute bottom-0 h-0 w-full bg-black opacity-0 transition-all duration-1000 md:animate-[grow_1s_ease-in-out_forwards] md:opacity-100 md:animation-delay-[800ms]"
></div>

{#if !loaded}
	<div class="absolute inset-0 flex items-center justify-center">
		<span class="inline-flex h-5 w-5 animate-ping rounded-full bg-white opacity-75"></span>
	</div>
{/if}

<style lang="postcss">
	@keyframes -global-grow {
		0% {
			height: 0vh;
		}
		100% {
			height: 10vh;
		}
	}

	@keyframes -global-blur {
		0% {
			backdrop-filter: blur(16px);
		}

		100% {
			backdrop-filter: blur(0px);
		}
	}
</style>
