process.env.SERVICE_NAME = 'api-gateway'

import { startTracing } from '@app/telemetry/tracing/tracing'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './AppModule'

startTracing()

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.enableCors()

  const configService = app.get(ConfigService)
  const port = configService.get<number>('API_PORT', 3000)
  const host = configService.get<string>('API_HOST', 'localhost')

  await app.listen(port, host)

  logger.log(`API Gateway is running on: http://${host}:${port}`)
  logger.log(`Metrics available at: http://${host}:${port}/metrics`)
  logger.log(`Health check available at: http://${host}:${port}/metrics/health`)
}

bootstrap()
