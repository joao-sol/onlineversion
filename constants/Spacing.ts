// Sistema de Design - Valores de Espaçamento
// Valores consistentes de padding, margin, gap e tipografia

export const Spacing = {
  // Unidades base de espaçamento
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  
  // Casos de uso específicos
  cardPadding: 16,
  screenPadding: 16,
  cardMargin: 12,
  iconSize: {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 80,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  
  // Tamanhos de fonte
  fontSize: {
    xs: 12,       // Texto extra pequeno (rótulos, legendas)
    sm: 13,       // Texto pequeno (duração, metadados)
    base: 14,     // Texto base (corpo, descrições, botões secundários)
    md: 15,       // Texto médio (descrições com ênfase)
    lg: 16,       // Texto grande (botões primários, texto importante)
    xl: 18,       // Extra grande (títulos de seção, cabeçalhos)
    xxl: 20,      // 2X grande (títulos de tela, estados vazios)
    xxxl: 28,     // 3X grande (títulos principais, texto hero)
  },
  
  // Pesos de fonte
  fontWeight: {
    normal: 'normal' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
  
  // Valores de gap (para propriedade gap do flexbox)
  gap: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 12,
  },
};

export default Spacing;
