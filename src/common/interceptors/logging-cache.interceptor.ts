import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingCacheInterceptor extends CacheInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const superObs = await super.intercept(context, next);
    return superObs.pipe(
      tap(() => {
        console.log(`[Cache] served key=${key}`);
      }),
    );
  }
}
