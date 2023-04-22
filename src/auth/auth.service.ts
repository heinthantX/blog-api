import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { from, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(payload): Observable<string> {
    return from(this.jwtService.signAsync(payload));
  }

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  comparePasswords(
    password: string,
    storedHashPassword: string,
  ): Observable<boolean> {
    return from(bcrypt.compare(password, storedHashPassword));
  }
}
