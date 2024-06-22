<script>
	import Cursor from '$lib/Cursor.svelte';
	import { onMount } from 'svelte';
	import '../app.scss';

	let isTouch = false;

	const detectTouchscreen = () => {
		let result = false;
		if (window.PointerEvent && 'maxTouchPoints' in navigator) {
			// if Pointer Events are supported, just check maxTouchPoints
			if (navigator.maxTouchPoints > 0) {
				result = true;
			}
		} else {
			// no Pointer Events...
			if (window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches) {
				// check for any-pointer:coarse which mostly means touchscreen
				result = true;
			} else if (window.TouchEvent || 'ontouchstart' in window) {
				// last resort - check for exposed touch events API / event handler
				result = true;
			}
		}
		isTouch = result;
	};

	onMount(() => {
		detectTouchscreen();
		window.addEventListener('resize', detectTouchscreen);

		return () => {
			window.removeEventListener('resize', detectTouchscreen);
		};
	});
</script>

<!-- <div class="noise fixed"></div> -->
<main class="h-screen w-full">
	<slot />

	{#if !isTouch}
		<Cursor />
	{/if}
</main>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Acme&family=Bangers&family=Limelight&family=Orbitron:wght@400..900&display=swap');
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		cursor: none;
	}

	/* .noise {
		inset: 0;
		background-color: #050505;
		overflow: hidden;
		z-index: -1;
		opacity: 0.9;
		&::after {
			animation: grain 5s steps(10) infinite;
			background: url('$lib/images/noise.png');
			filter: invert();
			content: '';
			display: block;
			position: absolute;
			inset: -150%;
			z-index: 1;
			opacity: 0.3;
		}
	} */

	@keyframes -global-grain {
		0%,
		100% {
			transform: translate(0, 0);
		}
		10% {
			transform: translate(-5%, -10%);
		}
		20% {
			transform: translate(-15%, 5%);
		}
		30% {
			transform: translate(7%, -25%);
		}
		40% {
			transform: translate(-5%, 25%);
		}
		50% {
			transform: translate(-15%, 10%);
		}
		60% {
			transform: translate(15%, 0%);
		}
		70% {
			transform: translate(0%, 15%);
		}
		80% {
			transform: translate(3%, 35%);
		}
		90% {
			transform: translate(-10%, 10%);
		}
	}
</style>
