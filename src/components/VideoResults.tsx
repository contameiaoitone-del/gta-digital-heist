import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

const videos = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&h=600&fit=crop",
    name: "Rafael M.",
    label: "DÚVIDAS"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    name: "Lucas S.",
    label: "RESULTADOS"
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1639149888905-fb39731f2e6c?w=800&h=600&fit=crop",
    name: "Thiago P.",
    label: "TRANSFORMAÇÃO"
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop",
    name: "Bruno C.",
    label: "1º VENDA"
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop",
    name: "Gabriel F.",
    label: "MUDANÇA"
  }
];

export const VideoResults = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const visibleVideos = [
    videos[currentIndex],
    videos[(currentIndex + 1) % videos.length],
    videos[(currentIndex + 2) % videos.length]
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background/95 via-background to-background/95">
      {/* Neon glow background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-neon-pink/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Resultados Reais de
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-neon-pink to-primary">
              Membros Reais
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como nossos membros estão transformando conhecimento em resultados mensuráveis.
          </p>
        </div>

        {/* Video Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevVideo}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextVideo}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 px-12">
            {visibleVideos.map((video, index) => (
              <div
                key={video.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  index === 1 ? "md:scale-110 z-10" : "opacity-70 hover:opacity-100"
                }`}
              >
                {/* Video Container with Purple Border */}
                <div className="relative rounded-lg overflow-hidden border-4 border-primary/50 bg-gradient-to-br from-primary/20 to-neon-pink/20">
                  {/* Thumbnail */}
                  <div className="aspect-[9/16] relative">
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center animate-glow-pulse">
                        <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>

                    {/* Label */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
                      <span className="text-sm font-bold text-white">{video.label}</span>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <p className="text-center mt-3 font-semibold text-foreground">{video.name}</p>
              </div>
            ))}
          </div>

          {/* Audio Control */}
          <div className="absolute top-4 left-16 z-20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="bg-primary/90 hover:bg-primary text-white backdrop-blur-sm gap-2"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isMuted ? "ATIVAR SOM" : "SOM ATIVADO"}
            </Button>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-12 animate-fade-in">
          Centenas de alunos já transformaram suas vidas com a Real Life Academy.
        </p>
      </div>
    </section>
  );
};
