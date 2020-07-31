import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import {map} from "rxjs/operators";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  
  
  api_key = '995e7280de9e48c79439af57b3edd3d1';
  

  constructor(private http:HttpClient) { }


  initSources(){
	 return this.http.get('https://newsapi.org/v2/sources?language=en&apiKey='+this.api_key);
  }
  
  initArticles(country){
        return this.http.get('https://newsapi.org/v2/top-headlines?country='+country+'&apiKey='+this.api_key);
  }    
  /*initArticles(){
   return this.http.get('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey='+this.api_key);
  }*/
  getIP() {
    return this.http.get("http://api.ipify.org/?format=json");
 }
 
  getCountry(url){
  return this.http.get(url);
  }
  getArticlesByID(source: String){
   return this.http.get('https://newsapi.org/v2/top-headlines?sources='+source+'&apiKey='+this.api_key);
   }
  getArticlesByCountry(source: string){
    return this.http.get('https://newsapi.org/v2/top-headlines?country='+source+'&apiKey='+this.api_key);
   }
  getArticlesByKeywords(text:string){
    return this.http.get('https://newsapi.org/v2/top-headlines?q='+text+'&apiKey='+this.api_key);
  }
  



}
