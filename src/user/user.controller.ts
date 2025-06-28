import { Controller,  Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      return this.userService.signup(createUserDto);
    } catch (error) {
      throw error;
    }
  }
}

