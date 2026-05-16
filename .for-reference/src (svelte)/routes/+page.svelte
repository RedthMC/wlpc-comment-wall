<script lang="ts">
    import timelinePath from "$lib/assets/pathway.svg";
    import fermataLogo from "$lib/assets/fermata.svg";

    const timelineEvents = [
        { date: "5/18", event: "開展" },
        { date: "5/18", event: "開展" },
        { date: "5/18", event: "開展" },
        { date: "5/29", event: "開展" },
    ];
</script>

<svelte:head>
    <title>Fermata - WLPC 10th Photography Exhibition</title>
</svelte:head>

<div class="max-w-395 mx-auto overflow-x-hidden font-sans text-foreground px-4 pb-5 md:px-10 md:pb-5">
    <!-- Top Navigation -->
    <div class="flex justify-between items-center py-4">
        <div class="typo-logo">WLPC 10th</div>
        <a
            href="https://www.figma.com/sites"
            target="_blank"
            rel="noopener noreferrer"
            class="no-underline"
        >
            <button class="btn-primary">
                Learn More
            </button>
        </a>
    </div>

    <!-- Hero Section -->
    <header class="flex flex-col items-center justify-center gap-7.5 py-20 md:flex-row md:min-h-150 lg:min-h-200">
        <div class="w-full flex flex-col items-center gap-7.5 md:flex-1 md:gap-12.5">
            <h1 class="typo-display bg-full text-on-full w-fit px-2 m-0">
                Fermata.
            </h1>
            <h2 class="typo-h1 w-fit m-0">
                最終影展
            </h2>
        </div>
        <div class="flex items-center justify-center w-[60%] md:flex-1 md:w-auto ">
            <img class="min-w-0 min-h-0" src={fermataLogo} alt="Hero visual" />
        </div>
    </header>

    <!-- Timeline Section -->
    <section class="my-7.5 flex justify-center md:my-12.5 md:py-12.5">
        <div class="relative flex flex-col w-fit md:gap-20">
            <div class="absolute h-full -left-4">
                <img class="h-full" src={timelinePath} alt="Timeline path" />
            </div>
            {#each timelineEvents as item, idx}
                <div class="w-fit flex items-center gap-12 py-7.5 md:gap-25 lg:gap-50" class:pl-8={idx % 2 === 1}>
                    <h2 class="w-fit typo-h1 md:text-6xl lg:text-7xl">
                        {item.date}
                    </h2>
                    <div class="w-fit typo-h0 md:text-7xl lg:text-8xl">
                        {item.event}
                    </div>
                </div>
            {/each}
        </div>
    </section>

    <!-- CTA Section -->
    <section class="max-w-full mx-auto py-15 text-center border-t border-[#e9e9e9] md:max-w-225 md:py-25 lg:py-30">
        <h2 class="typo-h1 mb-5">
            Connect with us
        </h2>
        <p class="typo-p mb-7.5">
            Schedule a quick call to learn how Area can turn your regional data
            into a powerful advantage.
        </p>
        <a
            href="https://www.figma.com/sites"
            target="_blank"
            rel="noopener noreferrer"
        >
            <button class="btn-primary w-full max-w-75">
                Learn More
            </button>
        </a>
    </section>

    <!-- Footer -->
    <footer class="flex flex-row justify-between items-center typo-caption">
        <span>© WLPC 2025</span>
        <span>All Rights Reserved</span>
    </footer>
</div>


