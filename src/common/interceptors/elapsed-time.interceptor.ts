/*import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ElapsedTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const isGraphQL =
      context.getType<'graphql' | 'http' | 'ws'>() === 'graphql';
    const isHttp = context.getType<'graphql' | 'http' | 'ws'>() === 'http';

    if (isGraphQL) {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      gqlCtx.startTime = now;

      return next.handle().pipe(
        tap(() => {
          const elapsedTime = Date.now() - now;
          console.log(`⏱ GraphQL запрос выполнен за ${elapsedTime}мс`);
          gqlCtx.res?.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
        }),
      );
    }

    if (isHttp) {
      const ctx = context.switchToHttp();
      const res = ctx.getResponse();
      const req = ctx.getRequest();

      return next.handle().pipe(
        tap((data) => {
          const elapsedTime = Date.now() - now;
          res.setHeader('X-Elapsed-Time', `${elapsedTime}ms`);
          res.locals.elapsedTime = `${elapsedTime}мс`;

          console.log(
            `HTTP [${req.method} ${req.url}] выполнен за ${elapsedTime}мс`,
          );
        }),
      );
    }

    return next.handle();
  }
}*/
