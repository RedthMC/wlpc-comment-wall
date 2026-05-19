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

    let brightness = $state(100);
    let isFullscreen = $state(false);

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            isFullscreen = true;
        } else {
            document.exitFullscreen();
            isFullscreen = false;
        }
    }

    const positions = $state([
        { left: 350, top: 160, width: 300, rotate: -1 },
        { left: 800, top: 120, width: 400, rotate: 1 },
        { left: 200, top: 450, width: 260, rotate: 1.2 },
        { left: 700, top: 420, width: 300, rotate: -1.2 },
        { left: 1160, top: 400, width: 250, rotate: 0 },
        { left: 1560, top: 380, width: 240, rotate: 0 },
        { left: 540, top: 700, width: 400, rotate: 0.5 },
    ]);

    let offsetX = 0;
    let offsetY = 0;
    let clickedIndex: number | null = null;

    function startDrag(index: number, e: PointerEvent ) {
        console.log("start drag");
        clickedIndex = index;
        const pos = positions[index];
        offsetX = pos.left - e.clientX;
        offsetY = pos.top - e.clientY;
    }

    function onMouseDown(e: PointerEvent ) {
        console.log("mouse move");
        if (clickedIndex === null) return;
        positions[clickedIndex].left = e.clientX + offsetX;
        positions[clickedIndex].top = e.clientY + offsetY;
    }

    function stopDrag(e: PointerEvent) {
        console.log("stopdrag");
        clickedIndex = null;
    }
</script>

<svelte:head>
    <title>Fermata - 留言牆</title>
</svelte:head>

<div class="w-screen h-screen p-0 m-0" style="filter: brightness({brightness}%);">
    <!-- Background -->
    <img class="fixed top-0 left-0 w-full h-full object-cover" src={DisplayBackground} alt="" />

    <!-- Top-right controls -->
    <div class="fixed top-4 right-4 z-50 flex items-center gap-3">
        <!-- Light level slider -->
        <div class="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85 1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z" />
            </svg>
            <input type="range" min="20" max="100" bind:value={brightness} class="w-20 h-1 accent-white cursor-pointer" />
        </div>

        <!-- Fullscreen button -->
        <button onclick={toggleFullscreen} class="bg-black/30 backdrop-blur-sm rounded-full p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer" aria-label="Toggle fullscreen">
            {#if isFullscreen}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
            {/if}
        </button>

        <!-- Status indicator -->
        <div
            class="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs
        {isConnected ? 'text-green-300' : 'text-white/50'}"
        >
            <span class="w-2 h-2 rounded-full {isConnected ? 'bg-green-400' : 'bg-white/40 animate-pulse'}"></span>
            {isConnected ? "Live" : "Connecting…"}
        </div>
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
    <div class="fixed inset-0 overflow-hidden transition-opacity duration-400" onpointermove={(e) => onMouseDown(e)} 
                        onpointerup={e => stopDrag(e)} role="button" tabindex="-1"  >
        {#if comments.length === 0}
            <div class="flex items-center justify-center h-full text-gray-400 text-xl font-serif">等待留言中…</div>
        {:else}
            {#key visibleComments}
                {#each visibleComments as c, i (c.id)}
                    {@const pos = positions[i]}
                    <div class="fixed slide-in" 
                        style="left: {pos.left}px; top: {pos.top}px; rotate: {pos.rotate}deg; width: {pos.width}px; cursor: grab;" 
                        role="button" 
                        tabindex="-1" 
                        onpointerdown={(e) => startDrag(i, e)} 
                    >
                        <CommentNote comment={c} />
                    </div>
                {/each}
            {/key}
        {/if}
    </div>
</div>

<style>
    .slide-in {
        animation: slideIn 0.5s ease;
        touch-action: none;
        user-select: none;
    }
    .slide-in:active {
        cursor: grabbing;
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
