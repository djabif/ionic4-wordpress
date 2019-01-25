import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  login_form: FormGroup;
  error_message: string;

  constructor(
    private router: Router,
    public loadingController: LoadingController,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.login_form = this.formBuilder.group({
      username: new FormControl('IamDemo', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('iamdemo', Validators.required)
    });
  }

  async login(value){
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();
    this.authenticationService.doLogin(value.username, value.password)
    .subscribe(res => {
       this.authenticationService.setUser({
         token: res['token'],
         username: value.username,
         displayname: res['user_display_name'],
         email: res['user_email']
       });
       loading.dismiss();
       this.router.navigate(['/home']);
     },
     err => {
       loading.dismiss();
       this.error_message = "Invalid credentials.";
       console.log(err);
     })
  }

  skipLogin(){
    this.router.navigate(['/home']);
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

}
