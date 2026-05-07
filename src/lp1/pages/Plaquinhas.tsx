
import { MessageCircle } from "lucide-react";
import NetflixLayout from "@/components/NetflixLayout";
import { Movie } from "@/components/MovieRow";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";

const Plaquinhas = () => {
  const plaquinhas = [
    { id: "1", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0025.jpg", link: "" },
    { id: "2", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0026.jpg", link: "" },
    { id: "3", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0027.jpg", link: "" },
    { id: "4", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0028.jpg", link: "" },
    { id: "5", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0029.jpg", link: "" },
    { id: "6", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0030.jpg", link: "" },
    { id: "7", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0031.jpg", link: "" },
    { id: "8", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0032.jpg", link: "" },
    { id: "9", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0033.jpg", link: "" },
    { id: "10", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0034.jpg", link: "" },
    { id: "11", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0035.jpg", link: "" },
    { id: "12", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0036.jpg", link: "" },
    { id: "13", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0037.jpg", link: "" },
    { id: "14", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0038.jpg", link: "" },
    { id: "15", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0039.jpg", link: "" },
    { id: "16", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0040.jpg", link: "" },
    { id: "17", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0041.jpg", link: "" },
    { id: "18", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0042.jpg", link: "" },
    { id: "19", imageUrl: "https://flowtech.cloud/IMG-20250217-WA0043.jpg", link: "" }
  ];

  return (
    <NetflixLayout>
      <div className="pt-4 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-netflix text-left px-4 mb-2">
            Alguns clientes que já receberam as Plaquinhas! 🔥
          </h2>
          <div className="movie-card-container flex overflow-x-auto gap-4 py-2 px-4 scroll-smooth snap-x">
            {plaquinhas.map((plaquinha) => (
              <MovieCard key={plaquinha.id} imageUrl={plaquinha.imageUrl} link={plaquinha.link} />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center my-8">
          <Button
            onClick={() => window.location.href = "https://wa.me/553172385290?text=Opa,%20quero%20minha%20plaquinha!"}
            className="bg-[#25d366] hover:bg-[#1ebc58] text-white px-6 py-6 rounded-full flex items-center gap-3 animate-pulse-button"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-lg font-netflix">Solicite sua plaquinha aqui</span>
          </Button>
        </div>
      </div>
    </NetflixLayout>
  );
};

export default Plaquinhas;
