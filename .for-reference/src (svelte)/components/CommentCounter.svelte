<script lang="ts">
  let { count }: { count: number } = $props();
</script>

<div class="bg-black text-white px-8 py-6 text-center transition-transform duration-300">
  <div class="font-sans text-xs uppercase tracking-widest mb-2 opacity-90">Total Comments</div>
  <div class="font-serif text-5xl font-normal leading-none tracking-[-0.125rem]">{count}</div>
</div>
