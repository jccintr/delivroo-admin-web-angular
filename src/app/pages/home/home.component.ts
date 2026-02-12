import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  storeName: string | null = null;
  logotipo: string | null = null;

  constructor(private router: Router,private authService: AuthService,private storeService: StoreService) {
   }

  ngOnInit(): void {
   if (!this.authService.isAuthenticated()) {
     this.router.navigate(['/login']);
   }
   this.storeName = this.authService.currentUser()?.name ?? null;
   this.logotipo = this.storeService.BASE_STORAGE + '/' + this.authService.currentUser()?.logotipo;
  }

}
