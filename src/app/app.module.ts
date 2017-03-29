import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, AUTH_API_URL } from 'ngx-login-client';

import { AppComponent }  from './app.component';

import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';

// Imports stackdetailsmodule
import { StackDetailsModule } from './stack/stack-details/stack-details.module';

@NgModule({
  imports:      [ BrowserModule, StackDetailsModule ],
  declarations: [ AppComponent ],
  providers: [
    Broadcaster,
    AuthenticationService,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    Contexts
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
