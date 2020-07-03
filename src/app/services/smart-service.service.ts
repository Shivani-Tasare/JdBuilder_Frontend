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
  fetchCandidatesDetails(tagName) : Observable<any[]>{
  var tags = encodeURIComponent(tagName.join('|'));
  return this.httpClient.get<any[]>(`${url}/getmatchingconsultants?tags=${tags}`);
  }
  fetchiCIMSCandidatesDetails(tagName) : Observable<any[]>{
    var tags = encodeURIComponent(tagName.join('|'));
    return this.httpClient.get<any[]>(`${url}/icims/search/people?skills=${tags}&&skillType=2`);
    }
}
