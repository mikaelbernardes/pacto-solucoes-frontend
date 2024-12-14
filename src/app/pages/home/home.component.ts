import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vacancy, VacancysService } from '../../services/vacancy.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  searchTerm: string = '';
  isRecruiter: boolean = false;
  allVacancies: Vacancy[] = [];
  filteredVacancy: Vacancy[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private vacancyService: VacancysService
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
    } else {
      // Se for candidato, busca todas as vagas
      this.vacancyService.getAllVacancies().subscribe({
        next: (vacancies) => {
          this.allVacancies = vacancies;
          this.filteredVacancy = vacancies;
        },
        error: (error) => {
          console.error('Erro ao buscar todas as vagas:', error);
        }
      });
    }
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
    }
  }
}
