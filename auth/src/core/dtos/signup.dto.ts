import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No email provider' })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No password provider' })
  public password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No firstname provider' })
  public firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'No lastname provider' })
  public lastname: string;
}
