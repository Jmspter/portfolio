<template>
  <div class="hero-art relative mx-auto mt-10 w-fit lg:hidden" aria-hidden="true">
    <span class="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--blue)_/0.30),transparent)] blur-xl" />
    <span class="geo-float absolute -left-4 top-0 h-4 w-4 rounded-full bg-accent/80" />
    <span class="geo-drift absolute -right-5 top-2/3 h-5 w-5 rotate-45 bg-highlight/90" />
    <svg
      viewBox="0 0 512 512"
      class="geo-float relative h-28 w-28 rounded-[1.75rem] border border-line shadow-[0_18px_44px_rgba(7,18,43,0.28)] sm:h-32 sm:w-32"
    >
      <rect width="512" height="512" rx="48" fill="#07122B" />
      <circle cx="150" cy="150" r="106" fill="#E10600" />
      <rect x="270" y="44" width="198" height="198" fill="#FFCC00" />
      <path d="M44 468 256 256l212 212Z" fill="#fff" />
    </svg>
  </div>
</template>