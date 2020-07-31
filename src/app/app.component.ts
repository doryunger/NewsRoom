import { Component, ViewChild, ElementRef,HostListener  } from '@angular/core';
import { NewsApiService } from './news-api.service';
import {Router} from "@angular/router"
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialog, MatDialogModule} from "@angular/material";
import {ShareDialogComponent } from './share-dialog/share-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	
	mArticles:Array<any>;
	mSources:Array<any>;
	//mSourceList:Array<any>;
	mCountries=[{"id":'us',"name":"USA"},{"id":'cn',"name":"China"},{"id":'gb',"name":"Great Britain"},{"id":'ch',"name":'Switzerland'},{"id":'de',"name":"Germany"},{"id":'ru',"name":"Russia"},{"id":'au',"name":"Australia"},{"id":'br',"name":"Brazil"},{"id":'il',"name":"Israel"},{"id":'ae',"name":"UAE"}];
	mSourceList=[{"id":"cnn","name":"CNN"},{"id":"fox-news","name":"Fox News"},{"id":"nbc-news","name":"NBC News"},{"id":"al-jazeera-english","name":"Al Jazeera English"},{"id":"bloomberg","name":"Bloomberg"},{"id":"techcrunch","name":"TechCrunch"},{"id":"independent","name":"Independent"},{"id":"the-washington-post","name":"The Washington Post"},{"id":"time","name":"Time"},{"id":"crypto-coins-news","name":"Crypto Coins News"}]
	ipAddress:string;
	clicked=false;
	countryCode:string;
	status:string;
	selected: string;
	shareurl:string;
	showSpinner=false;
	inList=false;
	disabled=true;
	warningOn=false;

	
	constructor(private newsapi:NewsApiService,private router: Router,public dialog: MatDialog){
		
		console.log('app component constructor called');  

	}
	
	//@ViewChild('button') button: ElementRef;

	ngOnInit() {
		this.status='countries';
		this.newsapi.getIP().subscribe((res:any)=>{  	
			this.ipAddress=res.ip;
			this.newsapi.getCountry('http://ip-api.com/json/'+this.ipAddress).subscribe((res:any)=>{
				this.countryCode=res.countryCode.toLowerCase();
				//this.countryCode='ae';
				
				for (let i=0;i<this.mCountries.length;i++){
					if(this.mCountries[i]['id']==this.countryCode){
						this.inList=true;
						if(i!==0){
							[this.mCountries[0],this.mCountries[i]]=[this.mCountries[i],this.mCountries[0]];
							//this.router.navigate(['/'+this.countryCode]);
						}
					}
				}
				if(this.inList==false){
					this.countryCode='us';
					
				}
					this.router.navigate(['/'+this.countryCode]);
					//this.newsapi.initArticles(this.countryCode).subscribe(data => this.mArticles = data['articles']);
					this.newsapi.initArticles(this.countryCode).subscribe(data => {if(data['articles'].length<1){
						this.newsapi.initArticles('us').subscribe(data => this.mArticles = data['articles']);
						
					}
					else{
						this.newsapi.initArticles(this.countryCode).subscribe(data => this.mArticles = data['articles']);
					}
				
					});
				});
			});
			  //this.newsapi.initArticles().subscribe(data => this.mArticles = data['articles']);
			  this.mSources=this.mCountries;
			  //load news sources
			  //this.newsapi.initSources().subscribe(data=> this.mSourceList = data['sources'])
			 	
			  

    }
	setStatus(arg:any){
		this.status=arg;
		if (arg=='countries'){
			this.mSources=this.mCountries;
			
		}
		else{
			this.mSources=this.mSourceList;
		
		}
	}
	
	searchArticles(set,source){
		set=this.status;
		if (set=='countries'){
			//this.showSpinner=true;
			this.newsapi.getArticlesByCountry(source).subscribe(data => this.mArticles = data['articles']);
			//this.mSources=this.mSourceList;
		}
		else{
			this.newsapi.getArticlesByID(source).subscribe(data => this.mArticles = data['articles']);
		}
		//console.log("selected source is: "+source);
		
	}
	serachByterm(keywords,div){
		keywords=keywords.replace(',','%20');
		this.newsapi.getArticlesByKeywords(keywords).subscribe((res:any)=>{
			if (res["totalResults"]>0){
				this.mArticles = res['articles'];
				this.router.navigate(['/']);
				document.body.scrollTop = 0;
				document.documentElement.scrollTop = 0;
			}
			else{
				if(div.style.display==''||div.style.display=='none'){
					this.fadeDiv(div,'serach');
				}
			}
		})
			
	}
	openDialog(dict){
		let links={};
		var english = /^[a-zA-Z0-9~@#$^*()_+=[\]{}|\\,.?: -]*$/;
		if (!english.test(dict.title)){
			links['Twitter']= 'https://twitter.com/share?url='+dict.url;
		}
		else{
			links['Twitter']= 'https://twitter.com/share?url='+dict.url+'&text='+dict.title;
		}
		links['WhatsApp']='https://wa.me/?text='+dict.title+dict.url;
		links['Facebook']='https://www.facebook.com/sharer.php?u='+dict.url;
		links['LinkedIn']='https://www.linkedin.com/shareArticle?url='+dict.url+'&title='+dict.title;
		links['URL']=dict.url;
		this.dialog.open(ShareDialogComponent,{data:{links}});
	};
	fadeDiv(inputdiv,context){
		if (context=='serach'){
			inputdiv.innerText="Search returned no results";
			inputdiv.style.backgroundColor='#ffffffca';
  			inputdiv.style.color='#030303';
			
		}
		else{
			inputdiv.innerText="Please use ','(comma) as separator";
			inputdiv.style.backgroundColor='#e286a5d0';
  			inputdiv.style.color='#690e2c';
		}
		var op = 0.1;  // initial opacity
		inputdiv.style.display = 'block';
		var timer = setInterval(function () {
			if (op >= 1){
				clearInterval(timer);
			}
			inputdiv.style.opacity = op;
			inputdiv.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 10);
		setTimeout(function(){
			var op = 1;  // initial opacity
			var timer = setInterval(function () {
			if (op <= 0.1){
					clearInterval(timer);
					inputdiv.style.display = 'none';
				}
				inputdiv.style.opacity = op;
				inputdiv.style.filter = 'alpha(opacity=' + op * 100 + ")";
				op -= op * 0.1;
			}, 50);
		},3000);
		
	}
	ValidateText(text,div){
		if (text.length>1){
			if (text.indexOf(";")>0 || text.indexOf(".")>0 || text.indexOf("&")>0){
				this.disabled=true;
				if(div.style.display==''||div.style.display=='none'){
					this.fadeDiv(div,'validation');
				}
			}
			else{
				this.disabled=false;
			}
		}
		else{
			this.disabled=true;
		}
	}
	@HostListener('window:scroll', ['$event']) 
    scrollHandler(event) {
	  let toolbar=document.getElementById('toolbar');
	  let card=document.getElementById('articleCard');
	  let cardWidth=card.getBoundingClientRect().width;
	  let sticky=toolbar.offsetTop;
	  if (window.pageYOffset > sticky) {
		toolbar.classList.add("sticky")
		toolbar.style.width=JSON.stringify(cardWidth+2)+'px';
	  } else {
		toolbar.classList.remove("sticky");
		toolbar.style.removeProperty('position');
	  }	
	}
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		let toolbar=document.getElementById('toolbar');
	  	let card=document.getElementById('articleCard');
	  	let cardWidth=card.getBoundingClientRect().width;
		toolbar.style.width=JSON.stringify(cardWidth+2)+'px';
	}
}
