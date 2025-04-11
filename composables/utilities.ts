export const useUtilities = () => {
  const { width } = useWindowSize()
  const isMobile = computed(() => width.value < 768)
  return {
    isMobile,
  }
}
