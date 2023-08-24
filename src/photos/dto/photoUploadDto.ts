import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class PhotoUploadDto {
  @IsNotEmpty()
  @IsString()
  fieldname: string;

  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  encoding: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsNotEmpty()
  @IsString()
  path: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5000000)
  size: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
