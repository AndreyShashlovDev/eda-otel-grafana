import { Injectable } from '@nestjs/common'
import { context, Span, SpanStatusCode, trace, Tracer } from '@opentelemetry/api'

@Injectable()
export class TracingService {

  private readonly tracer: Tracer

  constructor(serviceName: string = 'unknown-service') {
    this.tracer = trace.getTracer(serviceName)
  }

  getCurrentSpan(): Span {
    const activeContext = context.active()
    return trace.getSpan(activeContext)
  }

  async trace<T>(
    spanName: string,
    attributes: Record<string, any>,
    fn: (span: Span) => Promise<T>,
    parentSpan?: Span
  ): Promise<T> {
    const activeCtx = parentSpan
      ? trace.setSpan(context.active(), parentSpan)
      : context.active()

    const span = this.tracer.startSpan(spanName, {}, activeCtx)

    for (const [key, value] of Object.entries(attributes)) {
      span.setAttribute(key, value)
    }

    const ctx = trace.setSpan(context.active(), span)

    try {
      const result = await context.with(ctx, () => fn(span))

      span.setStatus({code: SpanStatusCode.OK})

      return result

    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      })
      span.recordException(error)

      throw error
    } finally {
      span.end()
    }
  }
}
