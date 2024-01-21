import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-form',
  templateUrl: 'task-form.page.html',
  styleUrls: ['task-form.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class TaskFormPage {

  constructor() {}

}
