<script lang="ts">
    import { setupRealtime, type Comment } from "$lib/api";
    import CommentNote from "$lib/components/CommentNote.svelte";
    import DisplayBackground from "$lib/assets/display-background.png";
    import { onMount } from "svelte";

    let qrCodeUrl = $state("");

    let comments: Comment[] = $state([]);
    let isConnected = $state(false);

    // Rotate which 6 comments are shown, fade between rotations
    let rotateIndex = $state(0);
    let visibleComments = $derived(comments.slice(rotateIndex, rotateIndex + 7));

    onMount(() => {
         qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(window.location.origin + "/comment")}`;

        const { destroy } = setupRealtime(
            (c) => {
                comments = c;
                rotateIndex = 0;
            },
            (s) => (isConnected = s === "SUBSCRIBED"),
        );

        // Rotate visible notes every 8s
        const rotateInterval = setInterval(() => {
            if (comments.length <= 6) return;
            rotateIndex += rotateIndex + 6;
            if (rotateIndex >= comments.length) rotateIndex = 0;
        }, 8000);

        return () => {
            destroy();
            clearInterval(rotateInterval);
        };
    });

    // Fixed positions for the 6 sticky notes on the display wall
    const positions = [
        { left: 350, top: 160, width: 300, rotate: -1 },
        { left: 800, top: 120, width: 400, rotate: 1 },
        { left: 200, top: 450, width: 260, rotate: 1.2 },
        { left: 700, top: 420, width: 300, rotate: -1.2 },
        { left: 1160, top: 400, width: 250, rotate: 0 },
        { left: 1560, top: 380, width: 240, rotate: 0 },
        { left: 540, top: 700, width: 400, rotate: 0.5 },
    ];
</script>

<svelte:head>
    <title>Fermata - 留言牆</title>
</svelte:head>

<!-- Background -->
<img class="fixed top-0 left-0 w-full h-full object-cover" src={DisplayBackground} alt="" />

<!-- Status indicator -->
<div
    class="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs
    {isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}"
>
    <span class="w-2 h-2 rounded-full {isConnected ? 'bg-green-500' : 'bg-gray-400 animate-pulse'}"></span>
    {isConnected ? "Live" : "Connecting…"}
</div>

<!-- QR Code (fixed bottom-right) -->
<div class="fixed bottom-8 right-8 z-50">
    <article class="relative p-5 shadow-lg border border-gray-900 bg-gray-100" style="transform: rotate(1deg);">
        <div class="absolute top-0 left-0 w-full p-3 flex justify-center">
            <div class="w-3 h-3 bg-gray-500 rounded-full shadow"></div>
        </div>
        <div class="mt-4 text-center">
            <strong class="font-bold text-slate-800 text-base block mb-3">掃描即可留言</strong>
            <img src={qrCodeUrl} alt="QR code" class="w-40 h-40 bg-white p-2" />
        </div>
    </article>
</div>

<!-- Notes scattered on the wall -->
<div class="fixed inset-0 overflow-hidden transition-opacity duration-400">
    {#if comments.length === 0}
        <div class="flex items-center justify-center h-full text-gray-400 text-xl font-serif">等待留言中…</div>
    {:else}
        {#key visibleComments}
            {#each visibleComments as c, i (c.id)}
                {@const pos = positions[i]}
                <div class="fixed slide-in" style="left: {pos.left}px; top: {pos.top}px; rotate: {pos.rotate}deg; width: {pos.width}px;">
                    <CommentNote comment={c} />
                </div>
            {/each}
        {/key}
    {/if}
</div>

<style>
    .slide-in {
        animation: slideIn 0.5s ease;
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
