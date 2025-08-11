# 📋 Documentación del Simulador de Costos Energéticos

## 🎯 Descripción del Proyecto

El **Simulador de Costos Energéticos para el Caribe Colombiano** es una herramienta web educativa diseñada para ayudar a los usuarios a calcular cuánto podrían ahorrar en su factura de energía eléctrica si migran a energías renovables. La aplicación está enfocada en hogares vulnerables de la región Caribe y utiliza valores predeterminados basados en datos reales de cinco municipios principales.

## 🌟 Objetivo Principal

Reducir las tarifas de energía y concientizar a la población sobre los beneficios de las energías renovables, proporcionando una herramienta simple y visual que permita:

- Simular ahorros económicos potenciales
- Educar sobre energías limpias
- Promover la adopción de tecnologías renovables
- Calcular el impacto ambiental positivo

## 🏗️ Estructura del Proyecto

```
Proyecto-Hackathon/
├── css/
│   └── style.css            # Estilos y diseño visual con efectos avanzados
├── img/
│   └── img1.jpg             # Recursos visuales del proyecto
├── js/
│   └── calculator.js        # Lógica completa de cálculos y UX
├── index.html               # Página principal integrada con calculadora
└── DOCUMENTACION.md         # Este archivo de documentación
```

## 🚀 Funcionalidades Principales

### 1. **Selección de Municipio**
- Lista desplegable con 5 municipios del Caribe colombiano
- Cada municipio tiene datos específicos:
  - Consumo promedio (kWh)
  - Costo promedio (pesos)
  - Tarifa por kWh
  - Porcentaje de ahorro estimado
### 2. **Input de Datos del Usuario**
- **Consumo actual**: Campo para ingresar kWh mensuales
- **Costo actual**: Campo para ingresar el valor de la factura
- **Lógica de exclusión mutua**: Solo se puede llenar uno de los dos campos

### 3. **Cálculos Automáticos**
- Si se ingresa consumo → calcula y muestra costo estimado
- Si se ingresa costo → calcula y muestra consumo estimado
- Auto-completado con datos promedio del municipio seleccionado

### 4. **Resultados de Simulación**
- **Situación Actual**: Costo mensual actual
- **Con Energías Renovables**: Costo mensual estimado
- **Ahorro Mensual**: Diferencia económica y porcentaje
- **Tu Consumo**: kWh mensuales utilizados (nuevo)
- **kWh Ahorrados**: Energía que se dejaría de consumir de la red (nuevo)
- **Proyección Anual**: Ahorro económico anualizado
### 5. **Información Educativa**
- Datos detallados del municipio seleccionado
- **Mensajes aleatorios dinámicos** sobre beneficios de energías renovables
- Información sobre impacto ambiental estimado
- **Sección de beneficios**: Se muestra solo después de calcular

## 💻 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible con elementos modernos
- **CSS3 Avanzado**: 
  - Grid Layout y Flexbox para diseño responsivo
  - Gradientes y efectos glassmorphism
  - Animaciones keyframe y transiciones
  - Variables CSS para consistencia
  - Media queries para responsividad
- **JavaScript ES6+**: 
  - Funciones arrow y destructuring
  - Template literals para strings dinámicos
  - Event listeners modernos
  - Manipulación avanzada del DOM
  - Formateo de moneda internacional
- **Git**: Control de versiones integrado
- **Sin frameworks**: Aplicación vanilla optimizada para rendimiento

## 📊 Dataset de Municipios

La aplicación incluye datos de 5 municipios del Caribe colombiano:

| Municipio    | Consumo Promedio | Costo Promedio | Ahorro Estimado | Tarifa kWh |
|--------------|------------------|----------------|-----------------|------------|
| Riohacha     | 180 kWh         | $90,000        | 25%             | $500       |
| Barrancas    | 150 kWh         | $75,000        | 30%             | $500       |
| Valledupar   | 220 kWh         | $110,000       | 20%             | $500       |
| Santa Marta  | 170 kWh         | $85,000        | 22%             | $500       |
| Soledad      | 200 kWh         | $100,000       | 28%             | $500       |

## 🔧 Lógica de Funcionamiento

### Flujo Principal:
1. **Selección de municipio** → Carga datos específicos
2. **Input de usuario** → Consumo O costo (mutuamente excluyentes)
3. **Cálculo automático** → Estima el valor faltante
4. **Procesamiento** → Aplica fórmulas de ahorro
5. **Resultados** → Muestra simulación completa

### Fórmulas de Cálculo:

```javascript
// Cálculo de consumo a partir del costo
consumoEstimado = costoActual / tarifaKwh

// Cálculo de costo a partir del consumo
costoEstimado = consumoActual * tarifaKwh

// Cálculo de ahorro
ahorroMensual = (costoActual * porcentajeAhorro) / 100
costoConRenovables = costoActual - ahorroMensual

// Proyección anual
ahorroAnual = ahorroMensual * 12

// Impacto ambiental (estimación)
kwhAhorrados = (consumoFinal * porcentajeAhorro) / 100
co2Reducido = kwhAhorrados * 0.5 * 12 // kg CO₂ por año
```

