const GameLoader = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-md rounded-lg px-6 py-4 shadow-lg border border-white/10">
        <div className="flex items-center gap-3">
          {/* Spinner */}
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          
          {/* Loading Text */}
          <div className="text-white text-sm font-medium">
            Carregando seu sucesso no digital
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLoader;
