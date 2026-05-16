<script lang="ts">
    import { appendComment, setupRealtime, type Comment } from "$lib/api";
    import { onMount } from "svelte";
    import CommentWall from "../../components/CommentWall.svelte";

    let name = $state("");
    let comment = $state("");
    let isSubmitting = $state(false);
    let showSuccess = $state(false);

    let comments: Comment[] = $state([]);
    onMount(() => setupRealtime(c => (comments = c), () => {}));

    async function onSumbit(e: SubmitEvent) {
        e.preventDefault();
        isSubmitting = true;
        showSuccess = await appendComment({ name, comment });
        if (showSuccess) {
            name = "";
            comment = "";
            setTimeout(() => (showSuccess = false), 3000);
        }
        isSubmitting = false;
    }
</script>

<svelte:head>
    <title>WLPC Exhibition - Leave a Comment</title>
</svelte:head>

<div class="min-h-screen px-4 md:px-10">
    <div class="flex justify-between items-center py-4">
        <div class="typo-logo">WLPC 10th</div>
        <a
            href="https://www.figma.com/sites"
            target="_blank"
            rel="noopener noreferrer"
            class="no-underline"
        >
            <button class="btn-primary"> Learn More </button>
        </a>
    </div>

    <div class="max-w-2xl mx-auto">
        <header class="text-center mb-12">
            <h1 class="typo-display mb-5">Fermata</h1>
            <p class="typo-h1">留言板</p>
        </header>
        <CommentWall {comments} />

        {#if showSuccess}
            <div
                class="bg-black text-white px-6 py-4 mb-6 text-center animate-[slideDown_0.3s_ease]"
            >
                ✓ Thank you! Your comment has been posted.
            </div>
        {/if}

        <form onsubmit={onSumbit} class="space-y-6 mt-8">
            <div>
                <label
                    for="name"
                    class="block mb-2 text-black font-sans text-sm font-semibold"
                >
                    名稱
                </label>
                <input
                    id="name"
                    type="text"
                    placeholder="輸入名稱"
                    bind:value={name}
                    maxlength="50"
                    required
                    class="w-full px-4 py-3 border-2 border-on-accent font-sans text-base transition-colors duration-200 focus:outline-none focus:border-accent"
                />
            </div>

            <div>
                <label
                    for="comment"
                    class="block mb-2 text-black font-sans text-sm font-semibold"
                >
                    留言
                </label>
                <textarea
                    id="comment"
                    placeholder="我喜歡這張照片，因為..."
                    bind:value={comment}
                    rows="6"
                    maxlength="200"
                    required
                    class="w-full px-4 py-3 border-2 border-on-accent font-sans text-base resize-vertical transition-colors duration-200 focus:outline-none focus:border-accent"
                ></textarea>
                <div class="text-right text-sm text-paragraph mt-1">
                    {comment.length}/200
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !comment.trim()}
                class="w-full px-6 py-4 bg-accent text-white border-none font-sans text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "發布中..." : "發布留言"}
            </button>
        </form>
    </div>
</div>

<style>
    @keyframes slideDown {
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
