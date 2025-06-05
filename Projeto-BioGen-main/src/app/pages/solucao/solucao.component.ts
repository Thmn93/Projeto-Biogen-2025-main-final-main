// sobre-solucao.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Adicione esta importação




@Component({
  selector: 'app-sobre-solucao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solucao.component.html',
  styleUrls: ['./solucao.component.css'], 
})
export class SolucaoComponent implements OnInit {

  
  // Dados dos ODS para exibição
  odsItems = [
    {
      numero: 7,
      titulo: 'Energia Limpa e Acessível',
      descricao: 'Garantir o acesso a fontes de energia confiáveis, sustentáveis e modernas para todos.',
      icone: 'fa-bolt'
    },
    {
      numero: 10,
      titulo: 'Redução das Desigualdades',
      descricao: 'Reduzir as desigualdades dentro dos países e entre eles.',
      icone: 'fa-balance-scale'
    },
    {
      numero: 12,
      titulo: 'Consumo e Produção Responsáveis',
      descricao: 'Assegurar padrões de produção e de consumo sustentáveis.',
      icone: 'fa-recycle'
    },
    {
      numero: 13,
      titulo: 'Ação contra a Mudança Global do Clima',
      descricao: 'Tomar medidas urgentes para combater a mudança do clima e seus impactos.',
      icone: 'fa-cloud'
    }
  ];

  // Funcionalidades principais
  funcionalidades = [
    {
      titulo: 'Cadastro de Fornecedores',
      descricao: 'Gerenciamento completo de fornecedores de material orgânico para o processo de biodigestão.',
      icone: 'fa-industry'
    },
    {
      titulo: 'Cadastro de Beneficiários',
      descricao: 'Registro e acompanhamento das famílias de baixa renda beneficiadas com energia limpa.',
      icone: 'fa-users'
    },
    {
      titulo: 'Controle de Material Orgânico Processado',
      descricao: 'Monitoramento do fluxo de materiais orgânicos desde a coleta até o processamento final.',
      icone: 'fa-leaf'
    },
    {
      titulo: 'Gestão de Biodigestores',
      descricao: 'Acompanhamento em tempo real da operação e eficiência dos biodigestores.',
      icone: 'fa-cogs'
    }
  ];

  // Benefícios para cada público
  beneficios = [
    {
      publico: 'Moradores de Baixa Renda',
      lista: [
        'Acesso a energia elétrica limpa e de baixo custo',
        'Redução de gastos com energia elétrica',
        'Contribuição para a sustentabilidade ambiental'
      ],
      icone: 'fa-home'
    },
    {
      publico: 'Fornecedores',
      lista: [
        'Acesso a um sistema de gestão de desempenho do biodigestor',
        'Abatimento de impostos por meio do programa social',
        'Rastreabilidade completa do material fornecido',
        'Relatórios de impacto ambiental e social'
      ],
      icone: 'fa-truck'
    }
  ];

  constructor() { 
  }

  ngOnInit(): void {
  }
}