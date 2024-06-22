<div class="bg-image absolute inset-0 -z-[2]"></div>
<div
	class="container mx-auto flex h-screen flex-col items-center justify-center overflow-hidden bg-transparent px-4"
>
	<h1 class="hero glitch layers text-8xl font-bold text-white" data-text="Oops!">
		<span class="text-8xl font-bold">Oops!</span>
	</h1>
	<p class="mt-4 text-center text-lg text-white">It looks like you are lost.</p>
	<a href="/" class="mt-8 text-center text-2xl text-white underline">Let's get you back on track!</a
	>
</div>

<style lang="postcss">
	h1 {
		font-family: 'Limelight', sans-serif;
		font-size: clamp(40px, 10vw, 100px);
	}
	p,
	a {
		font-family: 'Bangers', sans-serif;
	}
	.bg-image {
		background-image: url('$lib/images/404.jpg');
		background-position: bottom;
		background-size: cover;
		filter: blur(2px) grayscale(1);
	}
</style>
