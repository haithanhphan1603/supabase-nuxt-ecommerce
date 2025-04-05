export const useActiveTouchProduct = () => {
  const activeProductId = useState<number | null>('activeProductId', () => null)
  function setActiveProduct(id: number) {
    activeProductId.value = id
  }
  return {
    activeProductId,
    setActiveProduct,
  }
}
