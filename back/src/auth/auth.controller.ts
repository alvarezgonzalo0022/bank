import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
} from "@nestjs/common";
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDTO } from '../users/dto/login-user.dto';
import { RequestFilter } from '../common/filters/request.filter';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ValidRoles } from './interfaces/validRoles';
import { Seller } from '../sellers/entities/seller.entity';
import { CreateSellerDto } from "../sellers/dto/create-seller.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiHeader, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Auth")
@UseFilters(new RequestFilter())
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("user/me")
  @Auth(ValidRoles.buyer)
    @ApiResponse({status: 200, description: 'Objeto, data de Usuario logueado', type: User})
    @ApiResponse({status: 401, description: 'Unauthorized' })
  getMe(@GetUser() user: User) {
    const { password, ...rest } = user;
    return rest;
  }

  @Post("user/register")  
    @ApiCreatedResponse({description: 'Objeto, data de Usuario + token', type: User, status: 201 })
    @ApiResponse({status: 400, description: 'Bad Request + mensaje de error'})
  registerUser(@Body() createUserDTO: CreateUserDto) {
    return this.authService.registerUser(createUserDTO);
  }


  @Post("user/login")
    @ApiResponse({status: 201, description: 'Usuario logueado correctamente + token'})
    @ApiResponse({status: 400, description: 'Bad Request + mensaje de error'})
  loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.loginUser(loginUserDTO);
  }

  @Get("seller/me")
  @Auth(ValidRoles.seller)
    @ApiResponse({status: 200, description: 'Objeto, data de Seller', type: Seller})
    @ApiResponse({status: 401, description: 'Unauthorized' })
    @ApiResponse({status: 403, description: 'Forbidden' })
  getMeSeller(@GetUser() seller: Seller) {
    const { password, ...rest } = seller;
    return rest;
  }

  @Post("seller/login")
    @ApiResponse({status: 201, description: 'Seller logueado correctamente + token'})
    @ApiResponse({status: 400, description: 'Bad Request + mensaje de error'})
  loginSeller(@Body() loginUserDTO: LoginUserDTO) {
    return this.authService.loginSeller(loginUserDTO);
  }

  @Post("seller/register")
    @ApiCreatedResponse({description: 'Objeto, data de Seller + token', type: Seller, status: 201})
    @ApiResponse({status: 400, description: 'Bad Request + mensaje de error'})
  registerSeller(@Body() createSellerDto: CreateSellerDto) {
    return this.authService.registerSeller(createSellerDto);
  }
}
