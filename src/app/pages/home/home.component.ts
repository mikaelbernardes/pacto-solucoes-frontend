import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vacancy, VacancysService } from '../../services/vacancy.service';
import { ApplicationService, type Application } from '../../services/application.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  isRecruiter: boolean = false;
  allVacancies: Vacancy[] = [];
  filteredVacancy: Vacancy[] = [];
  private searchSubject = new Subject<string>();
  applications: Application[] = [];

  constructor(
    private router: Router,
    private vacancyService: VacancysService,
    private applicationService: ApplicationService
  ) {
    const userRole = sessionStorage.getItem('role');
    this.isRecruiter = userRole === 'RECRUITER';

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.filterVacancies(term);
      });
  }

  ngOnInit() {
    this.loadVacancies();
  }

  private loadVacancies() {
    const userId = sessionStorage.getItem('id');

    if (this.isRecruiter && userId) {
      this.vacancyService.getVacanciesByRecruiterId(Number(userId)).subscribe({
        next: (vacancies) => {
          this.allVacancies = vacancies;
          this.filteredVacancy = vacancies;
        },
        error: (error) => {
          console.error('Erro ao buscar vagas do recrutador:', error);
        }
      });
    } else if (userId) {
      this.applicationService.getUserApplications(Number(userId)).subscribe({
        next: (applications) => {
          this.applications = applications;
          this.loadAllVacancies();
        },
        error: (error) => {
          console.error('Erro ao buscar candidaturas:', error);
          this.loadAllVacancies();
        }
      });
    }
  }

  private loadAllVacancies() {
    this.vacancyService.getAllVacancies().subscribe({
      next: (vacancies) => {
        this.allVacancies = vacancies.map(vacancy => ({
          ...vacancy,
          hasApplied: this.applications.some(app => app.vacancy.id === vacancy.id)
        }));
        this.filteredVacancy = this.allVacancies;
      },
      error: (error) => {
        console.error('Erro ao buscar todas as vagas:', error);
      }
    });
  }

  onSearch(event: string) {
    this.searchSubject.next(event);
  }

  navigateToNewVacancy() {
    this.router.navigate(['/new-vacancy']);
  }

  private filterVacancies(term: string) {
    if (!term) {
      this.filteredVacancy = this.allVacancies;
      return;
    }

    term = term.toLowerCase();
    this.filteredVacancy = this.allVacancies.filter(vacancy =>
      vacancy.title.toLowerCase().includes(term) ||
      vacancy.description.toLowerCase().includes(term) ||
      vacancy.requirements.some(req => req.toLowerCase().includes(term))
    );
  }

  handleCardClick(job: Vacancy) {
    if (this.isRecruiter) {
      this.router.navigate(['/new-vacancy', job.id]);
    } else {
      this.router.navigate(['/new-vacancy', job.id, 'apply']);
    }
  }

  applyToVacancy(event: Event, jobId: number) {
    event.stopPropagation();

    if (this.applications.some(app => app.vacancy.id === jobId)) {
      alert('Você já está candidatado para esta vaga!');
      return;
    }

    if (confirm('Deseja se candidatar para esta vaga?')) {
      this.vacancyService.applyToVacancy(jobId).subscribe({
        next: () => {
          const userId = sessionStorage.getItem('id');
          const userName = sessionStorage.getItem('name');
          const userEmail = sessionStorage.getItem('email');

          if (userId && userName && userEmail) {
            this.applications.push({
              id: 0, // ID será gerado pelo backend
              vacancy: { id: jobId },
              user: {
                id: Number(userId),
                name: userName,
                email: userEmail
              },
              status: 'UNDER_REVIEW'
            });
          }

          const job = this.allVacancies.find(v => v.id === jobId);
          if (job) {
            job.hasApplied = true;
          }
          const filteredJob = this.filteredVacancy.find(v => v.id === jobId);
          if (filteredJob) {
            filteredJob.hasApplied = true;
          }
        },
        error: (error) => {
          console.error('Erro ao se candidatar:', error);
        }
      });
    }
  }
}
