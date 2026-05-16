<script lang="ts">
    import type { Comment } from "../lib/api";

    let { comments = [] }: { comments: Comment[] } = $props();
    let displayComments = $derived(comments.slice(-12).reverse());

    // Distribute comments into 3 columns
    let col1 = $derived(displayComments.filter((_, i) => i % 3 === 0));
    let col2 = $derived(displayComments.filter((_, i) => i % 3 === 1));
    let col3 = $derived(displayComments.filter((_, i) => i % 3 === 2));

    function getRandomColor(seed: string) {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const colorIndex = Math.abs(hash) % 3;
        return ["sticky-note-green", "sticky-note-yellow", "sticky-note-pink"][
            colorIndex
        ];
    }
</script>

{#snippet stickyNote(color: string, comment: Comment)}
    <div class={`sticky-note ${color}`}>
        <div class="sticky-note-header">
            <strong class="typo-logo">
                {comment.name}
            </strong>
            <span class="font-sans text-[0.65rem] text-[#666]">
                {comment.timestamp.toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                    // hour: "2-digit",
                    // minute: "2-digit",
                })}
            </span>
        </div>
        <p
            class="font-sans text-sm text-[#333] leading-relaxed m-0 mt-2 wrap-break-word"
        >
            {comment.comment}
        </p>
    </div>
{/snippet}

<div class="bg-white border border-[#e0e0e0] py-8 h-full flex flex-col">
    <h2
        class="font-serif text-2xl font-normal text-black mx-8 m-0 tracking-[-0.0625rem]"
    >
        留言
    </h2>

    {#if displayComments.length === 0}
        <p class="text-center text-[#999] py-8 font-sans">
            No comments yet. Be the first!
        </p>
    {:else}
        <div class="flex-1 overflow-y-auto">
            <div class="grid grid-cols-3 gap-4 items-start m-8">
                <!-- Column 1 -->
                <div class="flex flex-col gap-4 pt-0">
                    {#each col1 as comment (comment.id)}
                        {@render stickyNote(
                            getRandomColor(comment.id),
                            comment,
                        )}
                    {/each}
                </div>

                <!-- Column 2 - Staggered down -->
                <div class="flex flex-col gap-4 pt-8">
                    {#each col2 as comment (comment.id)}
                        {@render stickyNote(
                            getRandomColor(comment.id),
                            comment,
                        )}
                    {/each}
                </div>

                <!-- Column 3 - Staggered down more -->
                <div class="flex flex-col gap-4 pt-4">
                    {#each col3 as comment (comment.id)}
                        {@render stickyNote(
                            getRandomColor(comment.id),
                            comment,
                        )}
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .sticky-note {
        width: 100%;
        padding: 1rem;
        background: #fef9e7;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
        transition: all 0.2s ease;
    }

    .sticky-note-green {
        background: #e6ffeb;
        transform: rotate(-1deg);
    }
    .sticky-note-yellow {
        background: #fff9e6;
        transform: rotate(1deg);
    }

    .sticky-note-pink {
        background: #ffe6f0;
        transform: rotate(-0.5deg);
    }

    .sticky-note:hover {
        transform: rotate(0deg) scale(1.02);
        box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10;
    }

    .sticky-note-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-20px) rotate(-5deg);
        }
        to {
            opacity: 1;
            transform: translateY(0) rotate(-1deg);
        }
    }
</style>
