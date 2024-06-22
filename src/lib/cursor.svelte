<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { fade } from 'svelte/transition';

	let clickable = false;
	let centerCoords = { x: 50, y: 50 };
	let coords = spring(
		{ x: 50, y: 50 },
		{
			stiffness: 0.15,
			damping: 0.4
		}
	);
	let size = spring(10);
	let opacity = spring(1);

	const mouseMove = (e: MouseEvent) => {
		centerCoords = { x: e.clientX, y: e.clientY };
		coords.set({ x: e.clientX, y: e.clientY });
		opacity.set(1);
	};
	const mouseUp = () => size.set(10);
	const mouseDown = () => size.set(30);

	const mouseOver = (e: MouseEvent) => {
		// TODO: implement for other cursor types (refer https://developer.mozilla.org/en-US/docs/Web/CSS/cursor#formal_syntax)
		if ((e.target as HTMLElement).closest(':is(a, button, label, select, input), [role=button]')) {
			size.set(20);
			clickable = true;
		}
	};

	const mouseOut = (e: MouseEvent) => {
		size.set(10);
		clickable = false;
	};

	const mouseEnter = (e: MouseEvent) => {
		mouseOut(e);
		opacity.set(1);
	};

	const mouseLeave = (e: MouseEvent) => {
		mouseOut(e);
		opacity.set(0);
	};

	onMount(() => {
		const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		centerCoords = structuredClone(mouse);
		coords.set(mouse);
		document.addEventListener('mousemove', mouseMove);
		document.addEventListener('mouseup', mouseUp);
		document.addEventListener('mousedown', mouseDown);
		document.addEventListener('mouseover', mouseOver);
		document.addEventListener('mouseout', mouseOut);
		document.addEventListener('dragleave', mouseUp);
		document.addEventListener('mouseenter', mouseEnter);
		document.addEventListener('mouseleave', mouseLeave);

		return () => {
			document.removeEventListener('mousemove', mouseMove);
			document.removeEventListener('mouseup', mouseUp);
			document.removeEventListener('mousedown', mouseDown);
			document.removeEventListener('mouseover', mouseOver);
			document.removeEventListener('mouseout', mouseOut);
			document.removeEventListener('dragleave', mouseUp);
			document.removeEventListener('mouseenter', mouseEnter);
			document.removeEventListener('mouseleave', mouseLeave);
		};
	});
</script>

<svg role="presentation" opacity={$opacity}>
	<circle
		id="c1"
		cx={centerCoords.x}
		cy={centerCoords.y}
		r={$size - 4}
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
		position: fixed;
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
