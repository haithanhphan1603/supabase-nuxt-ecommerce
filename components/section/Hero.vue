<template>
  <section class="overflow-hidden">
    <div class="relative">
      <img
        src="/news.webp"
        alt="Photo by Drew Beamer"
        class="rounded-md object-cover w-full h-48 sm:h-64 md:h-80 lg:h-[30rem]"
      />
    </div>
    <div class="py-4 lg:py-8">
      <div
        class="flex gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-20 items-center justify-center w-full flex-nowrap"
      >
        <img class="hero-section__brand" src="/brand/brand1.png" alt="brand1" />
        <img class="hero-section__brand" src="/brand/brand2.png" alt="brand2" />
        <img class="hero-section__brand" src="/brand/brand3.png" alt="brand3" />
        <img class="hero-section__brand" src="/brand/brand4.png" alt="brand4" />
        <img class="hero-section__brand" src="/brand/brand5.png" alt="brand5" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-section__brand {
  filter: brightness(0);
  opacity: 50%;
  width: 4rem;
  @media (max-width: 480px) {
    width: 3rem;
  }
  @media (min-width: 640px) {
    width: 5rem;
  }
  @media (min-width: 768px) {
    width: 6rem;
  }
  @media (min-width: 1024px) {
    width: 8rem;
  }
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 75%;
  }
}

.dark {
  .hero-section__brand {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(36deg)
      brightness(103%) contrast(103%);
  }
}
</style>
