<script lang="ts">
    import bg from './bg.jpg'
</script>

<img class="noise-overlay" src={bg} alt=''>

<style>
    .noise-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        /* opacity: 0.18; /* 調整此數值控制噪點強弱 */
        pointer-events: none; /* 確保不影響點擊操作 */
        /* mix-blend-mode: multiply; */
    }
</style>
