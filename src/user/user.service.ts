import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyMeService } from 'src/verify-me-service/verify-me-service.service';

@Injectable()
export class UserService {
  constructor(
    private readonly verifyMeService: VerifyMeService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // Register new user and validate KYC
  async signup(createUserDto: CreateUserDto) {
    try {
      // Step 1: Check if the user already exists by Ethereum address or email
      const existingUser = await this.userRepository.findOne({
        where: [{ ethereumAddress: createUserDto.ethereumAddress }, { email: createUserDto.email }],
      });

      if (existingUser) {
        return {
          statusCode: "01",
          message: "User already exists",
          data: existingUser,
        };
      }

      let kycValidation: any;

      // Step 2: Choose a verification method (TIN, BVN, NIN)
      if (createUserDto.tin) {
        kycValidation = await this.verifyMeService.TINVerification(createUserDto.tin);
      } else if (createUserDto.bvn) {
        kycValidation = await this.verifyMeService.BVNVerification(createUserDto.bvn);
      } else if (createUserDto.nin) {
        kycValidation = await this.verifyMeService.NINVerification(createUserDto.nin, {
          lastname: createUserDto.lastName,
        });
      }

      // Step 3: Check if KYC validation is successful, or handle specific error codes
      if (kycValidation) {
        // Map error messages to fields
        const verificationErrors = {
          'NIN not found. Provide a valid NIN': 'NIN',
          'TIN not found. Provide a valid TIN': 'TIN',
          'BVN not found. Provide a valid BVN': 'BVN',
        };

        // If the error message matches a known verification error, return a specific message
        const errorMessage = verificationErrors[kycValidation.message];
        if (errorMessage) {
          return {
            statusCode: '02',
            message: `${errorMessage} not found. Please provide a valid ${errorMessage}.`,
          };
        }

        // If KYC is valid, save the user data
        if (kycValidation.success) {
          const user = {
            ethereumAddress: createUserDto.ethereumAddress,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            phoneNumber: createUserDto.phoneNumber,
            kycStatus: 'verified',
            kycDetails: kycValidation.details,  // Store KYC validation details
          };

          // Save user to the database
          await this.userRepository.save(user);

          return {
            statusCode: "00",
            message: "Sign-up successful",
            data: createUserDto,
          };
        } else {
          return {
            statusCode: '02',
            message: 'KYC validation failed.',
          };
        }
      } else {
        return {
          statusCode: '02',
          message: 'Error during KYC verification.',
        };
      }
    } catch (error) {
      console.log("Error occurred while signing up user: ", error);
      throw error;
    }
  }




}
