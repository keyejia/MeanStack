import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import {PostsService} from '../post.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub: Subscription;
  public loading = false;
  constructor(public postsService: PostsService) {}

  ngOnInit(){
    this.loading = true;
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[])=>{
        this.loading = false;
        this.posts = posts;
      });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe()
  }

  onDelete(id: string){
    this.postsService.deletePost(id);
  }

}
