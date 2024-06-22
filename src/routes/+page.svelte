<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/Scene.svelte';
</script>

<Canvas>
	<Scene />
</Canvas>

<div class="absolute inset-0 animate-[blur_2s_ease-in-out_forwards]"></div>

<div
	class="md:animation-delay-[800ms] absolute top-0 h-0 w-full bg-black opacity-0 transition-all duration-1000 md:animate-[grow_1s_ease-in-out_forwards] md:opacity-100"
></div>
<div
	class="md:animation-delay-[800ms] absolute bottom-0 h-0 w-full bg-black opacity-0 transition-all duration-1000 md:animate-[grow_1s_ease-in-out_forwards] md:opacity-100"
></div>

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
