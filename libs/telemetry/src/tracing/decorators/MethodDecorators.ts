import 'reflect-metadata'
import { ParamExtractor, TRACK_PARAM_METADATA } from '@app/telemetry/tracing/decorators/ParamDecorators'
import { TracingService } from '@app/telemetry/tracing/TracingService'
import { getModuleRef } from '../ModuleRef'

export function Track(spanName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const moduleRef = getModuleRef()

      if (!moduleRef) {
        console.warn(`ModuleRef not set. Make sure to call setModuleRef() in your app module.`)
        return originalMethod.apply(this, args)
      }

      const tracingService = moduleRef.get(TracingService, {strict: false})
      if (!tracingService) {
        console.warn(`TracingService not found. Make sure it is provided globally.`)
        return originalMethod.apply(this, args)
      }

      const actualSpanName = spanName || propertyKey

      const paramMetadata = Reflect.getMetadata(TRACK_PARAM_METADATA, target, propertyKey) || {}

      const attributes: Record<string, any> = {}
      for (const [indexStr, extractor] of Object.entries(paramMetadata)) {
        const index = parseInt(indexStr, 10)
        if (index >= 0 && index < args.length) {
          const paramValue = args[index]
          const paramAttributes = (extractor as ParamExtractor).extract(paramValue)
          Object.assign(attributes, paramAttributes)
        }
      }

      attributes['method.name'] = propertyKey
      attributes['method.args.count'] = args.length

      return tracingService.trace(
        actualSpanName,
        attributes,
        async () => originalMethod.apply(this, args)
      )
    }

    return descriptor
  }
}
