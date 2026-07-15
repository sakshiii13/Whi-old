import Shop from "./Shop";
import TheEditSection from "./Theeditsection";
import HeroSection from "./HeroSection";
import PolaroidProductCard from "./Polaroidproductcard";
import EditorialProductCard from "./Editorialproductcard";
import { Typography } from "@mui/material";
import BrandSection from "../landing/brands/BrandSection";
import CraftImpact from "./Craftimpact";

const products = [
  {
    id: 1,
    image: "https://picsum.photos/400/500?1",
    name: "Premium Hoodie",
    category: "Fashion",
    price: 1499,
    originalPrice: 1999,
  },
  {
    id: 2,
    image: "https://picsum.photos/400/500?2",
    name: "Denim Jacket",
    category: "Clothing",
    price: 2499,
    originalPrice: 2999,
  },
  {
    id: 3,
    image: "https://picsum.photos/400/500?3",
    name: "Classic Shoes",
    category: "Footwear",
    price: 3299,
    originalPrice: 3999,
  },
];

const Home = () => {
  return (
    <>
      <HeroSection />
      <Shop />

      {/* Polaroid Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Typography
          component="h2"
          className="!mb-8"
          sx={{
            fontSize: { xs: "24px", md: "33px" },
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--whiold-text-heading)",
            textAlign: "center",
          }}
        >
        Featured Products
        </Typography>

        <div className="flex flex-wrap justify-center gap-8">
          {products.map((product) => (
            <PolaroidProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      <TheEditSection />
      <CraftImpact/>
      <EditorialProductCard/>
      <BrandSection />
    </>
  );
};

export default Home;