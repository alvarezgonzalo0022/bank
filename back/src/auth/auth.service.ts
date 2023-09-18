import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDTO } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SellersService } from '../sellers/sellers.service';
import { CreateSellerDto } from '../sellers/dto/create-seller.dto';


@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly sellersService: SellersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDTO: CreateUserDto) {
    const responseDto = await this.usersService.create(createUserDTO);
    const { password, ...rest } = responseDto.data;


    return {
      ...rest,
      token: this.getJWTToken({
        id: rest.id,
        email: rest.email,
        firstName: rest.firstName,
        roles: rest.roles,
      }),
    }
  }

  async loginUser(loginUserDTO: LoginUserDTO) {
    const loginUser = await this.usersService.login(loginUserDTO);
    const { password, ...rest } = loginUser.data;

    return {
      ...rest,
      token: this.getJWTToken({
        id: rest.id,
        email: rest.email,
        firstName: rest.firstName,
        roles: rest.roles,
      }),
    }
  }

  async registerSeller(createSellerDto: CreateSellerDto) {
      const responseDto = await this.sellersService.create(createSellerDto);
      const { password, ...rest } = responseDto.data;

      return {
        ...rest,
        token: this.getJWTToken({
          id: rest.id,
          email: rest.email,
          firstName: rest.firstName,
          roles: rest.roles,
        }),
      }
  }

  async loginSeller(loginUserDTO: LoginUserDTO) {
    const loginSeller = await this.sellersService.login(loginUserDTO);
    const { password, ...rest } = loginSeller.data;
    return {
      ...rest,
      token: this.getJWTToken({
        id: rest.id,
        email: rest.email,
        firstName: rest.firstName,
        roles: rest.roles,
      }),
    }
  }

  private getJWTToken(payload: JWTPayload) {

    const token = this.jwtService.sign(payload);
    return token;

  }

}
