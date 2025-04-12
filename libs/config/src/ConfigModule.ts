import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import * as path from 'path'

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [
        path.resolve(process.cwd(), 'config', `${process.env.NODE_ENV || 'development'}.env`),
      ],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
