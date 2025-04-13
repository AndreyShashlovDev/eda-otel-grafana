import { ModuleRef } from '@nestjs/core'

let moduleRefInstance: ModuleRef

export function setModuleRef(moduleRef: ModuleRef) {
  moduleRefInstance = moduleRef
}

export function getModuleRef(): ModuleRef {
  return moduleRefInstance
}
