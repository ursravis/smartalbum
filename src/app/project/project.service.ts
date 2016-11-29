import { Injectable } from '@angular/core';
import { Http, Response,Headers } from '@angular/http';
import {ENV} from '../shared/constant/env';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { IProject } from './project';

@Injectable()
export class ProjectService {
    private _projectUrl = 'http://smartalbumwebapi.azurewebsites.net/api/projects';
    //private _projectUrl = 'http://localhost:2196/api/projects';
private headers = new Headers({'Content-Type': 'application/json'});
    constructor(private _http: Http) { 
       // this._projectUrl=ENV.API_URL;
    }

    getProjects(): Observable<IProject[]> {
        return this._http.get(this._projectUrl)
            .map((response: Response) => <IProject[]> response.json())
            .do(data => console.log('All: ' ))
            .catch(this.handleError);
    }

    getProject(id: number): Observable<IProject> {
        return this.getProjects()
            .map((projects: IProject[]) => projects.find(p => p.projectId === id));
    }
    createProject(project:IProject){
     var body=JSON.stringify(project);
        return this._http.post(this._projectUrl,body,{headers:this.headers})
            .toPromise()
            .then(()=>project)
            .catch(this.handleError);
    }
 updateProject(project:IProject):Promise<IProject>{
     var updateURL=this._projectUrl+'/'+project.projectId;
     var body=JSON.stringify(project);
        return this._http.put(updateURL,body,{headers:this.headers})
         
            .toPromise()
            .then(()=>project)
            .catch(this.handleError);
    }

     createThumb(projectId:number):Promise<IProject>{
     var updateURL=this._projectUrl+'/'+projectId;
    
        return this._http.get(updateURL)
            .toPromise()
            .then(response=>response.json().data as IProject)
            .catch(this.handleError);
    }
    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
