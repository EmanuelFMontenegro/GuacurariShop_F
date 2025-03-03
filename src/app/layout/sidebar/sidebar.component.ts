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

 
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Sesión cerrada correctamente');      
      },
      error: (error) => {
        console.error('Error al cerrar sesión', error);
      }
    });
  }
  
  
}
