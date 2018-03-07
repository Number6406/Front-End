import { Injectable } from '@angular/core';
import { User } from '../shared/user';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { URL_API } from '../shared/constants'

/*
httpOptions = {
  headers: new HttpHeaders({
    'Autorization' : 'Bearer '+token
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  })
};
*/

@Injectable()
export class AuthentificationService {

  public admin = new BehaviorSubject<boolean>(this.initIsAdmin());
  public connectedUser = new BehaviorSubject<any>(this.initConnectedUser());
  public tokenUser = new BehaviorSubject<string>(this.initTokenUser());

  public globalLink = URL_API;

  admin$ = this.admin.asObservable();
  connectedUser$ = this.connectedUser.asObservable();
  tokenUser$ = this.tokenUser.asObservable();

  constructor(private http: HttpClient) { }

  public getAdmin(): BehaviorSubject<boolean>{return this.admin}

  public setAdmin(isAdmin:boolean): void {
    this.admin.next(isAdmin);
    localStorage.setItem('isAdmin', this.admin.value);
  }

  private initIsAdmin(){
    if(localStorage.getItem("isAdmin")){
      return localStorage.getItem("isAdmin")
    }
    else{
      return this.admin;
    }
  }

  public getConnectedUser(): BehaviorSubject<any>{return this.connectedUser;}
  public setConnectedUser(user:User): void {
    this.connectedUser.next(user);
    localStorage.setItem('conenctedUser', this.connectedUser.value);
  }
  private initConnectedUser(){
    if(localStorage.getItem("conenctedUser")){
      return localStorage.getItem("conenctedUser")
    }
    else{
      return this.connectedUser;
    }
  }

  public getTokenUser(): BehaviorSubject<string>{return this.tokenUser}
  public setTokenUser(token:string): void {
    this.tokenUser.next(token);
    localStorage.setItem('token', this.tokenUser.value);
  }
  private initTokenUser(){
    if(localStorage.getItem("token")){
      return localStorage.getItem("token")
    }
    else{
      return this.tokenUser;
    }
  }

  //Send a connexion request to the back-end
  //return an observable

  connexionUser(mail:string, psw : string) {
    var body = JSON.stringify({
            emailUser: mail,
            password: psw
    });

    return this.http.post(this.globalLink+"/auth/login",body);
  }

  //Init the different field of the service
  initConnexionUser(){
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("conenctedUser");
    localStorage.removeItem("token");
    this.connectedUser.next(undefined);
    this.tokenUser.next('');
    this.admin.next(false);
  }

  //Set the different field of the service
  setConnexionUser(data){
    this.setConnectedUser(data.user);
    this.setTokenUser(data.token);
    this.setAdmin(data.user.is_admin==1);
  }

  //Send a resgistration request to the back-end
  //return an observable
  registrationUser(newUser:User) {
    var body = JSON.stringify({
    	name : newUser.name,
    	surname : newUser.surname,
    	role : newUser.role,
    	email : newUser.email,
    	password : newUser.password,
    });

    return this.http.post(this.globalLink+"/auth/signup",body);
  }

  //Disconnect user
  disconect() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Authorization' : 'Bearer '+ this.tokenUser.value,
      })
    };
    return this.http.post(this.globalLink+"/auth/logout",{},httpOptions);
  }


}
