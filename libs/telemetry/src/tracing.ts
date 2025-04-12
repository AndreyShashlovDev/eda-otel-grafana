import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import * as process from 'process'

const serviceName = process.env.SERVICE_NAME || 'unknown-service'

// const consoleExporter = new ConsoleSpanExporter()

const zipkinExporter = new ZipkinExporter({
  url: 'http://localhost:9411/api/v2/spans',
  serviceName: 'api-gateway'
})

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
    'service.version': process.env.npm_package_version || '1.0.0',
    'deployment.environment': process.env.NODE_ENV || 'development',
  }),
  spanProcessors: [
    // new SimpleSpanProcessor(consoleExporter),
    new SimpleSpanProcessor(zipkinExporter)
  ],
  instrumentations: [getNodeAutoInstrumentations()]
})

export function startTracing(): void {
  try {
    sdk.start()
    console.log('Tracing initialized')
  } catch (error) {
    console.error('Error initializing tracing', error)
  }

  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.error('Error terminating tracing', error))
      .finally(() => process.exit(0))
  })
}
