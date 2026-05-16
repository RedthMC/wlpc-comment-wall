<script lang="ts">
    import { onMount } from "svelte";

  // Generate QR code URL using a free API
  let qrCodeUrl = $state('');
  onMount(() => {
    const origin = window?.location.origin ?? '';
    const mobileUrl = origin + '/comment';
    qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mobileUrl)}`;
  });
</script>

<div class="bg-white border border-[#e0e0e0] p-6 text-center">
  <h3 class="font-serif text-lg font-normal text-black m-0 mb-4 tracking-[-0.03125rem]">Scan to Comment</h3>
  <div class="bg-white p-4 inline-block">
    <img src={qrCodeUrl} alt="QR Code for mobile comments" class="block w-[12.5rem] h-[12.5rem]" />
  </div>
  <p class="font-sans text-sm text-[#666] mt-4 m-0">Use your phone to leave a comment</p>
</div>
