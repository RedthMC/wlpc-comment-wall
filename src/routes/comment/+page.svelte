<script lang="ts">
    import { appendComment, setupRealtime, type Comment } from "$lib/api";
    import CommentNote from "$lib/components/CommentNote.svelte";
    import { onMount } from "svelte";

    type SubmittingState = "none" | "submitting" | "succeed" | "failed";

    let name = $state("");
    let comment = $state("");
    let submittingState: SubmittingState = $state("none");

    const submittingStateMessage: { [key in SubmittingState]: string } = {
        none: "張貼",
        submitting: "發布中…",
        succeed: "張貼成功!",
        failed: "張貼失敗…"
    };

    let comments: Comment[] = $state([]);

    onMount(() =>
        setupRealtime(
            (c) => (comments = c),
            () => {},
        ),
    );

    async function onSubmit(e: SubmitEvent) {
        e.preventDefault();
        submittingState = "submitting";
        submittingState = await appendComment({ name: name.trim() || "匿名", comment }) ? "succeed" : "failed";
        setTimeout(() => {
            submittingState = "none";
            name = "";
            comment = "";
        }, 3000);
    }
</script>

<svelte:head>
    <title>Fermata - 留言</title>
</svelte:head>

<div class="min-h-screen px-4 pb-10 md:px-8">
    <!-- Header -->
    <div class="flex items-center justify-between py-4 border-b border-gray-200 mb-6">
        <span class="typo-logo">Fermata</span>
    </div>

    <div class="max-w-2xl mx-auto">
        <!-- Form -->
        <div class="bg-gray-100 with-pin border border-gray-900 p-5 shadow-lg mb-4 relative">
            <form onsubmit={onSubmit} class="mt-4 flex flex-col gap-4">
                <div class="flex justify-between items-center gap-3 border-b border-gray-300 pb-3">
                    <input type="text" placeholder="班級座號（例: 21637）" bind:value={name} maxlength={100} disabled={submittingState != "none"} class="flex-1 bg-transparent text-slate-800 text-base placeholder:text-gray-400 focus:outline-none disabled:opacity-50" />
                    <button type="submit" disabled={submittingState != "none" || !comment.trim()} class="text-blue-500 font-bold text-base transition-colors cursor-pointer hover:text-black disabled:opacity-40 disabled:cursor-not-allowed">
                        {submittingStateMessage[submittingState]}
                    </button>
                </div>
                <textarea placeholder="我覺得這個影展…" bind:value={comment} maxlength={200} rows={2} disabled={submittingState != "none"} class="bg-transparent text-slate-900 text-base field-sizing-content placeholder:text-gray-400 resize-none focus:outline-none leading-relaxed disabled:opacity-50"></textarea>
                <div class="text-right text-xs text-gray-400">{comment.length}/200</div>
            </form>
        </div>

        <!-- Comments list -->
        <div class="flex flex-col gap-4">
            {#if comments.length === 0}
                <p class="text-center text-gray-400 py-12">載入中…</p>
            {:else}
                {#each comments as c (c.id)}
                    <div class="slide-in"><CommentNote comment={c} /></div>
                {/each}
            {/if}
        </div>
    </div>
</div>


<style>
    .with-pin::after {
        content: "";
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        background-color: #8b7b63;
        border-radius: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .slide-in {
        animation: slideIn 0.5s ease;
        transition: all 0.5s ease;
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