process.env.SERVICE_NAME = 'order-service'
import { startTracing } from '@app/telemetry/tracing'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './AppModule'

startTracing()

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: configService.get('KAFKA_CLIENT_ID'),
        brokers: configService.get<string>('KAFKA_BROKERS').split(','),
        retry: {
          initialRetryTime: 300,
          retries: 10,
        },
      },
      consumer: {
        groupId: configService.get('KAFKA_GROUP_ID'),
        allowAutoTopicCreation: true,
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
      },
    },
  })

  const httpPort = configService.get<number>('METRICS_PORT', 3010)

  await app.listen(httpPort)

  logger.log(`Metrics HTTP server running on port ${httpPort}`)

  await app.startAllMicroservices()
  logger.log(`Order microservice is running and listening to Kafka on ${configService.get('KAFKA_BROKERS')}`)
  logger.log(`Metrics available at: http://localhost:${httpPort}/metrics`)
  logger.log(`Health check available at: http://localhost:${httpPort}/metrics/health`)
}

bootstrap()
