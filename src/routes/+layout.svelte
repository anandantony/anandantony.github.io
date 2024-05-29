<script>
	import Cursor from '$lib/cursor.svelte';
	import '../app.scss';
</script>

<main class="flex items-center justify-center">
	<div class="noise"></div>
	<slot />
	<Cursor />
</main>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Acme&family=Bangers&family=Limelight&display=swap');
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
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
