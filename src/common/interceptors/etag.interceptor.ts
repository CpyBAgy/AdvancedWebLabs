/*import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const payload = JSON.stringify(data);
        const etag = crypto.createHash('md5').update(payload).digest('hex');

        response.setHeader('Cache-Control', 'public, max-age=60'); // можно поменять TTL
        response.setHeader('ETag', etag);

        if (request.headers['if-none-match'] === etag) {
          response.status(304).end();
          return;
        }

        return data;
      }),
    );
  }
}*/
