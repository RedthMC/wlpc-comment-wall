<script lang="ts">
  let { hasNewComment = false }: { hasNewComment: boolean } = $props();
  let showAnimation = $state(false);
  
  $effect(() => {
    if (hasNewComment) {
      showAnimation = true;
      setTimeout(() => showAnimation = false, 2000);
    }
  });
</script>

<div class="flex flex-col items-center gap-4 border border-[#e0e0e0] p-6 bg-white">
  <div class="relative w-[12.5rem] h-[15.625rem]">
    <div class="absolute top-10 left-1/2 -translate-x-1/2 w-[7.5rem] h-2 bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] z-10"></div>
    <div class="absolute top-[3.125rem] left-1/2 -translate-x-1/2 w-[11.25rem] h-[12.5rem] bg-[#52413c] shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
      <div class="absolute top-5 left-5 right-5 bottom-5 border-2 border-black/10"></div>
      <div class="absolute bottom-[1.875rem] left-1/2 -translate-x-1/2 w-[6.25rem] h-[3.75rem] bg-black/20 border-2 border-black/20"></div>
    </div>
    {#if showAnimation}
      <div class="letter-drop"></div>
    {/if}
  </div>
  <p class="font-serif text-lg font-normal text-black m-0 tracking-[-0.03125rem]">Comments</p>
</div>

<style>
  .letter-drop {
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 60px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    animation: drop 2s ease-in-out;
    z-index: 5;
  }
  
  @keyframes drop {
    0% {
      top: 35px;
      opacity: 1;
    }
    50% {
      top: 120px;
      opacity: 1;
    }
    100% {
      top: 180px;
      opacity: 0;
    }
  }
</style>
