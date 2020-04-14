import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JdDetails } from '../shared/models/jd-details';
import { MatchingConsultants } from '../shared/models/matchingConsultants';
import { map } from 'rxjs/operators';


const url = Config.url;
@Injectable({
  providedIn: 'root'
})
export class SmartServiceService {

  constructor( private httpClient : HttpClient) { }

  fetchCandidatesDetails(profileId) : Observable<any[]>{
    return this.httpClient.get<any[]>(`${url}/ProfileTags?profileId=${profileId}`);
  }

  // getConsultantsCount(jdDetails:JdDetails[]) : Observable<MatchingConsultantsWithCount[]>{
  //   console.log(jdDetails);
  //   return this.httpClient.post<MatchingConsultantsWithCount[]>(`https://experience-dev.azurewebsites.net/version1500.0.0.0/api/searchconsultants`,jdDetails);
  // }
}
