import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly secret = process.env.SECRET_KEY;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.secret) {
      throw new Error('Секретный ключ не установлен в переменной окружения');
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.access;

    if (!token) {
      throw new UnauthorizedException('Токен отсутствует');
    }

    try {
      const payload = jwt.verify(token, this.secret);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Неверный токен или ключ');
    }

    return true;
  }
}
