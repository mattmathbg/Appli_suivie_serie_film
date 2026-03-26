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

  async scheduleNotification(titre: string, corp: string, idContenu: number, poster: string = "", delayInSeconds: number = 0) {
    const hasPermission = await this.requestPermissions();

    //si on a pas la permission d envoyer des notification on arrete.
    if (!hasPermission) return;

    //ID prend l'heure
    const notifId = Math.floor(Date.now() / 1000);

    // Calcule la date de déclenchement
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

  /**
   * Annule toutes les notifications en attente
   */
  async cancelAllNotifications() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
      console.log('Toutes les notifications ont été annulées');
    }
  }
}