## 🎨 Características de UX/UI

### Diseño Visual:
- **Gradientes modernos**: Fondo con degradado púrpura-azul
- **Glassmorphism**: Efectos de cristal con transparencias y blur
- **Paleta de colores**: Verde (renovables), azul (información), rojo (situación actual)
- **Tarjetas diferenciadas**: Cada tipo de resultado tiene bordes de colores específicos
- **Tipografía moderna**: Segoe UI con diferentes pesos y tamaños
- **Recursos visuales**: Carpeta `img/` con elementos gráficos de apoyo

### Interactividad Avanzada:
- **Efectos hover sofisticados**: Elevación y escalado en tarjetas
- **Transiciones fluidas**: Animaciones CSS con easing natural
- **Estados visuales claros**: Campos deshabilitados con clase `.input-disabled`
- **Feedback inmediato**: Placeholders dinámicos con valores calculados
- **Scroll automático**: Navegación suave a resultados
- **Validación visual**: Estados de error con colores y mensajes claros

### Características Técnicas del CSS:
- **Grid Layout responsivo**: Adaptación automática a diferentes pantallas
- **Animaciones keyframe**: `fadeInUp` para aparición de resultados
- **Loading states**: Botón con spinner animado durante procesamiento
- **Backdrop filters**: Efectos de desenfoque en elementos flotantes
- **Box shadows múltiples**: Profundidad visual en capas

### Accesibilidad:
- **Labels descriptivos**: Cada campo tiene instrucciones claras
- **Textos de ayuda**: Información contextual para usuarios
- **Mensajes de error**: Retroalimentación clara sobre problemas
- **Navegación por teclado**: Formulario accesible

## 📱 Experiencia de Usuario

### Flujo Típico Actualizado:
1. **Llegada**: Usuario accede a la página integrada con diseño moderno
2. **Selección**: Elige su municipio (placeholder se actualiza automáticamente)
3. **Input exclusivo**: Ingresa **solo** consumo mensual O costo de factura
4. **Feedback visual**: Ve el campo contrario deshabilitado con valor estimado
5. **Cálculo**: Presiona "Calcular Ahorro" con animación de loading
6. **Resultados**: Obtiene simulación en 5 tarjetas diferenciadas por colores
7. **Educación**: Aparece mensaje motivacional aleatorio sobre energías renovables
8. **Exploración**: Puede revisar información detallada del municipio

### Prevención de Errores Mejorada:
- **Exclusión mutua estricta**: Solo un campo activo, el otro se limpia automáticamente
- **Validación de municipio obligatorio** antes del cálculo
- **Valores mínimos** en campos numéricos (no negativos)
- **Limpieza automática** de campos deshabilitados
- **Placeholders dinámicos** que muestran valores estimados en tiempo real
- **Estados visuales claros** con clase `.input-disabled`

## 🔄 Funciones Principales del Código

### `getFormData()` - Extracción Inteligente
- Extrae datos del formulario
- **Calcula consumo estimado** cuando solo hay costo ingresado
- **Calcula costo estimado** cuando solo hay consumo ingresado
- Retorna objeto con todos los valores necesarios para cálculos

### `calculateSavings()` - Motor de Cálculos
- Prioriza datos ingresados por usuario sobre promedios
- Utiliza **consumo estimado** si el usuario ingresó solo costo
- Aplica fórmulas específicas por municipio

### `displayResults()` - Actualización Visual
- Actualiza **5 tarjetas de resultados** diferenciadas
- Formatea valores monetarios en pesos colombianos
- Muestra consumo real vs. estimado

### `showBenefitMessage()` - Educación Dinámica
- Selecciona mensaje aleatorio de array de beneficios
- Se ejecuta **solo después** de presionar "Calcular Ahorro"
- Estilizado con clase `.renewable-benefit-message`

### Eventos de Input 
- **Exclusión mutua**: Deshabilita campo opuesto al escribir
- **Limpieza automática**: Borra contenido del campo deshabilitado
- **Placeholders dinámicos**: Muestra valores estimados

## 🌱 Impacto Social

### Beneficios Esperados:
- **Educación**: Aumentar conocimiento sobre energías renovables
- **Concientización**: Mostrar beneficios económicos tangibles
- **Accesibilidad**: Herramienta simple para hogares vulnerables
- **Motivación**: Incentivar adopción de tecnologías limpias

### Escalabilidad:
- Fácil adición de nuevos municipios
- Posibilidad de integrar datos reales de APIs
- Extensión a otras regiones de Colombia
- Integración con programas gubernamentales

---

*💚 Contribuyendo a un Caribe más sostenible y con menores costos energéticos*
