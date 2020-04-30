// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url : 'https://jdbuilderuat.azurewebsites.net/api',
  AppConfig: {
    clientID :'f8e7c239-6bf1-4b4c-acd0-cb6b4ce19101',
    tenantID:'db7ac9ef-779d-46e5-9bca-00509580ad6b',
    webClientId:'f8e7c239-6bf1-4b4c-acd0-cb6b4ce19101'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
