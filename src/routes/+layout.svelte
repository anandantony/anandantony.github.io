<script>
	import '../app.scss';
</script>

<main class="flex items-center justify-center">
	<slot />
</main>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Acme&family=Bangers&family=Limelight&display=swap');
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
