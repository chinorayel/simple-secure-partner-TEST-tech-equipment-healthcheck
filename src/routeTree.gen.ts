/* eslint-disable */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as TechnologySolutionsRouteImport } from './routes/technology-solutions'
import { Route as AdminLoginRouteImport } from './routes/admin.login'
import { Route as HealthCheckTechnologyEquipmentIndexRouteImport } from './routes/health-check.technology-equipment.index'
import { Route as HealthCheckTechnologyEquipmentResultsRouteImport } from './routes/health-check.technology-equipment.results'
import { Route as AdminHealthChecksIndexRouteImport } from './routes/admin.health-checks.index'
import { Route as AdminHealthChecksIdRouteImport } from './routes/admin.health-checks.$id'
import { Route as HealthCheckNetworkCctvIndexRouteImport } from './routes/health-check.network-cctv.index'
import { Route as HealthCheckNetworkCctvResultsRouteImport } from './routes/health-check.network-cctv.results'
import { Route as HealthCheckBusinessOperationsIndexRouteImport } from './routes/health-check.business-operations.index'
import { Route as HealthCheckBusinessOperationsResultsRouteImport } from './routes/health-check.business-operations.results'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const TechnologySolutionsRoute = TechnologySolutionsRouteImport.update({ id: '/technology-solutions', path: '/technology-solutions', getParentRoute: () => rootRouteImport } as any)
const AdminLoginRoute = AdminLoginRouteImport.update({ id: '/admin/login', path: '/admin/login', getParentRoute: () => rootRouteImport } as any)
const HealthCheckTechnologyEquipmentIndexRoute = HealthCheckTechnologyEquipmentIndexRouteImport.update({ id: '/health-check/technology-equipment/', path: '/health-check/technology-equipment/', getParentRoute: () => rootRouteImport } as any)
const HealthCheckTechnologyEquipmentResultsRoute = HealthCheckTechnologyEquipmentResultsRouteImport.update({ id: '/health-check/technology-equipment/results', path: '/health-check/technology-equipment/results', getParentRoute: () => rootRouteImport } as any)
const AdminHealthChecksIndexRoute = AdminHealthChecksIndexRouteImport.update({ id: '/admin/health-checks/', path: '/admin/health-checks/', getParentRoute: () => rootRouteImport } as any)
const AdminHealthChecksIdRoute = AdminHealthChecksIdRouteImport.update({ id: '/admin/health-checks/$id', path: '/admin/health-checks/$id', getParentRoute: () => rootRouteImport } as any)
const HealthCheckNetworkCctvIndexRoute = HealthCheckNetworkCctvIndexRouteImport.update({ id: '/health-check/network-cctv/', path: '/health-check/network-cctv/', getParentRoute: () => rootRouteImport } as any)
const HealthCheckNetworkCctvResultsRoute = HealthCheckNetworkCctvResultsRouteImport.update({ id: '/health-check/network-cctv/results', path: '/health-check/network-cctv/results', getParentRoute: () => rootRouteImport } as any)
const HealthCheckBusinessOperationsIndexRoute = HealthCheckBusinessOperationsIndexRouteImport.update({ id: '/health-check/business-operations/', path: '/health-check/business-operations/', getParentRoute: () => rootRouteImport } as any)
const HealthCheckBusinessOperationsResultsRoute = HealthCheckBusinessOperationsResultsRouteImport.update({ id: '/health-check/business-operations/results', path: '/health-check/business-operations/results', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/technology-solutions': typeof TechnologySolutionsRoute
  '/admin/login': typeof AdminLoginRoute
  '/health-check/technology-equipment/results': typeof HealthCheckTechnologyEquipmentResultsRoute
  '/health-check/technology-equipment/': typeof HealthCheckTechnologyEquipmentIndexRoute
  '/admin/health-checks/': typeof AdminHealthChecksIndexRoute
  '/admin/health-checks/$id': typeof AdminHealthChecksIdRoute
  '/health-check/network-cctv/results': typeof HealthCheckNetworkCctvResultsRoute
  '/health-check/network-cctv/': typeof HealthCheckNetworkCctvIndexRoute
  '/health-check/business-operations/results': typeof HealthCheckBusinessOperationsResultsRoute
  '/health-check/business-operations/': typeof HealthCheckBusinessOperationsIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/technology-solutions': typeof TechnologySolutionsRoute
  '/admin/login': typeof AdminLoginRoute
  '/health-check/technology-equipment/results': typeof HealthCheckTechnologyEquipmentResultsRoute
  '/health-check/technology-equipment': typeof HealthCheckTechnologyEquipmentIndexRoute
  '/admin/health-checks': typeof AdminHealthChecksIndexRoute
  '/admin/health-checks/$id': typeof AdminHealthChecksIdRoute
  '/health-check/network-cctv/results': typeof HealthCheckNetworkCctvResultsRoute
  '/health-check/network-cctv': typeof HealthCheckNetworkCctvIndexRoute
  '/health-check/business-operations/results': typeof HealthCheckBusinessOperationsResultsRoute
  '/health-check/business-operations': typeof HealthCheckBusinessOperationsIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/technology-solutions': typeof TechnologySolutionsRoute
  '/admin/login': typeof AdminLoginRoute
  '/health-check/technology-equipment/results': typeof HealthCheckTechnologyEquipmentResultsRoute
  '/health-check/technology-equipment/': typeof HealthCheckTechnologyEquipmentIndexRoute
  '/admin/health-checks/': typeof AdminHealthChecksIndexRoute
  '/admin/health-checks/$id': typeof AdminHealthChecksIdRoute
  '/health-check/network-cctv/results': typeof HealthCheckNetworkCctvResultsRoute
  '/health-check/network-cctv/': typeof HealthCheckNetworkCctvIndexRoute
  '/health-check/business-operations/results': typeof HealthCheckBusinessOperationsResultsRoute
  '/health-check/business-operations/': typeof HealthCheckBusinessOperationsIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/technology-solutions'
    | '/admin/login'
    | '/health-check/technology-equipment/results'
    | '/health-check/technology-equipment/'
    | '/admin/health-checks/'
    | '/admin/health-checks/$id'
    | '/health-check/network-cctv/results'
    | '/health-check/network-cctv/'
    | '/health-check/business-operations/results'
    | '/health-check/business-operations/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/technology-solutions'
    | '/admin/login'
    | '/health-check/technology-equipment/results'
    | '/health-check/technology-equipment'
    | '/admin/health-checks'
    | '/admin/health-checks/$id'
    | '/health-check/network-cctv/results'
    | '/health-check/network-cctv'
    | '/health-check/business-operations/results'
    | '/health-check/business-operations'
  id:
    | '__root__'
    | '/'
    | '/technology-solutions'
    | '/admin/login'
    | '/health-check/technology-equipment/results'
    | '/health-check/technology-equipment/'
    | '/admin/health-checks/'
    | '/admin/health-checks/$id'
    | '/health-check/network-cctv/results'
    | '/health-check/network-cctv/'
    | '/health-check/business-operations/results'
    | '/health-check/business-operations/'
  fileRoutesById: FileRoutesById
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/technology-solutions': { id: '/technology-solutions'; path: '/technology-solutions'; fullPath: '/technology-solutions'; preLoaderRoute: typeof TechnologySolutionsRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/login': { id: '/admin/login'; path: '/admin/login'; fullPath: '/admin/login'; preLoaderRoute: typeof AdminLoginRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/technology-equipment/': { id: '/health-check/technology-equipment/'; path: '/health-check/technology-equipment'; fullPath: '/health-check/technology-equipment/'; preLoaderRoute: typeof HealthCheckTechnologyEquipmentIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/technology-equipment/results': { id: '/health-check/technology-equipment/results'; path: '/health-check/technology-equipment/results'; fullPath: '/health-check/technology-equipment/results'; preLoaderRoute: typeof HealthCheckTechnologyEquipmentResultsRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/health-checks/': { id: '/admin/health-checks/'; path: '/admin/health-checks'; fullPath: '/admin/health-checks/'; preLoaderRoute: typeof AdminHealthChecksIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/health-checks/$id': { id: '/admin/health-checks/$id'; path: '/admin/health-checks/$id'; fullPath: '/admin/health-checks/$id'; preLoaderRoute: typeof AdminHealthChecksIdRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/network-cctv/': { id: '/health-check/network-cctv/'; path: '/health-check/network-cctv'; fullPath: '/health-check/network-cctv/'; preLoaderRoute: typeof HealthCheckNetworkCctvIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/network-cctv/results': { id: '/health-check/network-cctv/results'; path: '/health-check/network-cctv/results'; fullPath: '/health-check/network-cctv/results'; preLoaderRoute: typeof HealthCheckNetworkCctvResultsRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/business-operations/': { id: '/health-check/business-operations/'; path: '/health-check/business-operations'; fullPath: '/health-check/business-operations/'; preLoaderRoute: typeof HealthCheckBusinessOperationsIndexRouteImport; parentRoute: typeof rootRouteImport }
    '/health-check/business-operations/results': { id: '/health-check/business-operations/results'; path: '/health-check/business-operations/results'; fullPath: '/health-check/business-operations/results'; preLoaderRoute: typeof HealthCheckBusinessOperationsResultsRouteImport; parentRoute: typeof rootRouteImport }
  }
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  TechnologySolutionsRoute: typeof TechnologySolutionsRoute
  AdminLoginRoute: typeof AdminLoginRoute
  HealthCheckTechnologyEquipmentResultsRoute: typeof HealthCheckTechnologyEquipmentResultsRoute
  HealthCheckTechnologyEquipmentIndexRoute: typeof HealthCheckTechnologyEquipmentIndexRoute
  AdminHealthChecksIndexRoute: typeof AdminHealthChecksIndexRoute
  AdminHealthChecksIdRoute: typeof AdminHealthChecksIdRoute
  HealthCheckNetworkCctvResultsRoute: typeof HealthCheckNetworkCctvResultsRoute
  HealthCheckNetworkCctvIndexRoute: typeof HealthCheckNetworkCctvIndexRoute
  HealthCheckBusinessOperationsResultsRoute: typeof HealthCheckBusinessOperationsResultsRoute
  HealthCheckBusinessOperationsIndexRoute: typeof HealthCheckBusinessOperationsIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  TechnologySolutionsRoute,
  AdminLoginRoute,
  HealthCheckTechnologyEquipmentResultsRoute,
  HealthCheckTechnologyEquipmentIndexRoute,
  AdminHealthChecksIndexRoute,
  AdminHealthChecksIdRoute,
  HealthCheckNetworkCctvResultsRoute,
  HealthCheckNetworkCctvIndexRoute,
  HealthCheckBusinessOperationsResultsRoute,
  HealthCheckBusinessOperationsIndexRoute,
}

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
