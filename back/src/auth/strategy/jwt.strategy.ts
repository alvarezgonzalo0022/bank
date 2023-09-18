// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-jwt";
// import { User } from "../../users/entities/user.entity";
// import { JWTPayload } from "../interfaces/jwt-payload.interface";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { ExtractJwt } from "passport-jwt";
// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { Seller } from "../../sellers/entities/seller.entity";

// @Injectable()
// export class JWTStrategy extends PassportStrategy(Strategy) {
//     constructor(
//     ) {
//         super({
//             secretOrKey: process.env.JWT_SECRET,
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() 
//         })
//     }

//     async validate(payload: JWTPayload): Promise<User | Seller> {
    
//     }
// }
