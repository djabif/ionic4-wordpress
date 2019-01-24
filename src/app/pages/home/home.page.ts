import { Component, OnInit } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  posts: Array<any> = new Array<any>();

  loggedUser: boolean = false;

  categoryId: number;
  categoryTitle: string;

  constructor(
    public loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.authenticationService.getUser()
    .then(
      data => this.loggedUser = true,
      error => this.loggedUser = false
    );

    //if we are browsing a category
    this.route.params.subscribe(
      param => {
        this.categoryId = param.id;
        this.categoryTitle = param.title;
      }
    )

    if(!(this.posts.length > 0)){
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
      await loading.present();

      this.wordpressService.getRecentPosts(this.categoryId)
      .subscribe(data => {
        const recentPosts = Object.keys(data).map(i => data[i]);
        for(let post of recentPosts){
          post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
          this.posts.push(post);
        }
        loading.dismiss();
      });
    }
  }

  postTapped(event, postId) {
    this.router.navigate(['/post', {id: postId}])
  }

  doInfinite(infiniteScroll) {
    let page = (Math.ceil(this.posts.length/10)) + 1;
    let loading = true;

    this.wordpressService.getRecentPosts(this.categoryId, page)
    .subscribe(data => {
      const recentPosts = Object.keys(data).map(i => data[i]);
      for(let post of recentPosts){
        if(!loading){
          infiniteScroll.target.complete();
        }
        post.excerpt.rendered = post.excerpt.rendered.split('<a')[0] + "</p>";
        this.posts.push(post);
        loading = false;
      }
    }, err => {
      // this.morePagesAvailable = false;
      infiniteScroll.target.disabled = true;
    })
  }

  logOut(){
    this.authenticationService.logOut()
    .then(
      res => this.router.navigate(['/login']),
      err => console.log('Error in log out')
    )
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
