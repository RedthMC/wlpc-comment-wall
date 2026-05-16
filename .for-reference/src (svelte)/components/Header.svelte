<script lang="ts">
  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<header class="header">
  <button class="menu-toggle" onclick={toggleMenu} aria-label="Toggle menu">
    <span class="menu-line"></span>
    <span class="menu-line"></span>
    <span class="menu-text">MENU</span>
  </button>

  <div class="header-logo">
    <img src="https://ext.same-assets.com/721438962/3607337378.svg" alt="Kitamura Makura" class="header-logo-img" />
  </div>
</header>

{#if menuOpen}
<div class="menu-overlay" class:open={menuOpen}>
  <button class="menu-close" onclick={toggleMenu} aria-label="Close menu">
    <span class="close-line"></span>
    <span class="close-line"></span>
  </button>

  <nav class="menu-nav">
    <a href="#products" onclick={() => menuOpen = false}>01 PRODUCTS</a>
    <a href="#company" onclick={() => menuOpen = false}>02 COMPANY</a>
    <a href="#contact" onclick={() => menuOpen = false}>03 CONTACT</a>
  </nav>

  <div class="menu-footer">
    <div class="social-links">
      <a href="https://www.facebook.com/KitamuraMakura.jp/" target="_blank" rel="noopener">Facebook</a>
      <a href="https://www.instagram.com/kitamuramakura1923/" target="_blank" rel="noopener">Instagram</a>
    </div>
  </div>
</div>
{/if}

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    z-index: 100;
    pointer-events: none;
  }

  .menu-toggle,
  .header-logo {
    pointer-events: auto;
  }

  .menu-toggle {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .menu-line {
    width: 24px;
    height: 1px;
    background: white;
    transition: all 0.3s ease;
  }

  .menu-text {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: white;
    margin-top: 0.5rem;
  }

  .header-logo-img {
    width: 40px;
    height: auto;
    filter: invert(1);
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(5, 5, 5, 0.98);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .menu-close {
    position: absolute;
    top: 2rem;
    left: 2rem;
    background: none;
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .close-line {
    width: 24px;
    height: 1px;
    background: white;
    position: absolute;
  }

  .close-line:first-child {
    transform: rotate(45deg);
  }

  .close-line:last-child {
    transform: rotate(-45deg);
  }

  .menu-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .menu-nav a {
    font-size: 1.2rem;
    letter-spacing: 0.3em;
    color: white;
    transition: color 0.3s ease;
  }

  .menu-nav a:hover {
    color: #bc3b2e;
  }

  .menu-footer {
    position: absolute;
    bottom: 3rem;
    display: flex;
    gap: 2rem;
  }

  .social-links {
    display: flex;
    gap: 2rem;
  }

  .social-links a {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    color: #5f6059;
    transition: color 0.3s ease;
  }

  .social-links a:hover {
    color: white;
  }
</style>
