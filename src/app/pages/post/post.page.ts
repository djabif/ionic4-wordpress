import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  post: any;
  user: string;
  comments: Array<any> = new Array<any>();
  categories: Array<any> = new Array<any>();
  // morePagesAvailable: boolean = true;

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {

  }

  async ngOnInit() {
    // this.morePagesAvailable = true;
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    // this.post = this.navParams.get('item');
    this.route.params.subscribe(
      param => {
        debugger
        this.post = param;

        forkJoin([
          this.getAuthorData(),
          // this.getCategories(),
          this.getComments()
        ])
        .subscribe(data => {
          debugger
          // this.user = data[0].name;
          // this.categories = data[1];
          // this.comments = data[2];
          loading.dismiss();
          });
      }
    )
  }

  getAuthorData(){
    return this.wordpressService.getAuthor(this.post.author);
  }

  // getCategories(){
  //   return this.wordpressService.getPostCategories(this.post);
  // }

  getComments(){
    return this.wordpressService.getComments(this.post.id);
  }

  loadMoreComments(infiniteScroll) {
    let page = (this.comments.length/10) + 1;
    this.wordpressService.getComments(this.post.id, page)
    .subscribe(data => {
      const recentComments = Object.keys(data).map(i => data[i]);
      for(let item of recentComments){
        this.comments.push(item);
      }
      infiniteScroll.target.complete();
    }, err => {
      console.log(err);
      infiniteScroll.target.disabled = true;
    })
  }

  goToCategoryPosts(categoryId, categoryTitle){
    // this.navCtrl.push(HomePage, {
    //   id: categoryId,
    //   title: categoryTitle
    // })
  }

  createComment(){
    // let user: any;
    //
    // this.authenticationService.getUser()
    // .then(res => {
    //   user = res;
    //
    //   let alert = this.alertCtrl.create({
    //   title: 'Add a comment',
    //   inputs: [
    //     {
    //       name: 'comment',
    //       placeholder: 'Comment'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: data => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: 'Accept',
    //       handler: data => {
    //         let loading = this.loadingCtrl.create();
    //         loading.present();
    //         this.wordpressService.createComment(this.post.id, user, data.comment)
    //         .subscribe(
    //           (data) => {
    //             console.log("ok", data);
    //             this.getComments();
    //             loading.dismiss();
    //           },
    //           (err) => {
    //             console.log("err", err);
    //             loading.dismiss();
    //           }
    //         );
    //       }
    //     }
    //   ]
    // });
    // alert.present();
    // },
    // err => {
    //   let alert = this.alertCtrl.create({
    //     title: 'Please login',
    //     message: 'You need to login in order to comment',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       },
    //       {
    //         text: 'Login',
    //         handler: () => {
    //           this.navCtrl.push(LoginPage);
    //         }
    //       }
    //     ]
    //   });
    // alert.present();
    // });
  }

}
