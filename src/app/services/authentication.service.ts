import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Config from '../../config';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(
    public nativeStorage: NativeStorage,
    private platform: Platform,
    public http: HttpClient
  ){}

  getUser(){
    if (this.platform.is('cordova')) {
      return this.nativeStorage.getItem('User');
    } else {
      return new Promise<any>((resolve, reject) => {
        debugger
        let user = window.localStorage.getItem('User');
        resolve(JSON.parse(user));
      })
    }
  }

  setUser(user){
    if (this.platform.is('cordova')) {
      this.nativeStorage.setItem('User', user);
    } else {
      debugger
      window.localStorage.setItem('User', JSON.stringify(user));
    }
  }

  logOut(){
    if (this.platform.is('cordova')) {
      return this.nativeStorage.clear();
    } else {
      return new Promise<any>((resolve, reject) => {
        window.localStorage.clear();
        resolve()
      })
    }
  }

  doLogin(username, password){
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

  doRegister(user_data, token){
    let header: HttpHeaders;
		header = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(Config.WORDPRESS_REST_API_URL + 'users', user_data, {headers:header});
  }

  validateAuthToken(token){
    let header : HttpHeaders = new HttpHeaders().append('Authorization','Basic ' + token);
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }
}
