import { Chart } from 'chart.js/auto';
import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LancamentosService } from '../../../services/lancamento.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  anoAtual: number = 2024;

  dadosPorAno: any = {
    2022: this.inicializarDados(),
    2023: this.inicializarDados(),
    2024: this.inicializarDados(),
    2025: this.inicializarDados(),
    2026: this.inicializarDados(),
    2027: this.inicializarDados(),
  };

  formularios: FormGroup[] = [];
  formularioGeral!: FormGroup;

  modalAbertoIndex: number | null = null;
  modalGeralAberto: boolean = false;

  lineChart: any;
  pieChart: any;
  barChart: any;

  dadosTabela: any[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private lancamentosService: LancamentosService
  ) {
    this.meses.forEach(() => {
      this.formularios.push(this.fb.group({
        toneladas: [null, [Validators.required, Validators.min(0)]],
        energia: [null, [Validators.required, Validators.min(0)]],
        imposto: [null, [Validators.required, Validators.min(0)]]
      }));
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarLancamentos();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.criarGraficos();
    }
  }

  inicializarDados() {
    return {
      toneladas: Array(12).fill(null),
      energia: Array(12).fill(null),
      imposto: Array(12).fill(null),
    };
  }

  carregarLancamentos() {
    this.lancamentosService.getLancamentos().subscribe({
      next: (lancamentos) => {
        this.dadosPorAno = {
          2022: this.inicializarDados(),
          2023: this.inicializarDados(),
          2024: this.inicializarDados(),
        };

        lancamentos.forEach(lancamento => {
          if (this.dadosPorAno[lancamento.ano]) {
            const mesIndex = this.meses.indexOf(lancamento.mes);
            if (mesIndex !== -1) {
              this.dadosPorAno[lancamento.ano].toneladas[mesIndex] = lancamento.toneladasProcessadas;
              this.dadosPorAno[lancamento.ano].energia[mesIndex] = lancamento.energiaGerada;
              this.dadosPorAno[lancamento.ano].imposto[mesIndex] = lancamento.impostoAbatido;
            }
          }
        });

        this.atualizarGraficos();
        this.atualizarTabela();
      },
      error: (error) => console.error('Erro ao carregar lançamentos:', error)
    });
  }

  criarGraficos() {
    const lineCtx = document.getElementById('lineChart') as HTMLCanvasElement;
    this.lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: this.meses,
        datasets: [{
          label: 'Toneladas Processadas (Ton)',
          data: this.dadosPorAno[this.anoAtual].toneladas,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      },
    });

    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: this.meses,
        datasets: [{
          label: 'Energia Gerada (KW)',
          data: this.dadosPorAno[this.anoAtual].energia,
          backgroundColor: this.obterCoresPie()
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
    });

    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: this.meses,
        datasets: [{
          label: 'Imposto Abatido (R$)',
          data: this.dadosPorAno[this.anoAtual].imposto,
          backgroundColor: 'rgb(75, 192, 192)'
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } }
      },
    });
  }

  obterCoresPie() {
    return [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#36A2EB',
      '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];
  }

  aoMudarAno() {
    this.atualizarGraficos();
    this.atualizarTabela();
  }

  atualizarGraficos() {
    if (this.lineChart && this.pieChart && this.barChart) {
      this.lineChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].toneladas;
      this.lineChart.update();

      this.pieChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].energia;
      this.pieChart.update();

      this.barChart.data.datasets[0].data = this.dadosPorAno[this.anoAtual].imposto;
      this.barChart.update();
    }
  }

  atualizarTabela() {
    const anoSelecionado = this.anoAtual;
    this.dadosTabela = this.meses.map((mes, index) => ({
      mes,
      toneladas: this.dadosPorAno[anoSelecionado].toneladas[index],
      energia: this.dadosPorAno[anoSelecionado].energia[index],
      imposto: this.dadosPorAno[anoSelecionado].imposto[index],
    }));
  }

  abrirModal(index: number) {
    if (!this.formularios[index]) {
      this.formularios[index] = this.fb.group({
        toneladas: [0, [Validators.required, Validators.min(0)]],
        energia: [0, [Validators.required, Validators.min(0)]],
        imposto: [0, [Validators.required, Validators.min(0)]],
      });
    }

    this.formularios[index].patchValue({
      toneladas: this.dadosPorAno[this.anoAtual].toneladas[index] || 0,
      energia: this.dadosPorAno[this.anoAtual].energia[index] || 0,
      imposto: this.dadosPorAno[this.anoAtual].imposto[index] || 0
    });

    this.modalAbertoIndex = index;
  }

  fecharModal() {
    this.modalAbertoIndex = null;
  }

  aoEnviar(index: number) {
    if (this.formularios[index].valid) {
      const formData = this.formularios[index].value;

      this.lancamentosService.criarLancamento({
        ano: this.anoAtual,
        mes: this.meses[index],
        toneladas: formData.toneladas,
        energia: formData.energia,
        imposto: formData.imposto
      }).subscribe({
        next: () => {
          this.carregarLancamentos();
          this.fecharModal();
        },
        error: (error) => {
          console.error('Erro ao criar lançamento:', error);
          alert('Erro ao salvar os dados. Tente novamente.');
        }
      });
    }
  }

  abrirModalGeral() {
    this.formularioGeral = this.fb.group({
      mes: ['', Validators.required],
      toneladas: [0, [Validators.required, Validators.min(0)]],
      energia: [0, [Validators.required, Validators.min(0)]],
      imposto: [0, [Validators.required, Validators.min(0)]],
    });
    this.modalGeralAberto = true;
  }

  fecharModalGeral() {
    this.modalGeralAberto = false;
  }

  aoEnviarGeral() {
    if (this.formularioGeral.valid) {
      const dados = this.formularioGeral.value;

      const novoLancamento = {
        ano: this.anoAtual,
        mes: dados.mes,
        toneladas: dados.toneladas,
        energia: dados.energia,
        imposto: dados.imposto,
      };

      this.lancamentosService.criarLancamento(novoLancamento).subscribe({
        next: () => {
          this.carregarLancamentos();
          this.fecharModalGeral();
        },
        error: (error) => {
          console.error('Erro ao criar lançamento:', error);
          alert('Erro ao salvar os dados. Tente novamente.');
        }
      });
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  }

}
