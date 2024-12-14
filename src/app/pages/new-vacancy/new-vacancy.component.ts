import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { VacancysService } from '../../services/vacancy.service';
import { ApplicationService, Application } from '../../services/application.service';

interface ApplicationStatus {
  UNDER_REVIEW: string;
  ACCEPTED: string;
  REJECTED: string;
  [key: string]: string;
}

@Component({
  selector: 'app-new-vacancy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-vacancy.component.html',
  styleUrl: './new-vacancy.component.scss'
})
export class NewVacancyComponent implements OnInit {
  vacancyForm: FormGroup;
  requirements: string[] = [];
  newRequirement: string = '';
  isEditing: boolean = false;
  vacancyId?: number;
  statusOptions = [
    { value: 'OPEN', label: 'Aberta' },
    { value: 'CLOSED', label: 'Fechada' }
  ];
  isViewOnly: boolean = false;
  hasApplied: boolean = false;
  currentApplication?: Application;
  applications: {name: string; login: string;}[] = [];

  readonly applicationStatus: ApplicationStatus = {
    'UNDER_REVIEW': 'Em análise',
    'ACCEPTED': 'Aceito',
    'REJECTED': 'Rejeitado'
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private vacancyService: VacancysService,
    private applicationService: ApplicationService
  ) {
    this.vacancyForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      newRequirement: [''],
      status: ['OPEN', [Validators.required]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const isApplyMode = this.route.snapshot.url.some(segment => segment.path === 'apply');

    if (id) {
      this.vacancyId = Number(id);
      if (isApplyMode) {
        this.isViewOnly = true;
        this.checkApplicationStatus();
        this.loadVacancyForView(this.vacancyId);
      } else {
        this.isEditing = true;
        this.loadVacancy(this.vacancyId);
        this.loadVacancyApplications();
      }
    }
  }

  private loadVacancy(id: number) {
    this.vacancyService.getVacancyById(id).subscribe({
      next: (vacancy) => {
        this.vacancyForm.patchValue({
          title: vacancy.title,
          description: vacancy.description,
          status: vacancy.status
        });
        this.requirements = [...vacancy.requirements];
      },
      error: (error) => {
        console.error('Erro ao carregar vaga:', error);
      }
    });
  }

  private loadVacancyForView(id: number) {
    this.vacancyService.getVacancyById(id).subscribe({
      next: (vacancy) => {
        this.vacancyForm.patchValue({
          title: vacancy.title,
          description: vacancy.description,
          status: vacancy.status
        });
        this.requirements = [...vacancy.requirements];
        this.vacancyForm.disable(); // Desabilita todos os campos
      },
      error: (error) => {
        console.error('Erro ao carregar vaga:', error);
      }
    });
  }

  private checkApplicationStatus() {
    const userId = sessionStorage.getItem('id');
    if (userId && this.vacancyId) {
      this.applicationService.getUserApplications(Number(userId)).subscribe({
        next: (applications) => {
          const application = applications.find(app => app.vacancy.id === this.vacancyId);
          if (application) {
            this.hasApplied = true;
            this.currentApplication = application;
          }
        },
        error: (error) => {
          console.error('Erro ao verificar status da candidatura:', error);
        }
      });
    }
  }

  private loadVacancyApplications() {
    if (this.vacancyId) {
      this.applicationService.getVacancyApplications(this.vacancyId).subscribe({
        next: (applications) => {
          console.log('Applications:', applications);
          this.applications = applications;
        },
        error: (error) => {
          console.error('Erro ao carregar candidaturas:', error);
        }
      });
    }
  }

  get isFormValid(): boolean {
    return this.vacancyForm.valid && this.requirements.length > 0;
  }

  addRequirement() {
    if (this.vacancyForm.get('newRequirement')?.value?.trim()) {
      this.requirements.push(this.vacancyForm.get('newRequirement')?.value.trim());
      this.vacancyForm.get('newRequirement')?.setValue('');
    }
  }

  removeRequirement(index: number) {
    this.requirements.splice(index, 1);
  }

  onSubmit() {
    if (this.isFormValid) {
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        console.error('Usuário não está logado');
        return;
      }

      const formData = {
        title: this.vacancyForm.get('title')?.value,
        description: this.vacancyForm.get('description')?.value,
        requirements: this.requirements,
        status: this.vacancyForm.get('status')?.value,
        user: {
          id: Number(userId)
        }
      };

      if (this.isEditing && this.vacancyId) {
        this.vacancyService.updateVacancy(this.vacancyId, formData).subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Erro ao atualizar vaga:', error);
          }
        });
      } else {
        this.vacancyService.createVacancy(formData).subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Erro ao criar vaga:', error);
          }
        });
      }
    }
  }

  deleteVacancy() {
    if (this.vacancyId && confirm('Tem certeza que deseja excluir esta vaga?')) {
      this.vacancyService.deleteVacancy(this.vacancyId).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Erro ao excluir vaga:', error);
        }
      });
    }
  }

  applyToVacancy() {
    if (this.vacancyId) {
      this.vacancyService.applyToVacancy(this.vacancyId).subscribe({
        next: () => {
          this.hasApplied = true;
        },
        error: (error) => {
          console.error('Erro ao se candidatar:', error);
        }
      });
    }
  }
}
