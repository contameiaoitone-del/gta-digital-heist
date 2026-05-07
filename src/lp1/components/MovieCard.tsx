
interface MovieCardProps {
  imageUrl: string;
  link: string;
}

const MovieCard = ({ imageUrl, link }: MovieCardProps) => {
  const isNewRelease = imageUrl === "https://flowtech.cloud/RASPAKF.png" || 
                      imageUrl === "https://flowtech.cloud/MODELREAL.png" ||
                      imageUrl === "https://flowtech.cloud/BINGO.png";
  const isUpdated = imageUrl === "https://flowtech.cloud/CHINESA%201%20(5).png";

  return (
    <div 
      className="flex-shrink-0 w-[150px] h-[220px] sm:w-[180px] sm:h-[260px] rounded-lg overflow-hidden 
                transition-transform duration-300 hover:scale-105 cursor-pointer snap-start relative"
      style={{ 
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#333'
      }}
    >
      {isNewRelease && (
        <div className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded-sm text-xs font-semibold z-10 shadow-sm">
          NOVO
        </div>
      )}
      {isUpdated && (
        <div className="absolute top-1 right-1 bg-blue-600 text-white px-2 py-1 rounded-sm text-xs font-semibold z-10 shadow-sm">
          ATUALIZADA
        </div>
      )}
      <a 
        href={link} 
        className="block w-full h-full" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <span className="sr-only">View content</span>
      </a>
    </div>
  );
};

export default MovieCard;
