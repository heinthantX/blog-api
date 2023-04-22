import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.gurad';
import { RolesGuard } from './guards/roles.gurad';
import { JwtStrategy } from './stratagies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {},
      }),
    }),
  ],
  providers: [AuthService, JwtAuthGuard, JwtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
