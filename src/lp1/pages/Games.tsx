
import NetflixLayout from "@/components/NetflixLayout";
import MovieRow from "@/components/MovieRow";
import { Movie } from "@/components/MovieRow";
import { MessageCircle } from "lucide-react";

const Games = () => {
  // PG SOFT games data
  const pgSoftGames: Movie[] = [
    { id: "pg1", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y57H0JQ4NKTNSJ2DC1GFE.png", link: "" },
    { id: "pg2", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y2ND1NPVNJBGX8GSZ9R37.png", link: "" },
    { id: "pg3", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XPSYCWDVRZVDCYXK07SZK.png", link: "" },
    { id: "pg4", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XG4CYHV9Y2AW4FA05E707.png", link: "" },
    { id: "pg5", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XSFF85Y0NZANFYZJY2MYR.png", link: "" },
    { id: "pg6", imageUrl: "https://china7.flowtech.cloud/storage/01JMA73KTVZRWRATA1PTXDPDCQ.png", link: "" },
    { id: "pg7", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XHQRY9HCVMSQDJ7MEET47.png", link: "" },
    { id: "pg8", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XYYQTEVP57AA2C3S3DZ3N.png", link: "" },
    { id: "pg9", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XTB4TDFNXC0H7YKT447ET.png", link: "" },
    { id: "pg10", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09YDW1RWTBGY5AX44DPKKP.jpg", link: "" },
    { id: "pg11", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y35J2MP46EACXPYCX9XCP.png", link: "" },
    { id: "pg12", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XWSN0VBZNCHPRGC0QZP24.png", link: "" },
    { id: "pg13", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09Z35F75FCAPXRVYVBPCVW.jpg", link: "" },
    { id: "pg14", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y0YBDV6R9A88XJ22SPGV3.png", link: "" },
    { id: "pg15", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09TAFZYC6JD0B0JBPKBV9H.jpg", link: "" },
    { id: "pg16", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09SQRHHKTT21C73YPWWZY0.jpg", link: "" },
    { id: "pg17", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09SAY4V8PMZ6VZF6S6DXX0.jpg", link: "" },
    { id: "pg18", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XJAB5PATXCQGN338C2P45.png", link: "" },
    { id: "pg19", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y5VPESNZK6GF80EQZCKDH.png", link: "" },
    { id: "pg20", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y3MG0S16PQJXRFKDHH8BT.png", link: "" },
    { id: "pg21", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XVXERDAHGGAJW8JAF0049.png", link: "" },
    { id: "pg22", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y02MB9VY4SYGCQ9XGX58N.png", link: "" },
    { id: "pg23", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XXH4BJDGKC8X2JC2N2M5V.png", link: "" },
    { id: "pg24", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XZDBZAZ69A9WYA8J2JGGP.png", link: "" },
    { id: "pg25", imageUrl: "https://china7.flowtech.cloud/storage/01JJ0A19GF3QYYH4BTGEHWENA2.jpg", link: "" },
    { id: "pg26", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XP4YA29EESVJ3J34HRNV5.png", link: "" },
    { id: "pg27", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09P7GA51EAC2ETDNDN0V78.jpg", link: "" },
    { id: "pg28", imageUrl: "https://china7.flowtech.cloud/storage/01JJ0987R0DR2ZNFR7CNBSE642.webp", link: "" },
    { id: "pg29", imageUrl: "https://china7.flowtech.cloud/storage/01JJ09VX9438Z28GDBWT3M939Q.jpg", link: "" },
    { id: "pg30", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XGQ0YVC97SS7MXQQXYDAH.png", link: "" },
    { id: "pg31", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1XFDRJH9P3S4MTXBMX2FV6.png", link: "" },
    { id: "pg32", imageUrl: "https://china7.flowtech.cloud/storage/01JJ1Y45ZYAQB1JZJQCYRGCFME.png", link: "" },
  ];

  // PRAGMATIC games data
  const pragmaticGames: Movie[] = [
    { id: "prag1", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20olympgate.png.webp", link: "" },
    { id: "prag2", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20doghouse.png.webp?t=1739805399369", link: "" },
    { id: "prag3", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20fruitsw.png.webp?t=1739805399369", link: "" },
    { id: "prag4", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20sugarrush.png.webp?t=1739805399369", link: "" },
    { id: "prag5", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20tweethouse.png.webp?t=1739805429052", link: "" },
    { id: "prag6", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs40spartaking.png.webp?t=1739805429052", link: "" },
    { id: "prag7", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs50safariking.png.webp?t=1739805429052", link: "" },
    { id: "prag8", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs10txbigbass.png.webp", link: "" },
    { id: "prag9", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs10bbbonanza.png.webp?t=1739805459045", link: "" },
    { id: "prag10", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs15godsofwar.png.webp", link: "" },
    { id: "prag11", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25mustang.png.webp", link: "" },
    { id: "prag12", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20olympx.png.webp?t=1739805489044", link: "" },
    { id: "prag13", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25copsrobbers.png.webp", link: "" },
    { id: "prag14", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20wildparty.png.webp", link: "" },
    { id: "prag15", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20muertos.png.webp?t=1739805519038", link: "" },
    { id: "prag16", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20midas2.png.webp?t=1739805519038", link: "" },
    { id: "prag17", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20clustcol.png.webp?t=1739805519038", link: "" },
    { id: "prag18", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20pistols.png.webp?t=1739805549043", link: "" },
    { id: "prag19", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs10madame.png.webp?t=1739805549042", link: "" },
    { id: "prag20", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs10cowgold.png.webp?t=1739805549042", link: "" },
    { id: "prag21", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs10vampwolf.png.webp?t=1739805549042", link: "" },
    { id: "prag22", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20bchprty.png.webp?t=1739805579043", link: "" },
    { id: "prag23", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25chilli.png.webp?t=1739805579043", link: "" },
    { id: "prag24", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25gladiator.png.webp?t=1739805579043", link: "" },
    { id: "prag25", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25wolfgold.png.webp?t=1739805579043", link: "" },
    { id: "prag26", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs25pyramid.png.webp?t=1739805609041", link: "" },
    { id: "prag27", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs40pirate.png.webp?t=1739805609041", link: "" },
    { id: "prag28", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs40samurai3.png.webp?t=1739805609041", link: "" },
    { id: "prag29", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs40wildwest.png.webp?t=1739805609041", link: "" },
    { id: "prag30", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20pbonanza.png.webp?t=1739805639045", link: "" },
    { id: "prag31", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs20daydead.png.webp?t=1739805639045", link: "" },
    { id: "prag32", imageUrl: "https://dl-br-cf.sadslj88.com/images-br-rect/PP/vs12bbb.png.webp?t=1739805639046", link: "" },
  ];

  return (
    <NetflixLayout>
      <div className="container mx-auto px-0 mt-4 pb-20">
        <div className="section-title text-left px-4 font-netflix text-2xl mt-6">
          JOGOS PG SOFT (46 jogos sem GGR)
        </div>
        <MovieRow title="" movies={pgSoftGames} />

        <div className="section-title text-left px-4 font-netflix text-2xl mt-8">
          JOGOS PRAGMATIC (47 jogos sem GGR)
        </div>
        <MovieRow title="" movies={pragmaticGames} />

        <div className="flex justify-center mt-10 mb-16">
          <a 
            href="https://wa.me/553172385290?text=Opa,%20tenho%20interesse!" 
            className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebc58] text-white px-6 py-3 rounded-full font-netflix text-lg animate-pulse-button transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={24} />
            Fale Conosco
          </a>
        </div>
      </div>
    </NetflixLayout>
  );
};

export default Games;
