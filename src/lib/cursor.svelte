<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.15,
			damping: 0.35
		}
	);
	let size = spring(10);

	const mouseMove = (e: MouseEvent) => {
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
	<circle cx={$coords.x} cy={$coords.y} r={$size} fill="#ddd" />

	{#if $size > 10}
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
</style>
