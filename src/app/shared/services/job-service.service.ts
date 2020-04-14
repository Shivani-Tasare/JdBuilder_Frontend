import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config/config';
import { Observable, Subscriber, Subject } from 'rxjs';
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
    console.log(params, 'paramsss')
    return this.httpClient.get(`${url}/FetchFilteredProfiles?experienceId=${params.experienceId}&
    locationId=${params.locationId}&designationId=${params.designationId}&pageSize=${params.pageSize}&
    pageIndex=${params.pageIndex}&tagString=${params.searchString}`);
  }
  // changeSideBarIndex(index){
  //   this.sideBarIndexSelected.next(index);
  // }
  // public getSideBarIndex(): Observable<any> {
  //   return this.sideBarIndexSelected.asObservable();
  // }
}
