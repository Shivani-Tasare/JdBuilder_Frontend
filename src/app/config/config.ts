import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';
export class AppConfig {
  apiEndpoint: string;
  clientId: string;
  resource: string;
  tenantId: string;
  redirectUri: string;
}
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config')
const Config = {
  url : environment.url,
  clientID : environment.AppConfig.clientID,
  tenantID: environment.AppConfig.tenantID,
  webClientId: environment.AppConfig.webClientId

};
export {Config};
