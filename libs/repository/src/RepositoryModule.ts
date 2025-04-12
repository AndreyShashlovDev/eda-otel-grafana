import { DatabaseModule } from '@app/database/DatabaseModule'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [],
  exports: [],
})
export class RepositoryModule {}
