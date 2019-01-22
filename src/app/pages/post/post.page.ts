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

        this.wordpressService.getPost(param.id)
        .subscribe( post =>{
          this.post = post;

          forkJoin([
            this.getAuthorData(),
            this.getCategories(),
            this.getComments()
          ])
          .subscribe(data => {

            const recentComments = Object.keys(data[2]).map(i => data[2][i]);
            // const recentPosts = Object.keys(data).map(i => data[i]);
            this.user = data[0]['name'];
            this.categories = data[1];
            this.comments = recentComments;
            loading.dismiss();
            });
        })


      }
    )
  }

  getAuthorData(){
    return this.wordpressService.getAuthor(this.post.author);
  }

  getCategories(){
    return this.wordpressService.getPostCategories(this.post);
  }

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
    this.router.navigate(['/home', {
      id: categoryId,
      title: categoryTitle
    }])
    // this.navCtrl.push(HomePage, {
    //   id: categoryId,
    //   title: categoryTitle
    // })
  }

  async createComment(){
    // let user: any;
    //
    // await this.authenticationService.getUser()
    // .then(res => {
    //   debugger
    //   user = res;
    //
    //   const alert = this.alertController.create({
    //   header: 'Add a comment',
    //   inputs: [
    //     {
    //       name: 'comment',
    //       type: 'text',
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
    //         const loading = this.loadingController.create();
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
    // await alert.present();
    // },
    // err => {
    //   const alert = this.alertController.create({
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
    //           this.router.navigate('/login');
    //         }
    //       }
    //     ]
    //   });
    // await alert.present();
    // });
  }

}
