import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  {
    id: 1,
    videoId: "d491c5fe-05c2-4207-b968-88a57933ea74",
    name: "Resultado 1",
    label: "DEPOIMENTO"
  },
  {
    id: 2,
    videoId: "a764c6e9-ffbd-4cf7-8755-44fed0f19a12",
    name: "Resultado 2",
    label: "DEPOIMENTO"
  }
];

export const VideoResults = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const currentVideo = videos[currentIndex];

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
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          {videos.length > 1 && (
            <>
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
            </>
          )}

          {/* Video Player */}
          <div className="px-12">
            <div className="relative rounded-lg overflow-hidden border-4 border-primary/50 bg-gradient-to-br from-primary/20 to-neon-pink/20">
              <div className="aspect-video relative">
                <iframe
                  id={`panda-${currentVideo.videoId}`}
                  src={`https://player-vz-a0225c98-3ba.tv.pandavideo.com.br/embed/?v=${currentVideo.videoId}`}
                  style={{ border: 'none' }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  allowFullScreen={true}
                  className="w-full h-full"
                />
              </div>
            </div>
            
            {/* Video Info */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <p className="text-center font-semibold text-foreground">{currentVideo.name}</p>
              <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full text-sm font-bold text-white">
                {currentVideo.label}
              </span>
            </div>
          </div>

          {/* Video Indicators */}
          {videos.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Ir para vídeo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground mt-12 animate-fade-in">
          Centenas de alunos já transformaram suas vidas com a Real Life Academy.
        </p>
      </div>
    </section>
  );
};
