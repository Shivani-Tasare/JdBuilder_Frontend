import { InjectionToken } from '@angular/core';
export class AppConfig {
  apiEndpoint: string;
  clientId: string;
  resource: string;
  tenantId: string;
  redirectUri: string;
}
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config')
const Config = {
  url : 'https://localhost:44355/api',
  //url : 'https://jdbuilderuat.azurewebsites.net/api',
   // AAD CREDENTIAL
   //These are for Localhost
  clientID : 'a7be96cc-f8a3-41c5-9d6a-abb1394eed2c',
  tenantID: 'db7ac9ef-779d-46e5-9bca-00509580ad6b',
  webClientId: 'a7be96cc-f8a3-41c5-9d6a-abb1394eed2c',
  //smartUrl:''
  //These credentials are for UAT
  // clientID : 'f8e7c239-6bf1-4b4c-acd0-cb6b4ce19101',
  // tenantID: 'db7ac9ef-779d-46e5-9bca-00509580ad6b',
  // webClientId: 'f8e7c239-6bf1-4b4c-acd0-cb6b4ce19101'
};
export {Config};
