import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpClientJsonpModule  } from '@angular/common/http';
import { NewsApiService } from './news-api.service';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, } from '@angular/material';
import {MatDialogModule} from "@angular/material";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AppComponent } from './app.component';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    ShareDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    HttpClientJsonpModule,
    RouterModule.forRoot(appRoutes),
    MatDialogModule,
    FontAwesomeModule,
    BrowserModule,
    MatProgressSpinnerModule
    

  ],
  providers: [NewsApiService],
  bootstrap: [AppComponent],
  entryComponents:[ShareDialogComponent]
})

export class AppModule { }
//
