<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { typewriter } from '$lib/transitions';
	import { messages } from '$lib/messages';
	import { text } from '@sveltejs/kit';
	// import { createScene } from '$lib/scene';

	// let el: HTMLCanvasElement;
	let visible = false;
	let i = -1;
	let message = ' ';
	let speed = 1;
	let messageTimeout: number | undefined;

	const nextMessage = () => {
		i += 1;
		// i %= messages.length; //loop
		let time = messages[Math.floor(i / 2)]?.time;
		if (i % 2 === 1) {
			message = ' ';
			time /= 2;
		} else {
			const curr = messages[i / 2];
			message = curr.text;
			speed = curr.speed;
		}
		if (i <= messages.length * 2 - 2) messageTimeout = setTimeout(nextMessage, time);
	};

	onMount(() => {
		// createScene(el);
		const timeout = setTimeout(() => {
			visible = true;
		}, 500);

		messageTimeout = setTimeout(nextMessage, 500);

		return () => {
			clearTimeout(timeout);
			clearTimeout(messageTimeout);
		};
	});
</script>

<svelte:head>
	<title>Anand Antony</title>
	<meta name="description" content="Personal portfolio website" />
</svelte:head>

<!-- <canvas bind:this={el} /> -->

{#if visible}
	<div
		class="container h-screen flex flex-col items-start justify-center bg-transparent overflow-hidden px-4"
		in:fade
	>
		{#key i}
			<p
				class="font-bold text-white hero glitch layers max-w-[90vw] break-words"
				data-text={message}
			>
				<span
					class="font-bold w-full inline-block break-words"
					in:typewriter={{ speed }}
					out:fly={{ y: -100, duration: 100 }}>{message}</span
				>
			</p>
		{/key}
	</div>
{/if}

<style lang="postcss">
	p {
		font-family: 'Limelight', sans-serif;
		font-size: clamp(40px, 10vw, 100px);
	}
</style>
