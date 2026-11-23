import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AnimeController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. GET /anime - Mengambil seluruh data anime', async () => {
    const res = await request(app.getHttpServer()).get('/anime').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
  });

  it('2. GET /anime/1 - Mengambil detail anime dengan ID 1', async () => {
    const res = await request(app.getHttpServer()).get('/anime/1').expect(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('judul', 'One Piece');
  });

  it('3. GET /anime/999 - Skenario NotFoundException', async () => {
    const res = await request(app.getHttpServer()).get('/anime/999').expect(404);
    expect(res.body.message).toContain('tidak ditemukan');
  });

  it('4. POST /anime - Berhasil menambah anime baru', async () => {
    const newAnime = {
      judul: 'Bleach: Thousand-Year Blood War',
      tipe: 'TV',
      episode: '13',
      status: 'Selesai Tayang (Finished Airing)',
      studio: 'Pierrot',
      genre: 'Action, Supernatural',
      skor: 9.05,
      sinopsis: 'Konflik perang berdarah ribuan tahun antara Shinigami dan Quincy.',
      gambar: '/OnePiece.webp',
    };

    const res = await request(app.getHttpServer())
      .post('/anime')
      .send(newAnime)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.judul).toBe(newAnime.judul);
    expect(res.body.skor).toBe(9.05);
  });

  it('5. POST /anime - Skenario ConflictException (Judul Duplikat)', async () => {
    const duplicateAnime = {
      judul: 'One Piece',
      tipe: 'TV',
      episode: '1000+',
      skor: 8.92,
    };

    const res = await request(app.getHttpServer())
      .post('/anime')
      .send(duplicateAnime)
      .expect(409);

    expect(res.body.message).toContain('sudah terdaftar');
  });

  it('6. POST /anime - Skenario Validasi DTO Gagal (ValidationPipe)', async () => {
    const invalidAnime = {
      judul: '',
      tipe: 'INVALID_TYPE',
      skor: 20,
    };

    const res = await request(app.getHttpServer())
      .post('/anime')
      .send(invalidAnime)
      .expect(400);

    expect(Array.isArray(res.body.message)).toBe(true);
  });

  it('7. PATCH /anime/1 - Berhasil memperbarui data anime', async () => {
    const updatePayload = {
      episode: '1120+',
      skor: 9.2,
    };

    const res = await request(app.getHttpServer())
      .patch('/anime/1')
      .send(updatePayload)
      .expect(200);

    expect(res.body.episode).toBe('1120+');
    expect(res.body.skor).toBe(9.2);
  });

  it('8. PATCH /anime/999 - Skenario NotFoundException saat update', async () => {
    const res = await request(app.getHttpServer())
      .patch('/anime/999')
      .send({ episode: '99' })
      .expect(404);

    expect(res.body.message).toContain('tidak ditemukan');
  });

  it('9. DELETE /anime/4 - Berhasil menghapus anime', async () => {
    const res = await request(app.getHttpServer()).delete('/anime/4').expect(200);
    expect(res.body).toHaveProperty('deletedId', 4);
  });

  it('10. DELETE /anime/999 - Skenario NotFoundException saat delete', async () => {
    const res = await request(app.getHttpServer()).delete('/anime/999').expect(404);
    expect(res.body.message).toContain('tidak ditemukan');
  });
});
