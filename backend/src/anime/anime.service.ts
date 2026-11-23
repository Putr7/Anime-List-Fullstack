import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Anime } from './entities/anime.entity.js';
import { CreateAnimeDto } from './dto/create-anime.dto.js';
import { UpdateAnimeDto } from './dto/update-anime.dto.js';

@Injectable()
export class AnimeService {
  private animeList: Anime[] = [
    {
      id: 1,
      judul: 'One Piece',
      tipe: 'TV',
      episode: '1000+',
      status: 'Sedang Tayang (Ongoing)',
      studio: 'Toei Animation',
      genre: 'Action, Adventure, Fantasy',
      skor: 8.92,
      sinopsis:
        'Gol D. Roger dikenal sebagai "Raja Bajak Laut", bajak laut terkuat dan paling terkenal yang pernah berlayar di Grand Line. Monkey D. Luffy, seorang bocah 17 tahun, bertekad untuk menemukan harta karun tersebut dan menjadi Raja Bajak Laut berikutnya.',
      gambar: '/OnePiece.webp',
    },
    {
      id: 2,
      judul: 'Attack on Titan',
      tipe: 'TV',
      episode: '25 (Season 1)',
      status: 'Selesai Tayang (Finished Airing)',
      studio: 'Wit Studio',
      genre: 'Action, Dark Fantasy, Drama',
      skor: 8.54,
      sinopsis:
        'Berabad-abad yang lalu, umat manusia dibantai hingga hampir punah oleh makhluk mengerikan yang disebut Titan, memaksa manusia untuk bersembunyi di balik tembok raksasa. Eren Yeager bersumpah untuk menghabisi setiap Titan demi membalas dendam ibunya.',
      gambar: '/attackontitan.webp',
    },
    {
      id: 3,
      judul: 'Jujutsu Kaisen',
      tipe: 'TV',
      episode: '24',
      status: 'Selesai Tayang (Finished Airing)',
      studio: 'MAPPA',
      genre: 'Action, Dark Fantasy, Supernatural',
      skor: 8.61,
      sinopsis:
        'Yuji Itadori menelan benda terkutuk yang sangat kuat (jari Ryomen Sukuna) untuk menyelamatkan teman-temannya. Ia kemudian bergabung dengan organisasi rahasia Penyihir Jujutsu untuk membasmi kutukan.',
      gambar: '/jujutsukaisen.webp',
    },
    {
      id: 4,
      judul: 'Naruto',
      tipe: 'TV',
      episode: '220',
      status: 'Selesai Tayang (Finished Airing)',
      studio: 'Pierrot',
      genre: 'Action, Adventure, Fantasy',
      skor: 8.0,
      sinopsis:
        'Naruto Uzumaki, seorang ninja yang hiperaktif dan tidak bisa ditebak, terus-menerus mencari pengakuan dan bermimpi menjadi Hokage, pemimpin desa yang diakui sebagai ninja terkuat.',
      gambar: '/Naruto.webp',
    },
  ];

  // CREATE: Tambah anime baru
  create(createAnimeDto: CreateAnimeDto): Anime {
    
    const exists = this.animeList.some(
      (anime) =>
        anime.judul.trim().toLowerCase() ===
        createAnimeDto.judul.trim().toLowerCase(),
    );

    if (exists) {
      throw new ConflictException(
        `Anime dengan judul "${createAnimeDto.judul}" sudah terdaftar dalam katalog!`,
      );
    }

    const nextId =
      this.animeList.length > 0
        ? Math.max(...this.animeList.map((a) => a.id)) + 1
        : 1;

    const newAnime: Anime = {
      id: nextId,
      judul: createAnimeDto.judul.trim(),
      tipe: createAnimeDto.tipe ?? 'TV',
      episode: createAnimeDto.episode?.trim() || '1',
      status: createAnimeDto.status || 'Sedang Tayang (Ongoing)',
      studio: createAnimeDto.studio?.trim() || 'Studio Independen',
      genre: createAnimeDto.genre?.trim() || 'Action',
      skor:
        typeof createAnimeDto.skor === 'number'
          ? createAnimeDto.skor
          : 8.0,
      sinopsis:
        createAnimeDto.sinopsis?.trim() ||
        'Belum ada sinopsis untuk anime ini.',
      gambar: createAnimeDto.gambar || '/OnePiece.webp',
    };

    this.animeList.unshift(newAnime);
    return newAnime;
  }

  // READ ALL: Ambil seluruh anime
  findAll(): Anime[] {
    return this.animeList;
  }

