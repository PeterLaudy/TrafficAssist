import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainviewComponent } from './mainview/mainview.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivatePage } from './classes/can-deactivate-page';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home/:from/:to', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'main/:from/:to', component: MainviewComponent, canDeactivate: [CanDeactivatePage]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

/**
 * @class AppRoutingModule
 */
export class AppRoutingModule { }
