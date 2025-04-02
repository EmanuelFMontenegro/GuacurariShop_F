// sidebar.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  userRole: string = 'admin';
  constructor(private authService: AuthService,private router: Router) {}

 
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      console.log('Sesión cerrada correctamente.');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  
  
}
