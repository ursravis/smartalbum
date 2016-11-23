import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule }     from '@angular/common';
import { projectRouting } from './project.routes';
import { ProjectListComponent } from './project-list.component';
import {ProjectDetailsComponent} from './project-details.component';
import {ProjectService } from './project.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    projectRouting
  ],
  declarations: [
    ProjectListComponent,
    ProjectDetailsComponent

  ],
  providers:[
    ProjectService
  ]
})
export class ProjectModule {}
