import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config/config';
import { Observable, Subscriber, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const url = Config.url;
@Injectable({providedIn: 'root'})
export class JobServiceService {
  private sideBarIndexSelected = new Subject<2>();
  constructor(private httpClient: HttpClient) { }
  getAllJobs(pageParams) {
    return this.httpClient.get(`${url}/FetchProfiles/?pageSize=${pageParams.pageSize}&pageIndex=${pageParams.pageIndex}`);
  }
  fetchProfiles(jdId) {
    return this.httpClient.get(`${url}/FetchProfileDetails?profileId=${jdId}`);
  }
  saveJd(jdDetail) {
    return this.httpClient.post(`${url}/UpdateProfile`, jdDetail);
  }
  FetchExperienceList() {
    return this.httpClient.get(`${url}/FetchExperienceList`);
  }
  FetchLocationList() {
    return this.httpClient.get(`${url}/FetchLocationList`);
  }
  FetchDesignationList() {
    return this.httpClient.get(`${url}/FetchDesignationList`);
  }
  FetchTagsList() {
    return this.httpClient.get(`${url}/FetchTagsList`);
  }
  FetchFilteredProfiles(params) {
    return this.httpClient.get(`${url}/FetchFilteredProfiles?experienceId=${params.experienceId}&
    locationId=${params.locationId}&designationId=${params.designationId}&pageSize=${params.pageSize}&
    pageIndex=${params.pageIndex}&tagString=${params.searchString}`);
  }
  getProfile():Observable<any> {
    return this.httpClient.get<any>(environment.url+'/employee/v1/profile');
  }

  getPhoto() {
    return this.httpClient.get('https://graph.microsoft.com/v1.0/users/nsingh@dminc.com/photos/96X96/$value');
  }
}
