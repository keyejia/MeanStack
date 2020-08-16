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
            id: post._id,
            imagePath: post.imagePath
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

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe(res => {
        const post: Post = {id: res.post.id, title: title, content: content, imagePath:res.post.imagePath}
        const id = res.post.id;
        post.id = id;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  getPost(id: string){
    return this.http.get<{_id: string; title: string; content: string, imagePath: string}>(
      "http://localhost:3000/api/posts/"+id
      );
  }

  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if (typeof(image) === 'object'){
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }else{
      postData = {id: id, title: title, content: content, imagePath: image}
    }
    this.http.put("http://localhost:3000/api/posts/"+ id, postData)
      .subscribe(res=>{
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p=>p.id === id);
        const post: Post = {id: id, title: title, content: content, imagePath: ""}
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
