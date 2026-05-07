
import NetflixLayout from "@/lp1/components/NetflixLayout";
import MovieCard from "@/lp1/components/MovieCard";

const Extras = () => {
  const extrasData = [
    {
      id: "app1",
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(19).png",
      link: "https://aplicativo.flowtech2.cloud/home",
    },
    {
      id: "app2", 
      imageUrl: "https://flowtech.cloud/CHINESA%201%20(18).png",
      link: "https://pressell-ads.flowtech2.cloud/",
    },
  ];

  return (
    <NetflixLayout>
      <div className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-netflix text-center mb-8 text-red-600">Extras</h1>
        
        <div className="flex justify-center gap-6 mb-8">
          {extrasData.map((item) => (
            <MovieCard
              key={item.id}
              imageUrl={item.imageUrl}
              link={item.link}
            />
          ))}
        </div>

        <div className="bg-black rounded-lg p-6 max-w-4xl mx-auto border border-green-500/20 shadow-lg shadow-green-500/10">
          <h2 className="text-2xl font-netflix text-green-500 mb-4 text-center">
            Desenvolvimento Personalizado
          </h2>
          <p className="text-gray-300 text-center leading-relaxed">
            Tem alguma plataforma, aplicativo ou função que ainda não criamos? 
            Não se preocupe! Nossa equipe especializada desenvolve soluções personalizadas 
            para atender suas necessidades específicas. Entre em contato conosco pelo WhatsApp 
            e solicite um orçamento. Criamos tudo sob medida para você!
          </p>
          <div className="text-center mt-4">
            <p className="text-red-500 font-semibold">
              💬 Entre em contato e faça seu orçamento!
            </p>
          </div>
        </div>
      </div>
    </NetflixLayout>
  );
};

export default Extras;
