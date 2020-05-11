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
};
const ADConfig = {
  "auth": {
    "clientId": "55f3d986-c18e-4b43-b244-dd06909efe67",
    "authority": "https://login.microsoftonline.com/db7ac9ef-779d-46e5-9bca-00509580ad6b",
    "validateAuthority": true,
    "redirectUri": "http://localhost:4200/",
    "postLogoutRedirectUri": "http://localhost:4200",
    "navigateToLoginRequestUrl": true
  },
    "cache": {
        "cacheLocation": "localStorage"
    },
    "scopes": {
        "loginRequest": ["openid", "profile"]
    },
    "resources": {
      "Api": {
        "resourceUri": Config.url,
        "resourceScope": "api://e98d88d4-0e9a-47f3-bddf-568942eac4e9/api.consume"
      }
    }     
}
export {Config, ADConfig};
