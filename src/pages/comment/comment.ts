import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import {CommonVariableProvider} from "../../providers/common-variable/common-variable";
import {HttpWithTokenProvider} from "../../providers/http-with-token/http-with-token";

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {

  post: any;
  post_content: any;

  root_url: string;

  content: FormControl;
  commentForm: FormGroup;

  isDisabled: boolean = false;
  submitAttempt: boolean = false;

  callBack: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public builder: FormBuilder,
              public commonVar: CommonVariableProvider, public httpWithToken: HttpWithTokenProvider,
              public toastCtrl: ToastController) {

    this.post = navParams.get('post');
    this.callBack = this.navParams.get('callBack');

    this.root_url = commonVar.root_url;

    // 포스트를 수정하는 경우는 이미 글 내용이 있으므로 이 내용으로 채워줘야 한다.
    if (typeof(this.post) == 'undefined'){
      this.post_content = ''
    } else {
      this.post_content = this.post.content;
    }

    this.content = new FormControl(
      this.post_content,
      Validators.compose([Validators.required, ])
    );
    this.commentForm = this.builder.group({
      'content': this.content
    });

  }

  ionViewDidLoad() {
    console.log(this.post);

  }

  writeComment(value) {
    this.httpWithToken.postWithToken('api/comments/', {'content': value.content}).then(
      data => {
        let toast = this.toastCtrl.create({
          message: '글을 성공적으로 작성하였습니다!',
          duration: 2000,
          position: 'middle'
        });
        toast.present();

        // 전에 갈 페이지가 rootPage일 때는 이렇게 하면 됨.
        // this.navCtrl.setRoot(PlaygroundPage);

        // 전에 갈 페이지가 rootPage가 아닐때는 전 페이지에서 callBack 함수를 navCtrl 로 전달해야 함.
        // https://forum.ionicframework.com/t/solved-ionic2-navcontroller-pop-with-params/58104/4
        this.callBack().then(() => {
          this.navCtrl.pop();
        })

      },
      error => {

      }
    )
  }


}
