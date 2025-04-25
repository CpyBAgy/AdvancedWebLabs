import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType<'http'>();
    if (ctxType !== 'http') {
      return next.handle();
    }
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    return next.handle().pipe(
      mergeMap((body) => {
        const hash = crypto
          .createHash('md5')
          .update(JSON.stringify(body))
          .digest('hex');
        const etag = `"${hash}"`;
        if (req.headers['if-none-match'] === etag) {
          res.status(HttpStatus.NOT_MODIFIED).end();
          return new Observable();
        }
        res.setHeader('ETag', etag);
        return new Observable((obs) => {
          obs.next(body);
          obs.complete();
        });
      }),
      tap(() => {}),
    );
  }
}
