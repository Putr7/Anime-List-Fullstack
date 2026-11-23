import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsIn,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnimeDto {
  @IsNotEmpty({ message: 'Judul anime wajib diisi' })
  @IsString({ message: 'Judul harus berupa teks' })
  @MinLength(2, { message: 'Judul minimal memiliki 2 karakter' })
  judul: string;

  @IsOptional()
  @IsIn(['TV', 'Movie', 'OVA', 'ONA'], {
    message: 'Tipe harus salah satu dari: TV, Movie, OVA, ONA',
  })
  tipe?: 'TV' | 'Movie' | 'OVA' | 'ONA';

  @IsOptional()
  @IsString({ message: 'Episode harus berupa teks' })
  episode?: string;

  @IsOptional()
  @IsString({ message: 'Status harus berupa teks' })
  status?: string;

  @IsOptional()
  @IsString({ message: 'Studio harus berupa teks' })
  studio?: string;

  @IsOptional()
  @IsString({ message: 'Genre harus berupa teks' })
  genre?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Skor harus berupa angka' })
  @Min(0, { message: 'Skor minimal adalah 0' })
  @Max(10, { message: 'Skor maksimal adalah 10' })
  skor?: number;

  @IsOptional()
  @IsString({ message: 'Sinopsis harus berupa teks' })
  sinopsis?: string;

  @IsOptional()
  @IsString({ message: 'Gambar poster harus berupa URL/path gambar' })
  gambar?: string;
}
