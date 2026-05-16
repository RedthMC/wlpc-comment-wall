<script lang="ts">
  	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
    import bg from '$lib/assets/bg.jpg'

	let { children } = $props();
</script>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<img class="fixed w-full h-full -z-10 pointer-events-none" src={bg} alt=''>

{@render children()}
