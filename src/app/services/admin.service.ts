import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../config/config';
const url = Config.url;
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private httpClient : HttpClient) { }

  fetchDesignationList() : Observable<string[]>{
    return this.httpClient.get<string[]>(`${url}/backoffice/designation/list`);
  }

  searchDesignations(value: string) : Observable<string[]>{
    return this.httpClient.get<string[]>(`${url}/backoffice/search/designation?searchString=${value}`);
  }

  updateDesignations(value) {
    return this.httpClient.put(`${url}/backoffice/update/designation`,value)
  }

  deleteDesignations(value){
    return this.httpClient.put(`${url}/backoffice/delete/designation`, value);
  }

  getAssociatedDesignationsList(id){
    return this.httpClient.get(`${url}/backoffice/associated/designation?Id=${id}`)
  }

  fetchExperienceList() : Observable<string[]>{
    return this.httpClient.get<string[]>(`${url}/backoffice/experience/list`)
  }

  updateExperiences(value){
    return this.httpClient.put(`${url}/backoffice/update/experience`,value)
  }

  getAssociatedExperienceCount(id){
    return this.httpClient.get(`${url}/backoffice/associated/experience?Id=${id}`)
  }

  addExperience(data){
    return this.httpClient.post(`${url}/backoffice/add/experience`,data);
  }

  fetchTagsList(startDate,endDate) : Observable<string[]>{
    return this.httpClient.get<string[]>(`${url}/backoffice/fetchTags/list?startDate=${startDate}&endDate=${endDate}`)
  }
}
