import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authenticationService.getUser()
      .then(
        data => {
          debugger
          if(data){
            this.authenticationService.validateAuthToken(data['token'])
            .subscribe(
              res => this.router.navigate(['/home']),
              err =>   this.router.navigate(['/login'])
            )
          } else{
            this.router.navigate(['/login'])
          }
        },
        err => this.router.navigate(['/login'])
      );
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
