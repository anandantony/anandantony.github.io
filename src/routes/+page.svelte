<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { typewriter } from '$lib/transitions';
	import { messages } from '$lib/messages';
	import { text } from '@sveltejs/kit';
	// import { createScene } from '$lib/scene';

	// let el: HTMLCanvasElement;
	let visible = false;
	let i = -1;
	let message = '...';
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

		messageTimeout = setTimeout(nextMessage, 1500);

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
<div class="noise"></div>

{#if visible}
	<div
		class="container h-screen flex flex-col items-start justify-center bg-transparent overflow-hidden px-4"
		in:fade
	>
		{#key i}
			<p class="font-bold text-white hero glitch layers" data-text={message}>
				<span class="font-bold" in:typewriter={{ speed }} out:typewriter={{ speed: speed * 2 }}
					>{message}</span
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

	.noise {
		position: absolute;
		inset: 0;
		background-color: #050505;
		overflow: hidden;
		z-index: -1;
		&::after {
			animation: grain 5s steps(10) infinite;
			background: url('noise.png');
			filter: invert();
			content: '';
			display: block;
			position: absolute;
			inset: -150%;
			z-index: 1;
			opacity: 0.3;
		}
	}

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
