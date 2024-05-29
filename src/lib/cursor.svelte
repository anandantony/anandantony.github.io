<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let centerCoords = { x: 50, y: 50 };
	let clickable = false;
	let coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.15,
			damping: 0.4
		}
	);
	let size = spring(10);

	const mouseMove = (e: MouseEvent) => {
		centerCoords = { x: e.clientX, y: e.clientY };
		coords.set({ x: e.clientX, y: e.clientY });
	};
	const mouseUp = () => size.set(10);
	const mouseDown = () => size.set(30);

	const mouseOver = (e: MouseEvent) => {
		if ((e.target as HTMLElement).closest(':is(a, button, label, select, input), [role=button]')) {
			size.set(20);
			clickable = true;
		}
	};

	const mouseOut = (e: MouseEvent) => {
		size.set(10);
		clickable = false;
	};

	onMount(() => {
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
		document.addEventListener('mousedown', mouseDown);
		document.addEventListener('mouseover', mouseOver);
		document.addEventListener('mouseout', mouseOut);
		document.addEventListener('dragleave', mouseUp);

		return () => {
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			document.removeEventListener('mousedown', mouseDown);
			document.removeEventListener('mouseover', mouseOver);
			document.removeEventListener('mouseout', mouseOut);
			document.removeEventListener('dragleave', mouseUp);
		};
	});
</script>

<svg role="presentation">
	<circle
		id="c1"
		cx={centerCoords.x}
		cy={centerCoords.y}
		r={$size}
		fill={clickable ? '#dddddd22' : '#ddd'}
	/>
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
		pointer-events: none;
	}

	circle {
		user-select: none;
		pointer-events: none;
		&#c1 {
			-webkit-filter: drop-shadow(0 1px 10px rgba(255, 0, 0, 0.5));
			filter: drop-shadow(0 1px 10px rgba(255, 0, 0, 0.5));
		}
	}
</style>
