import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/create-user.dto';
import { LoginUserDto } from './models/login-user.dto';
import { UpdateUserDto } from './models/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user: CreateUserDto): Observable<User | any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashPassword: string) => {
        const temp = new User();
        temp.email = user.email.trim().toLowerCase();
        temp.name = user.name;
        temp.username = user.username;
        temp.password = hashPassword;

        return from(this.userRepository.save(temp)).pipe(
          map((user) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => {
            throw Error(err);
          }),
        );
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users): User[] => {
        users.forEach((v) => delete v.password);
        return users;
      }),
    );
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: Partial<CreateUserDto>): Observable<any> {
    return from(this.userRepository.update(id, updateUserDto));
  }

  delete(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  login(loginData: LoginUserDto): Observable<string> {
    return this.validateUser(loginData.email, loginData.password).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJWT({ id: user.id })
            .pipe(map((jwt: string) => jwt));
        } else {
          return 'Wrong Credentials';
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User | any> {
    return from(
      this.userRepository.findOneBy({ email: email.toLowerCase() }),
    ).pipe(
      switchMap((user: User) => {
        return this.authService.comparePasswords(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...result } = user;
              return result;
            } else {
              throw Error;
            }
          }),
        );
      }),
    );
  }
}
