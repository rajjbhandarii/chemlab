import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'lab',
    loadComponent: () => import('./pages/lab/lab.component').then(m => m.LabComponent)
  },
  {
    path: 'chemicals',
    loadComponent: () => import('./pages/chemicals/chemicals.component').then(m => m.ChemicalsComponent)
  },
  {
    path: 'chemicals/:id',
    loadComponent: () => import('./pages/chemical-detail/chemical-detail.component').then(m => m.ChemicalDetailComponent)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizComponent)
  },
  {
    path: 'equation-balancer',
    loadComponent: () => import('./pages/equation-balancer/equation-balancer.component').then(m => m.EquationBalancerComponent)
  },
  {
    path: 'safety-checker',
    loadComponent: () => import('./pages/safety-checker/safety-checker.component').then(m => m.SafetyCheckerComponent)
  },
  {
    path: 'calculators',
    loadComponent: () => import('./pages/calculators/calculators.component').then(m => m.CalculatorsComponent)
  },
  {
    path: 'learn',
    loadComponent: () => import('./pages/learn/learn.component').then(m => m.LearnComponent)
  },
  {
    path: 'learn/:topic',
    loadComponent: () => import('./pages/learn-topic/learn-topic.component').then(m => m.LearnTopicComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
