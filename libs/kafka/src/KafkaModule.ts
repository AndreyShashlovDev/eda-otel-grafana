import { ConfigModule } from '@app/config/ConfigModule'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
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
          }
        ),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
