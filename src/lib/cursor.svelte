<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';

	let centerCoords = writable({ x: 50, y: 50 });
	let coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.15,
			damping: 0.4
		}
	);
	let size = spring(10);

	const mouseMove = (e: MouseEvent) => {
		centerCoords.set({ x: e.clientX, y: e.clientY });
		coords.set({ x: e.clientX, y: e.clientY });
	};
	const mouseUp = () => size.set(10);
	const mouseDown = () => size.set(30);

	onMount(() => {
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
		document.addEventListener('mousedown', mouseDown);

		return () => {
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			document.removeEventListener('mousedown', mouseDown);
		};
	});
</script>

<svg role="presentation">
	<circle id="c1" cx={$centerCoords.x} cy={$centerCoords.y} r={$size} fill="#ddd" />
	<circle cx={$coords.x} cy={$coords.y} r={$size + 2} stroke="#fff" fill="transparent" />

	{#if $size > 12}
		<circle
			cx={$coords.x}
			cy={$coords.y}
			r={$size + 5}
			fill="transparent"
			stroke="#a00"
			in:fade
			out:fade={{ duration: 150 }}
		/>
	{/if}

	{#if $size > 20}
		<circle
			cx={$coords.x}
			cy={$coords.y}
			r={$size + 8}
			fill="transparent"
			stroke="#d00"
			in:fade
			out:fade={{ duration: 250 }}
		/>
	{/if}
</svg>

<style>
	svg {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 10;
	}

	circle {
		user-select: none;
		&#c1 {
			-webkit-filter: drop-shadow(0 1px 10px rgba(255, 0, 0, 0.5));
			filter: drop-shadow(0 1px 10px rgba(255, 0, 0, 0.5));
		}
	}
</style>
