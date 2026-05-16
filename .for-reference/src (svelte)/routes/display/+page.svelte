<script lang="ts">
    import { onMount } from "svelte";
    import Letterbox from "../../components/Letterbox.svelte";
    import QRCode from "../../components/QRCode.svelte";
    import CommentCounter from "../../components/CommentCounter.svelte";
    import CommentWall from "../../components/CommentWall.svelte";
    import { setupRealtime, type Comment } from "$lib/api";

    let comments: Comment[] = $state([]);
    let isConnected = $state(false);
    let hasNewComment = $state(false);
    onMount(() => setupRealtime(c => (comments = c), s => isConnected = s === "SUBSCRIBED"));

    $effect(() => {
        if (comments.length > 0) {
            hasNewComment = true;
            const timer = setTimeout(() => (hasNewComment = false), 1000);
        }
    });
</script>

<svelte:head>
    <title>WLPC Photography Exhibition</title>
</svelte:head>

<main class="max-w-375 mx-auto my-0 px-4 py-8 md:px-10 md:h-screen md:flex md:flex-col">
    <div
        class="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4 md:gap-0"
    >
        <h1
            class="typo-h1"
        >
            Fermata
        </h1>
        <div
            class="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 {isConnected
                ? 'bg-[#e8f5e9] text-[#2e7d32]'
                : 'bg-[#f5f5f5] text-[#666]'}"
        >
            <span
                class="w-2 h-2 rounded-full {isConnected
                    ? 'bg-[#4caf50]'
                    : 'bg-[#999] animate-pulse'}"
            ></span>
            {isConnected ? "Live" : "Connecting..."}
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 min-h-140 md:h-full">
        <div class="flex flex-col gap-8">
            <Letterbox {hasNewComment} />
            <QRCode />
            <!-- <CommentCounter count={comments.length} /> -->
        </div>
        <div>
            <CommentWall {comments} />
        </div>
    </div>
</main>
