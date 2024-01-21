import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonDatetimeButton, IonModal, IonDatetime, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonButton, IonText } from '@ionic/angular/standalone';
import { TasksService } from '../services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import { Itask } from '../interfaces/itask';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-task-form',
  templateUrl: 'task-form.page.html',
  styleUrls: ['task-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    FormsModule, 
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonInput,
    IonDatetimeButton,
    IonModal,
    IonDatetime,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonText
  ]
})
export class TaskFormPage {

  title: string = 'New task';
  taskId: number = 0;
  tasksForm!: FormGroup;
  priorityLevels!: string[];
  progressLevels!: string[];
  status_message: {type: string, message: string, show: boolean} = {type: '', message: '', show: false};
  date_locale!: string;

  constructor(private formBuilder: FormBuilder, private _taskService: TasksService, private route: ActivatedRoute, private toastController: ToastController){
    this.priorityLevels = _taskService.getPriorityLevel();
    this.progressLevels = _taskService.getProgressLevel();
    const defaultDateNow = new Date();

    this.checkEdit();

    this.tasksForm = formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      task_date: [defaultDateNow.toISOString()],
      priority_level: ['', [Validators.required]],
      progress_level: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  checkEdit(){
    const taskId = this.route.snapshot.paramMap.get('task-id');
    
    if(taskId){
      this.title = 'Edit task';
      this.taskId = parseInt(taskId);

      this._taskService.getTask(this.taskId).subscribe(
        (result:Itask) => {
          this.tasksForm.patchValue(result);
          let task_date = new Date(result.task_date);
          this.tasksForm.patchValue({'task_date': task_date.toISOString().substring(0, 10)});
        },
        (error:any) => {
          this.presentToast('danger', "Error fetching the task information: " + error.message);
        }
      )
    }
  }

  submitForm(){
    document.getElementById('status-messages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if(!this.tasksForm.valid){
      this.presentToast('warning', "THE FORM DID NOT PASS ALL THE VALIDATIONS!");
    }else{
      (this.taskId === 0) ? this.createTask() : this.updateTask();
    }
  }

  createTask(){
    this._taskService.createTask(this.tasksForm.value).subscribe(
      (result:Itask) => {
        this.presentToast('success', "Task created successfully");
      },
      (error:any) => {
        this.presentToast('danger', "Error creating the task: " + error.message);
      }
    );
    this.tasksForm.reset();
  }

  updateTask(){
    this._taskService.updateTask(this.taskId, this.tasksForm.value).subscribe(
      (result:Itask) => {
        this.presentToast('success', "Task updated successfully");
      },
      (error:any) => {
        this.presentToast('danger', "Error creating the task: " + error.message);
      }
    );
  }

  async presentToast(color:string, message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
      color: color
    });

    await toast.present();
  }

  get titleFormControl(){
    return this.tasksForm.get('title')!;
  }
  get categoryFormControl(){
    return this.tasksForm.get('category')!;
  }
  get dueDateFormControl(){
    return this.tasksForm.get('task_date')!;
  }
  get priorityLevelFormControl(){
    return this.tasksForm.get('priority_level')!;
  }
  get progressLevelFormControl(){
    return this.tasksForm.get('progress_level')!;
  }
  get descriptionFormControl(){
    return this.tasksForm.get('description')!;
  }

}
