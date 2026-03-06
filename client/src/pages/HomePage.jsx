import HeroCarousel from '../components/home/HeroCarousel'
import DeliveryOptions from '../components/home/DeliveryOptions'
import StatsBar from '../components/home/StatsBar'
import ProductGrid from '../components/products/ProductGrid'
import RepairHighlight from '../components/home/RepairHighlight'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <DeliveryOptions />
      <StatsBar />
      <ProductGrid />
      <RepairHighlight />
    </>
  )
}
