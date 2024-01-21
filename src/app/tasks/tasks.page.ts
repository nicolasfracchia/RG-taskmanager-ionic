import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Itask } from '../interfaces/itask';
import { TasksService } from '../services/tasks.service';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { AlertController, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.page.html',
  styleUrls: ['tasks.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    RouterLink, 
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol
  ],
  providers: [
    DatePipe
  ]
})
export class TasksPage {
  tasks!: Itask[];
  
  getTasks(){
    this._taskService.getTasks().subscribe((results) => {
      this.tasks = results;
    });
  }

  async deleteTask(task:Itask){
    const dateFormatted = this.datePipe.transform(task.task_date, 'dd/MM/yyyy');

    const alert = await this.alertController.create({
      header: `Are you sure you want to delete this task?`,
      subHeader: `${task.category} - " ${task.title} " (${task.priority_level} priority)`,
      message: `date: ${dateFormatted}`,
      buttons: [
        {text: 'Cancel',role: 'cancel'},
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: (t) => {
            this.deleteTaskConfirmed(task.id);
          }
        }
      ]
    });
  
    await alert.present();
  }

  constructor(
    private _taskService: TasksService, 
    private alertController: AlertController, 
    private datePipe: DatePipe,
    private toastController: ToastController
  ){
    this.getTasks();
  }

  ionViewDidEnter() {
    this.getTasks();
  }

  deleteTaskConfirmed(taskId:number){
    this._taskService.deleteTask(taskId).subscribe(
      (result:Itask) => {
        this.presentToast('success', `Task ${result.title} deleted successfully`);
        this.getTasks();
      },
      (error:any) => {
        this.presentToast('danger', "Error deleting the task: " + error.message);
      }
    );
  }

  async presentToast(color:string, message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'middle',
      color: color
    });

    await toast.present();
  }


  setPriorityColor(priorityLevel: string){
    switch (priorityLevel) {
      case 'LOW': return 'secondary';
      case 'MEDIUM': return 'dark';
      case 'HIGH': return 'warning';
      case 'CRITICAL':return 'danger';
      default: return '';
    }
  }

}
