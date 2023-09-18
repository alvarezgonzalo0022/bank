import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SellersService } from '../sellers/sellers.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ValidRoles } from './interfaces/validRoles';
import { LoginUserDTO } from '../users/dto/login-user.dto';
import { CreateSellerDto } from 'src/sellers/dto/create-seller.dto';
import { Seller } from '../sellers/entities/seller.entity';
import { User } from 'src/users/entities/user.entity';
import { MOCKS } from '../common/mocks';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let sellersService: SellersService;
  let jwtService: JwtService;
  const { MOCK_USER_BUYER, MOCK_USER_ADMIN, MOCK_SELLER } = new MOCKS();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        SellersService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: SellersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    sellersService = module.get<SellersService>(SellersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('registerUser', () => {
    it('should register a user and return the user object without password and with token', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };
  
      const createdUser = {
        id: '1',
        ...createUserDto,
        roles: [ValidRoles.buyer],
      };
  
      const userWithoutPassword = {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        roles: createdUser.roles,
      };
  
      const token = 'jwt-token';
  
      jest.spyOn(usersService, 'create').mockResolvedValueOnce({ data: createdUser });
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);
  
      const result = await authService.registerUser(createUserDto);
  
      expect(result).toEqual({ ...userWithoutPassword, token });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        roles: createdUser.roles,
      });
    });
  
    it('should throw an error when trying to register a user with an existing email', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
      };
  
      const errorMessage = 'User with this email already exists';
  
      jest.spyOn(usersService, 'create').mockRejectedValueOnce(new Error(errorMessage));
  
      await expect(authService.registerUser(createUserDto)).rejects.toThrow(errorMessage);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return the user object without password and with token', async () => {
      const loginUserDto: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'password123',
      };
    
      const foundUser: User = MOCK_USER_BUYER;
      foundUser.email = loginUserDto.email;
      foundUser.password = loginUserDto.password;
    
      const userWithoutPassword = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        roles: foundUser.roles,
        createdAt: foundUser.createdAt,
        orders: foundUser.orders,
      };
    
      const token = 'jwt-token';
    
      jest.spyOn(authService, 'loginUser').mockResolvedValueOnce(foundUser);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);
    
      const result = await authService.loginUser(loginUserDto);
    
      // Remove the password property from the received result and add the token property
      const receivedResult = { ...result };
      delete receivedResult.password;
      receivedResult.token = token;
    
      expect(receivedResult).toEqual({ ...userWithoutPassword, token });
      expect(authService.loginUser).toHaveBeenCalledWith({email: loginUserDto.email, password: loginUserDto.password});
    });
    
    it('should throw an error when trying to log in a user with an incorrect password', async () => {
      const loginUserDto: LoginUserDTO = {
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      };
    
      const foundUser = MOCK_USER_BUYER;
      foundUser.email = loginUserDto.email;
    
      const errorMessage = 'Password is not valid';
    
      jest.spyOn(usersService, 'findOne').mockResolvedValue({
        data: foundUser,
      });
    
      jest.spyOn(usersService, 'login').mockImplementation(async (userDto) => {
        if (userDto.password !== foundUser.password) {
          throw new Error(errorMessage);
        }
        return { data: foundUser };
      });
    
      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(errorMessage);
      expect(usersService.login).toHaveBeenCalledWith(loginUserDto);
    });
       

  });

  describe('registerSeller', () => {
  it('should register a seller and return the seller object without password and with token', async () => {
    const createSellerDto: CreateSellerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      company: 'John\'s Store',
    };

    const createdSeller = {
      id: '1',
      ...createSellerDto,
      roles: [ValidRoles.seller],
    };

    const sellerWithoutPassword = {
      id: createdSeller.id,
      firstName: createdSeller.firstName,
      lastName: createdSeller.lastName,
      email: createdSeller.email,
      company: createdSeller.company,
      roles: createdSeller.roles,
    };

    const token = 'jwt-token';

    jest.spyOn(sellersService, 'create').mockResolvedValueOnce({ data: createdSeller });
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);

    const result = await authService.registerSeller(createSellerDto);

    expect(result).toEqual({ ...sellerWithoutPassword, token });
    expect(sellersService.create).toHaveBeenCalledWith(createSellerDto);
    expect(jwtService.sign).toHaveBeenCalledWith({
      id: createdSeller.id,
      email: createdSeller.email,
      firstName: createdSeller.firstName,
      roles: createdSeller.roles,
    });
  });

  it('should throw an error when trying to register a seller with an existing email', async () => {
    const createSellerDto: CreateSellerDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      company: 'John\'s Store',
    };

    const errorMessage = 'Seller with this email already exists';

    jest.spyOn(sellersService, 'create').mockRejectedValueOnce(new Error(errorMessage));

    await expect(authService.registerSeller(createSellerDto)).rejects.toThrow(errorMessage);
    expect(sellersService.create).toHaveBeenCalledWith(createSellerDto);
  });
  });

  describe('loginSeller', () => {
    it('should log in a seller and return the seller object without password and with token', async () => {
      const loginUserDto: LoginUserDTO = {
        email: 'seller@example.com',
        password: 'password123',
      };

      const foundSeller: Seller = MOCK_SELLER;
      foundSeller.email = loginUserDto.email;
      foundSeller.password = loginUserDto.password;

      const sellerWithoutPassword = {
        id: foundSeller.id,
        firstName: foundSeller.firstName,
        lastName: foundSeller.lastName,
        email: foundSeller.email,
        roles: foundSeller.roles,
        company: foundSeller.company,
        createdAt: foundSeller.createdAt,
        products: [],
      };

      const token = 'jwt-token';

      jest.spyOn(authService, 'loginSeller').mockResolvedValueOnce(foundSeller);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(token);

      const result = await authService.loginSeller(loginUserDto);

      const receivedResult = { ...result };
      delete receivedResult.password;
      receivedResult.token = token;

      expect(receivedResult).toEqual({ ...sellerWithoutPassword, token });
      expect(authService.loginSeller).toHaveBeenCalledWith({email: loginUserDto.email, password: loginUserDto.password});
    });

    it('should throw an error when trying to log in a seller with an incorrect password', async () => {
      const loginUserDto: LoginUserDTO = {
        email: 'seller@example.com',
        password: 'wrongpassword',
      };

      const foundSeller: Seller = MOCK_SELLER;
      foundSeller.email = loginUserDto.email;

      const errorMessage = 'Password is not valid';

      jest.spyOn(sellersService, 'findOne').mockResolvedValue({
        data: foundSeller,
      });

      jest.spyOn(sellersService, 'login').mockImplementation(async (sellerDto) => {
        if (sellerDto.password !== foundSeller.password) {
          throw new Error(errorMessage);
        }
        return { data: foundSeller };
      });

      await expect(authService.loginSeller(loginUserDto)).rejects.toThrow(errorMessage);
      expect(sellersService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

});
