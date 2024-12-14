import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { NotificationsService, type Notification } from '../../services/notifications.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule, MatButtonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private notificationsService: NotificationsService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      this.error = 'Usuário não identificado';
      this.loading = false;
      return;
    }

    this.notificationsService.getUserNotifications(Number(userId)).subscribe({
      next: (notifications) => {
        this.notifications = notifications.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar notificações:', error);
        this.error = 'Erro ao carregar notificações';
        this.loading = false;
      }
    });
  }

  markAsRead(notification: Notification) {
    if (notification.read) return;

    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
      },
      error: (error) => {
        console.error('Erro ao marcar notificação como lida:', error);
      }
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'APPLICATION_UPDATE':
        return 'work';
      case 'NEW_VACANCY':
        return 'add_business';
      case 'SYSTEM':
        return 'info';
      default:
        return 'notifications';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
