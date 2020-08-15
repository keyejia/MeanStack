import { Post } from './post.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { map, subscribeOn } from 'rxjs/operators';
import { PortalHostDirective } from '@angular/cdk/portal';
import { stringify } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getPosts(){
    this.http.get<{message: string, posts: any}>(
      'http://localhost:3000/api/posts'
      )
      .pipe(map((postData)=>{
        return postData.posts.map(post=>{
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        });
      }))
      .subscribe((transformedPosts) =>{
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string){
    const post: Post = {id: null, title: title, content: content};
    this.http
      .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe(res => {
        const id = res.postId;
        post.id = id;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  getPost(id: string){
    return this.http.get<{_id: string; title: string; content: string}>("http://localhost:3000/api/posts/"+id);
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content}
    this.http.put("http://localhost:3000/api/posts/"+ id, post)
      .subscribe(res=>{
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p=>p.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.posts = updatedPost;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string){
    this.http.delete('http://localhost:3000/api/posts/'+id)
      .subscribe(()=>{
        const updatedPosts = this.posts.filter(post=>post.id!==id);
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

}
