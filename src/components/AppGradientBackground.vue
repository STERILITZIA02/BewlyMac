<script setup lang="ts">
import { useDark } from '~/composables/useDark'
import { AppPage } from '~/enums/appEnums'
import { settings } from '~/logic'
import { hexToHSL } from '~/utils/main'

const props = defineProps<{ activatedPage: AppPage }>()

const { isDark } = useDark()

const themeColorHsl = computed(() => {
  return hexToHSL(settings.value.themeColor).replace('hsl(', '').replace(')', '')
})
const themeColorHue = computed((): number => {
  return Number(themeColorHsl.value.split(',')[0]) || 0
})
const themeColorSaturation = computed((): number => {
  return Number(themeColorHsl.value.split(',')[1].replace('%', '')) || 0
})
const themeColorLightness = computed((): number => {
  return Number(themeColorHsl.value.split(',')[2].replace('%', '')) || 0
})
const themeColorLinearGradientBackground = computed((): string => {
  return `linear-gradient(180deg,
    transparent 0% 44%,
    hsla(${themeColorHue.value}, ${themeColorSaturation.value + 20}%, ${themeColorLightness.value}%, 0.4) 62%,
    hsl(${themeColorHue.value}, ${themeColorSaturation.value}%, ${themeColorLightness.value}%) 80%,
    hsl(${themeColorHue.value}, ${themeColorSaturation.value}%, 100%) 100%)`
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="settings.useLinearGradientThemeColorBackground && isDark"
      :style="{
        opacity: props.activatedPage === AppPage.Search ? 1 : 0.4,
        background: themeColorLinearGradientBackground,
      }"
      pos="absolute top-0 left-0" w-full h-full z-0 pointer-events-none
    />
  </Transition>
</template>
