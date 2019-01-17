import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  register_form: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
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
    var username = 'envato@startapplabs.com'; // this should be an administrator Username
    var password = 'KeepShipping!'; // this should be an administrator Password
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
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
      },
      err => {
        console.log(err);
      }
    )
  }

}
