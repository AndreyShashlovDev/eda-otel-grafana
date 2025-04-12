import { TracingService } from '@app/telemetry/TracingService'
import { DynamicModule, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { setModuleRef } from '../ModuleRef'

@Module({})
export class TracingModule {

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    setModuleRef(this.moduleRef)
  }

  static forRoot(serviceName: string): DynamicModule {
    return {
      module: TracingModule,
      providers: [
        {
          provide: TracingService,
          useFactory: () => new TracingService(serviceName)
        }
      ],
      exports: [TracingService],
      global: true
    }
  }
}
