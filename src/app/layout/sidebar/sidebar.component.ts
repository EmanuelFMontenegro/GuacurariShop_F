import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private authService = inject(AuthService);

  
  readonly isAdmin = computed(() => this.authService.isAdmin());

  async logout(): Promise<void> {
    try {
      await this.authService.logout().toPromise(); // Convertimos observable a promise
      console.log('👋 Sesión cerrada correctamente.');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  }
}
