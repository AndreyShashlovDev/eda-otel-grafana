import 'reflect-metadata'

export const TRACK_PARAM_METADATA = 'track:param:metadata'

export interface ParamExtractor {
  extract(value: any): Record<string, any>;
}

export class AllFieldsExtractor implements ParamExtractor {

  constructor(private readonly prefix: string = '') {}

  extract(value: any): Record<string, any> {
    if (value === null || value === undefined) {
      return {}
    }

    if (typeof value !== 'object') {
      return {[this.prefix || 'value']: value}
    }

    const result: Record<string, any> = {}

    for (const [key, val] of Object.entries(value)) {

      if (val === null || val === undefined) {
        continue
      }

      const attributeName = this.prefix ? `${this.prefix}.${key}` : key

      if (typeof val !== 'object') {
        result[attributeName] = val

      } else if (Array.isArray(val)) {
        result[attributeName + '.length'] = val.length
        if (val.length > 0 && typeof val[0] !== 'object') {
          result[attributeName + '.sample'] = val[0]
        }
      } else {
        result[attributeName + '.type'] = val.constructor?.name || 'Object'
      }
    }

    return result
  }
}

export class SelectedFieldsExtractor implements ParamExtractor {

  constructor(
    private readonly fields: string[],
    private readonly prefix: string = ''
  ) {}

  extract(value: any): Record<string, any> {
    if (!value || typeof value !== 'object') {
      return {}
    }

    const result: Record<string, unknown> = {}

    for (const field of this.fields) {

      if (value[field] === null || value[field] === undefined) {
        continue
      }

      const attributeName = this.prefix ? `${this.prefix}.${field}` : field

      if (typeof value[field] !== 'object') {
        result[attributeName] = value[field]

      } else if (Array.isArray(value[field])) {
        result[attributeName + '.length'] = value[field].length
      }
    }

    return result
  }
}

export class CustomExtractor implements ParamExtractor {

  constructor(private readonly extractorFn: (value: any) => Record<string, any>) {}

  extract(value: any): Record<string, any> {
    return this.extractorFn(value)
  }
}

export function TrackParam(extractor: ParamExtractor = new AllFieldsExtractor()): ParameterDecorator {

  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const existingMetadata = Reflect.getMetadata(TRACK_PARAM_METADATA, target, propertyKey) || {}

    existingMetadata[parameterIndex] = extractor

    Reflect.defineMetadata(TRACK_PARAM_METADATA, existingMetadata, target, propertyKey)
  }
}

export function TrackAll(prefix: string = ''): ParameterDecorator {
  return TrackParam(new AllFieldsExtractor(prefix))
}

export function TrackFields(fields: string[], prefix: string = ''): ParameterDecorator {
  return TrackParam(new SelectedFieldsExtractor(fields, prefix))
}

export function TrackCustom(extractorFn: (value: any) => Record<string, any>): ParameterDecorator {
  return TrackParam(new CustomExtractor(extractorFn))
}
