import { Routes, RouterModule } from '@angular/router';

import { HomeRoutes } from './home/index';
import { TodolistRoutes } from './todolist/index';
import {ProjectRoutes } from './project/index';

const appRoutes: Routes = [
    ...HomeRoutes,
    ...TodolistRoutes,
    ...ProjectRoutes
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
