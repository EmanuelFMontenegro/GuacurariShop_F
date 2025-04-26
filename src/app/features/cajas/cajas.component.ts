import { Component, computed, signal } from '@angular/core';
import { CommonModule,DecimalPipe } from '@angular/common';

interface Caja {
  id: number;
  estado: 'Abierta' | 'Cerrada';
  apertura: string;
  cierre?: string;
  total: number;
}

@Component({
  selector: 'app-cajas',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cajas.component.html',
  styleUrl: './cajas.component.scss',
})
export class CajasComponent {
  cajas = signal<Caja[]>([
    {
      id: 1,
      estado: 'Abierta',
      apertura: '2025-04-14 08:00',
      total: 45250,
    },
    {
      id: 2,
      estado: 'Cerrada',
      apertura: '2025-04-13 08:00',
      cierre: '2025-04-13 22:00',
      total: 78500,
    },
  ]);

  totalCajasAbiertas = computed(() =>
    this.cajas().filter((c) => c.estado === 'Abierta').length
  );
}