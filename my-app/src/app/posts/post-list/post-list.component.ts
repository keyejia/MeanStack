import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import {PostsService} from '../post.service';
import {Subscription, Subscribable} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postSub: Subscription;
  public loading = false;
  public totalPosts = 0;
  postPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  userIsAuthenticated = false;
  userId: string;
  currentPage = 1;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
    ) {}

  ngOnInit(){
    this.loading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number})=>{
        this.loading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onChangePage(pageData: PageEvent){
    this.loading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }
  onDelete(id: string){
    this.loading = true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    }, error=>{
      this.loading=false;
    });
  }

}
