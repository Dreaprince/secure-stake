import { IsNotEmpty, IsEmail, IsPhoneNumber, Length, IsString, IsOptional, IsEthereumAddress, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'firstName' })
  @IsNotEmpty({ message: 'firstName is required.' })
  @IsString({ message: 'firstName must be a string.' })
  firstName: string;

  @ApiProperty({ description: 'lastName' })
  @IsNotEmpty({ message: 'lastName is required.' })
  @IsString({ message: 'lastName must be a string.' })
  lastName: string;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'phoneNumber' })
  @IsPhoneNumber('NG', { message: 'Invalid phone number format' })
  phoneNumber: string;

  @ApiProperty({ description: 'ethereumAddress' })
  @IsNotEmpty({ message: 'ethereumAddress is required.' })
  @IsEthereumAddress({ message: 'Invalid Ethereum address format' })  
  ethereumAddress: string;  // New field for Ethereum address

   @ApiProperty({ description: 'tin', example: '1234-5678' })
  @IsOptional()
  @Matches(/^\d{4}-\d{4}$/, { message: 'TIN must be in the format XXXX-XXXX' })
  tin?: string;

  @ApiProperty({ description: 'nin' })
  @IsOptional()
  @Length(11, 11, { message: 'NIN must be 11 digits.' })
  nin?: string;

  @ApiProperty({ description: 'bvn' })
  @IsOptional()
  @Length(11, 11, { message: 'BVN must be 11 digits.' })
  bvn?: string;

  @ApiProperty({ description: 'city' })
  @IsNotEmpty({ message: 'city is required.' })
  @IsString({ message: 'city must be a string.' })
  city: string;

  @ApiProperty({ description: 'addr1' })
  @IsNotEmpty({ message: 'addr1 is required.' })
  @IsString({ message: 'addr1 must be a string.' })
  addr1: string;

  @ApiProperty({ description: 'lga' })
  @IsNotEmpty({ message: 'lga is required.' })
  @IsString({ message: 'lga must be a string.' })
  lga: string;

  @ApiProperty({ description: 'state' })
  @IsNotEmpty({ message: 'state is required.' })
  @IsString({ message: 'state must be a string.' })
  state: string;
}
