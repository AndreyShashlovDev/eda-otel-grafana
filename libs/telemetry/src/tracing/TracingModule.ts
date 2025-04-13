import { TracingService } from '@app/telemetry/tracing/TracingService'
import { DynamicModule, Global, Module, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { setModuleRef } from './ModuleRef'

@Global()
@Module({})
export class TracingModule implements OnModuleInit {

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
