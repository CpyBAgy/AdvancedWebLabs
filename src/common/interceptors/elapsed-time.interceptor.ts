import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = process.hrtime();
    const ctxType = context.getType<'http' | 'graphql'>();

    return next.handle().pipe(
      map((data) => {
        if (ctxType === 'http' && data && typeof data === 'object') {
          const [sec, nano] = process.hrtime(start);
          const elapsedMs = Math.round(sec * 1e3 + nano / 1e6);
          return {
            ...data,
            elapsedTime: elapsedMs,
          };
        }
        return data;
      }),
      tap({
        next: () => {
          const [sec, nano] = process.hrtime(start);
          const elapsedMs = Math.round(sec * 1e3 + nano / 1e6);
          console.log(`Request took ${elapsedMs}ms`);

          if (ctxType === 'http') {
            const ctx = context.switchToHttp();
            const response = ctx.getResponse<Response>();
            response.setHeader('X-Elapsed-Time', `${elapsedMs}ms`);
          } else if (ctxType === 'graphql') {
            const gqlCtx = GqlExecutionContext.create(context);
            const { res } = gqlCtx.getContext<{
              req: Request;
              res: Response;
            }>();
            res.setHeader('X-Elapsed-Time', `${elapsedMs}ms`);
          }
        },
      }),
    );
  }
}
