import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class Notification {

  constructor() {}


  async requestPermissions() {
    const permissions = await LocalNotifications.requestPermissions();
    if (permissions.display !== 'granted') {
      console.warn('Permission de notification refusée');
      return false;
    }
    return true;
  }

  async scheduleNotification(titre: string, corp: string, idContenu: string, poster: string = "", delayInSeconds: number = 0) {
    const hasPermission = await this.requestPermissions();

    if (!hasPermission) return;

    const notifId = Math.floor(Date.now() / 1000);

    const scheduleDate = new Date(Date.now() + delayInSeconds * 1000);

    await LocalNotifications.schedule({
      notifications: [
        {
          title: titre,
          body: corp,
          id: notifId,
          schedule: { at: scheduleDate },
          largeIcon: poster,
          actionTypeId: "",
          extra: idContenu
        }
      ]
    });

    console.log(`Notification programmée pour : ${scheduleDate}`);
  }

  async cancelAllNotifications() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
      console.log('Toutes les notifications ont été annulées');
    }
  }
}
