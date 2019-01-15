import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Config from '../../config';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  constructor(
    public nativeStorage: NativeStorage,
    public http: HttpClient
  ){}

  getUser(){
    return this.nativeStorage.getItem('User');
  }

  setUser(user){
    return this.nativeStorage.setItem('User', user);
  }

  logOut(){
    return this.nativeStorage.clear();
  }

  doLogin(username, password){
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token',{
      username: username,
      password: password
    })
  }

  doRegister(user_data, token){
    return this.http.post(Config.WORDPRESS_REST_API_URL + 'users?token=' + token, user_data);
  }

  validateAuthToken(token){
    let header : HttpHeaders = new HttpHeaders();
    header.append('Authorization','Basic ' + token);
    return this.http.post(Config.WORDPRESS_URL + 'wp-json/jwt-auth/v1/token/validate?token=' + token,
      {}, {headers: header})
  }
}
