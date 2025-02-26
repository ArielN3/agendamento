document.addEventListener('DOMContentLoaded', function() {
    // Dados dos cortes e serviços
    const haircuts = [
      { id: 'corte-simples', name: 'Corte Simples', price: 30 },
      { id: 'corte-degrade', name: 'Corte Degradê', price: 40 },
      { id: 'corte-navalhado', name: 'Corte Navalhado', price: 45 },
      { id: 'corte-social', name: 'Corte Social', price: 35 },
      { id: 'corte-infantil', name: 'Corte Infantil', price: 25 }

      
    ];
  
    const services = [
      { id: 'barba', name: 'Barba', price: 20 },
      { id: 'sobrancelha', name: 'Sobrancelha', price: 15 },
      { id: 'hidratacao', name: 'Hidratação', price: 25 },
      { id: 'coloracao', name: 'Coloração', price: 50 }
    ];
  
    // Elementos do DOM
    const haircutsList = document.getElementById('haircutsList');
    const servicesList = document.getElementById('servicesList');
    const totalPrice = document.getElementById('totalPrice');
    const appointmentForm = document.getElementById('appointmentForm');
  
    // Variáveis para armazenar as seleções
    let selectedHaircut = '';
    let selectedServices = [];
  
    // Renderizar lista de cortes
    haircuts.forEach(haircut => {
      const haircutItem = document.createElement('div');
      haircutItem.className = 'haircut-item';
      haircutItem.innerHTML = `
        <input type="radio" id="${haircut.id}" name="haircut" value="${haircut.id}" required>
        <label for="${haircut.id}">${haircut.name}</label>
        <span class="price">R$ ${haircut.price.toFixed(2)}</span>
      `;
      haircutsList.appendChild(haircutItem);
  
      // Adicionar evento de change para atualizar o total
      const radioInput = haircutItem.querySelector('input[type="radio"]');
      radioInput.addEventListener('change', function() {
        if (this.checked) {
          selectedHaircut = this.value;
          updateTotal();
        }
      });
    });
  
    // Renderizar lista de serviços adicionais
    services.forEach(service => {
      const serviceItem = document.createElement('div');
      serviceItem.className = 'service-item';
      serviceItem.innerHTML = `
        <input type="checkbox" id="${service.id}" name="${service.id}" value="${service.id}">
        <label for="${service.id}">${service.name}</label>
        <span class="price">R$ ${service.price.toFixed(2)}</span>
      `;
      servicesList.appendChild(serviceItem);
  
      // Adicionar evento de change para atualizar o total
      const checkboxInput = serviceItem.querySelector('input[type="checkbox"]');
      checkboxInput.addEventListener('change', function() {
        if (this.checked) {
          if (!selectedServices.includes(this.value)) {
            selectedServices.push(this.value);
          }
        } else {
          selectedServices = selectedServices.filter(id => id !== this.value);
        }
        updateTotal();
      });
    });
  
    // Função para calcular e atualizar o total
    function updateTotal() {
      let total = 0;
  
      // Adicionar preço do corte selecionado
      if (selectedHaircut) {
        const haircut = haircuts.find(h => h.id === selectedHaircut);
        if (haircut) {
          total += haircut.price;
        }
      }
  
      // Adicionar preço dos serviços adicionais selecionados
      selectedServices.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) {
          total += service.price;
        }
      });
  
      // Atualizar o elemento de total
      totalPrice.textContent = `R$ ${total.toFixed(2)}`;
    }
  
    // Manipular o envio do formulário
    appointmentForm.addEventListener('submit', function(e) {
      e.preventDefault();
  
      // Obter valores do formulário
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const notes = document.getElementById('notes').value;
  
      // Obter nome do corte selecionado
      const selectedHaircutName = haircuts.find(h => h.id === selectedHaircut)?.name || '';
  
      // Obter nomes dos serviços adicionais selecionados
      const selectedServicesNames = selectedServices
        .map(serviceId => services.find(s => s.id === serviceId)?.name || '')
        .filter(name => name)
        .join(', ');
  
      // Calcular total
      let total = 0;
      if (selectedHaircut) {
        const haircut = haircuts.find(h => h.id === selectedHaircut);
        if (haircut) total += haircut.price;
      }
      selectedServices.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (service) total += service.price;
      });
  
      // Formatar a mensagem para o WhatsApp
      const message = `
  *Agendamento de Corte*
  Nome: ${name}
  Telefone: ${phone}
  Data: ${formatDate(date)}
  Horário: ${time}
  Corte: ${selectedHaircutName}
  Serviços adicionais: ${selectedServicesNames || 'Nenhum'}
  Observações: ${notes || 'Nenhuma'}
  Total: R$ ${total.toFixed(2)}
      `.trim();
  
      // Abrir WhatsApp com a mensagem
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/556181227195?text=${encodedMessage}`, '_blank');
      
    });
  
    // Função para formatar a data (de YYYY-MM-DD para DD/MM/YYYY)
    function formatDate(dateString) {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    }
  });