  // READ ONE: Ambil satu anime berdasarkan ID
  findOne(id: number): Anime {
    const anime = this.animeList.find((item) => item.id === id);

    if (!anime) {
      throw new NotFoundException(
        `Data anime dengan ID ${id} tidak ditemukan.`,
      );
    }

    return anime;
  }

  // UPDATE: Memperbarui data anime (PATCH)
  update(id: number, updateAnimeDto: UpdateAnimeDto): Anime {
    const index = this.animeList.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(
        `Gagal memperbarui: Anime dengan ID ${id} tidak ditemukan.`,
      );
    }

    if (updateAnimeDto.judul) {
      const duplicate = this.animeList.some(
        (item) =>
          item.id !== id &&
          item.judul.trim().toLowerCase() ===
            updateAnimeDto.judul!.trim().toLowerCase(),
      );

      if (duplicate) {
        throw new ConflictException(
          `Judul "${updateAnimeDto.judul}" sudah digunakan oleh anime lain!`,
        );
      }
    }

    const currentAnime = this.animeList[index];
    const updatedAnime: Anime = {
      ...currentAnime,
      ...updateAnimeDto,
      skor:
        updateAnimeDto.skor !== undefined
          ? Number(updateAnimeDto.skor)
          : currentAnime.skor,
    };

    this.animeList[index] = updatedAnime;
    return updatedAnime;
  }

  // DELETE: Menghapus anime berdasarkan ID
  remove(id: number): { message: string; deletedId: number } {
    const index = this.animeList.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(
        `Gagal menghapus: Anime dengan ID ${id} tidak ditemukan.`,
      );
    }

    const deletedAnime = this.animeList.splice(index, 1)[0];
    return {
      message: `Anime "${deletedAnime.judul}" (ID: ${id}) berhasil dihapus.`,
      deletedId: id,
    };
  }

  // RESET: Pulihkan data sampel awal (opsional pembantu frontend)
  reset(): Anime[] {
    this.animeList = [
      {
        id: 1,
        judul: 'One Piece',
        tipe: 'TV',
        episode: '1000+',
        status: 'Sedang Tayang (Ongoing)',
        studio: 'Toei Animation',
        genre: 'Action, Adventure, Fantasy',
        skor: 8.92,
        sinopsis:
          'Gol D. Roger dikenal sebagai "Raja Bajak Laut", bajak laut terkuat dan paling terkenal yang pernah berlayar di Grand Line. Monkey D. Luffy, seorang bocah 17 tahun, bertekad untuk menemukan harta karun tersebut dan menjadi Raja Bajak Laut berikutnya.',
        gambar: '/OnePiece.webp',
      },
      {
        id: 2,
        judul: 'Attack on Titan',
        tipe: 'TV',
        episode: '25 (Season 1)',
        status: 'Selesai Tayang (Finished Airing)',
        studio: 'Wit Studio',
        genre: 'Action, Dark Fantasy, Drama',
        skor: 8.54,
        sinopsis:
          'Berabad-abad yang lalu, umat manusia dibantai hingga hampir punah oleh makhluk mengerikan yang disebut Titan, memaksa manusia untuk bersembunyi di balik tembok raksasa. Eren Yeager bersumpah untuk menghabisi setiap Titan demi membalas dendam ibunya.',
        gambar: '/attackontitan.webp',
      },
      {
        id: 3,
        judul: 'Jujutsu Kaisen',
        tipe: 'TV',
        episode: '24',
        status: 'Selesai Tayang (Finished Airing)',
        studio: 'MAPPA',
        genre: 'Action, Dark Fantasy, Supernatural',
        skor: 8.61,
        sinopsis:
          'Yuji Itadori menelan benda terkutuk yang sangat kuat (jari Ryomen Sukuna) untuk menyelamatkan teman-temannya. Ia kemudian bergabung dengan organisasi rahasia Penyihir Jujutsu untuk membasmi kutukan.',
        gambar: '/jujutsukaisen.webp',
      },
      {
        id: 4,
        judul: 'Naruto',
        tipe: 'TV',
        episode: '220',
        status: 'Selesai Tayang (Finished Airing)',
        studio: 'Pierrot',
        genre: 'Action, Adventure, Fantasy',
        skor: 8.0,
        sinopsis:
          'Naruto Uzumaki, seorang ninja yang hiperaktif dan tidak bisa ditebak, terus-menerus mencari pengakuan dan bermimpi menjadi Hokage, pemimpin desa yang diakui sebagai ninja terkuat.',
        gambar: '/Naruto.webp',
      },
    ];
    return this.animeList;
  }
}
