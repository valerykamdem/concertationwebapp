import { Routes } from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {AccessComponent} from "./access/access.component";
import {LoginComponent} from "./login/login.component";

export default [
  { path: 'access', component: AccessComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
] as Routes;
