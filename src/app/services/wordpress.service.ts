import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Config from '../../config';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(public http: HttpClient){}

  getRecentPosts(categoryId:number, page:number = 1){
    debugger
    //if we want to query posts by category
    let category_url = categoryId? ("&categories=" + categoryId): "";

    return this.http.get(
      Config.WORDPRESS_REST_API_URL
      + 'posts?page=' + page
      + category_url)
  }

  getComments(postId:number, page:number = 1){
    // return this.http.get(
    //   Config.WORDPRESS_REST_API_URL
    //   + "comments?post=" + postId
    //   + '&page=' + page)
    // .subscribe(res => res.json());
  }

  getAuthor(author){
    // return this.http.get(Config.WORDPRESS_REST_API_URL + "users/" + author)
    // .subscribe(res => res.json());
  }

  getPostCategories(post){
    // let observableBatch = [];
    //
    // post.categories.forEach(category => {
    //   observableBatch.push(this.getCategory(category));
    // });
    //
    // return Observable.forkJoin(observableBatch);
  }

  getCategory(category){
    // return this.http.get(Config.WORDPRESS_REST_API_URL + "categories/" + category)
    // .subscribe(res => res.json());
  }

  createComment(postId, user, comment){
    // let header: HttpHeaders = new HttpHeaders();
    // header.append('Authorization', 'Bearer ' + user.token);
    //
    // return this.http.post(Config.WORDPRESS_REST_API_URL + "comments?token=" + user.token, {
    //   author_name: user.displayname,
    //   author_email: user.email,
    //   post: postId,
    //   content: comment
    // },{ headers: header })
    // .subscribe(res => res.json());
  }
}
