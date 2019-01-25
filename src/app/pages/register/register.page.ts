import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  register_form: FormGroup;
  error_message: string;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.register_form = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });
  }

  onSubmit(values){
    var username = 'YOUR_USER_NAME'; // this should be an administrator Username
    var password = 'YOUR_PASSWORD'; // this should be an administrator Password
    //only authenticated administrators can create users
    this.authenticationService.doLogin(username, password)
    .subscribe(
      res => {
        let user_data = {
          username: values.username,
          name: values.displayName,
          email: values.email,
          password: values.password
        };
        this.authenticationService.doRegister(user_data, res['token'])
        .subscribe(
          async result => {
            const toast = await this.toastController.create({
              message: 'Your user have been register, please log in!.',
              duration: 3000
            });
            toast.present();
            this.router.navigate(['/login']);
          },
          error => {
            this.error_message = error.error.message;
          }
        );
      },
      err => {
        console.log(err);
      }
    )
  }

}
