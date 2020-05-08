import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
export class AppConfig {
  apiEndpoint: string;
  clientId: string;
  resource: string;
  tenantId: string;
  redirectUri: string;
}
const Config = {
  url : environment.url,
  clientID : environment.AppConfig.clientID,
  tenantID: environment.AppConfig.tenantID,
  webClientId: environment.AppConfig.webClientId
};
export {Config};
