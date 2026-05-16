<script lang="ts">
    import type { Comment } from "$lib/api";
    import { formatRelativeTime } from "$lib/api";

    let { comment }: { comment: Comment } = $props();
</script>

<article class="sticky-note relative p-5 shadow-lg w-full min-h-32 bg-gray-100 border border-gray-900">
    <div class="flex justify-between items-start mb-3 border-b border-gray-300 pb-2">
        <strong class="font-bold text-slate-800 text-base break-all">{comment.name || "匿名"}</strong>
        <span class="text-gray-500 text-xs ml-2 shrink-0">{formatRelativeTime(comment.timestamp)}</span>
    </div>
    <p class="m-0 text-slate-900 text-md leading-relaxed whitespace-pre-wrap wrap-break-word">{comment.comment}</p>
</article>

<style>
    .sticky-note::after {
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
