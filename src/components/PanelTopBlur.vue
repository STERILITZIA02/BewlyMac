<script setup lang="ts">
defineProps<{
  enabled: boolean
}>()
</script>

<template>
  <div
    class="bew-panel-top-blur"
    :class="{ 'bew-panel-top-blur--disabled': !enabled }"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
.bew-panel-top-blur {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  height: calc(100% + var(--bew-space-6));
  background: transparent;
  border: 0;
  border-radius: inherit;
  corner-shape: inherit;
  pointer-events: none;
  mask-image: linear-gradient(
    to bottom,
    black 0%,
    black var(--bew-panel-top-blur-hold, 48%),
    transparent calc(100% - var(--bew-space-6)),
    transparent 100%
  );
  mask-repeat: no-repeat;
  mask-size: 100% 100%;
  backdrop-filter: blur(3px) saturate(180%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    black 0%,
    black var(--bew-panel-top-blur-hold, 48%),
    transparent calc(100% - var(--bew-space-6)),
    transparent 100%
  );
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  -webkit-backdrop-filter: blur(3px) saturate(180%);
}

.bew-panel-top-blur--disabled {
  mask-image: none;
  backdrop-filter: none;
  -webkit-mask-image: none;
  -webkit-backdrop-filter: none;
}
</style>
