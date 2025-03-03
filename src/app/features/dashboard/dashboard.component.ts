import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Configuración gráfico de ventas
  salesChartType: ChartType = 'line';
  salesChartData: { datasets: ChartDataset[], labels: string[] } = {
    datasets: [{
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Ventas Mensuales',
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
      tension: 0.4,
      borderWidth: 2
    }],
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  };
  salesChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.1)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // Configuración gráfico de productos
  productsChartType: ChartType = 'bar';
  productsChartData: { datasets: ChartDataset[], labels: string[] } = {
    datasets: [{
      data: [12, 19, 3, 5, 2, 3],
      label: 'Productos Vendidos',
      backgroundColor: '#4CAF50',
      borderColor: '#388E3C',
      borderWidth: 1
    }],
    labels: ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Juguetes', 'Libros']
  };
  productsChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
        grid: { color: 'rgba(0,0,0,0.1)' }
      },
      x: {
        grid: { display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };
}