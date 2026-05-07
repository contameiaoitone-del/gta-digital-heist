import NetflixLayout from "@/lp1/components/NetflixLayout";
import ProductCard from "@/lp1/components/ProductCard";
import starterImage from "@/lp1/assets/comunidade-x1.png";
import mentoriaImage from "@/lp1/assets/comunidade-x1-mentoria.png";

const Index = () => {
  const products = [
    {
      id: "caminho1",
      title: "STARTER WHATS",
      description: "APRENDA TUDO DO 0",
      imageUrl: starterImage,
      link: "/caminho1",
      isLocked: false,
      externalLink: "https://lp1.joaolucassps.co"
    },
    {
      id: "mentoria",
      title: "MENTORIA JOÃO LUCAS",
      description: "MENTORIA INDIVIDUAL",
      imageUrl: mentoriaImage,
      link: "/mentoria",
      isLocked: false,
      externalLink: "https://chat.whatsapp.com/KAh47hcDL0n92QXKNg3RGP?mode=gi_t"
    }
  ];

  return (
    <NetflixLayout>
      {/* Products Section */}
      <section className="min-h-screen py-12 bg-background relative flex items-center">
        {/* Blur effects for modern look */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Products Vertical List */}
          <div className="flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto px-2">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                title={product.title}
                description={product.description}
                imageUrl={product.imageUrl}
                link={product.link}
                isLocked={product.isLocked}
                externalLink={product.externalLink}
              />
            ))}
          </div>
        </div>
      </section>
    </NetflixLayout>
  );
};

export default Index;
