// admin-panel.js - Скрипт для управления объединенной формой
document.addEventListener('DOMContentLoaded', function() {
  // Переключение табов
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Удаляем активный класс у всех табов и контента
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Добавляем активный класс к выбранному табу
      this.classList.add('active');

      // Показываем соответствующий контент
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Получение ID пользователя
  const userId = document.body.dataset.userId || '';

  // ========== УПРАВЛЕНИЕ ЖИВОТНЫМИ ==========
  // Инициализация из forms.js
  if (window.initAnimalsForm) {
    window.initAnimalsForm();
  } else {
    console.log('Функция initAnimalsForm не найдена');
  }

  // ========== УПРАВЛЕНИЕ УСЛУГАМИ ==========
  const serviceForm = document.getElementById('serviceForm');
  const servicesList = document.getElementById('servicesList');

  // Загрузка услуг
  async function loadServices() {
    try {
      const response = await fetch('/services');
      const services = await response.json();

      servicesList.innerHTML = '';
      services.forEach(addServiceToList);
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error);
      showNotification('Не удалось загрузить услуги', 'error');
    }
  }

  // Добавление услуги в список
  function addServiceToList(service) {
    const li = document.createElement('li');
    li.id = `service-${service.id}`;
    li.innerHTML = `
      <div class="entity-info">
        <strong>${service.name}</strong>: ${service.description} — ${service.price}₽
      </div>
      <div class="entity-actions">
        <button class="edit-btn" data-id="${service.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${service.id}"><i class="fas fa-trash-alt"></i></button>
      </div>
      <form class="edit-form" id="edit-form-${service.id}" style="display: none;">
        <input type="hidden" name="id" value="${service.id}">
        <div class="form-row">
          <div class="form-group">
            <label for="edit-name-${service.id}">Название</label>
            <input type="text" id="edit-name-${service.id}" name="name" value="${service.name}" required>
          </div>
          <div class="form-group">
            <label for="edit-price-${service.id}">Цена</label>
            <input type="number" id="edit-price-${service.id}" name="price" value="${service.price}" required>
          </div>
        </div>
        <div class="form-group">
          <label for="edit-description-${service.id}">Описание</label>
          <textarea id="edit-description-${service.id}" name="description" required>${service.description}</textarea>
        </div>
        <button type="submit">Сохранить</button>
      </form>
    `;

    servicesList.appendChild(li);

    // Назначаем обработчики для кнопок
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    const editForm = li.querySelector('.edit-form');

    editBtn.addEventListener('click', () => {
      editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    });

    deleteBtn.addEventListener('click', () => {
      showDeleteConfirmation(service.id, service.name, 'service');
    });

    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const data = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price'))
      };

      try {
        const response = await fetch(`/services/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          showNotification(`Услуга "${data.name}" обновлена`);
          li.classList.add('highlight');
          editForm.style.display = 'none';

          // Обновляем информацию в списке
          const infoDiv = li.querySelector('.entity-info');
          infoDiv.innerHTML = `<strong>${data.name}</strong>: ${data.description} — ${data.price}₽`;
        } else {
          showNotification('Ошибка при обновлении услуги', 'error');
        }
      } catch (error) {
        console.error('Ошибка при обновлении:', error);
        showNotification('Ошибка соединения с сервером', 'error');
      }
    });
  }

  // Добавление новой услуги
  if (serviceForm) {
    serviceForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(serviceForm);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price'))
      };

      try {
        const response = await fetch('/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          showNotification(`Услуга "${data.name}" добавлена`);
          serviceForm.reset();
          addServiceToList(result);
        } else {
          const error = await response.json();
          showNotification(`Ошибка: ${error.message || 'Не удалось добавить услугу'}`, 'error');
        }
      } catch (error) {
        console.error('Ошибка при добавлении:', error);
        showNotification('Ошибка соединения с сервером', 'error');
      }
    });
  }

  // Удаление услуги
  async function deleteService(serviceId) {
    try {
      const response = await fetch(`/services/${serviceId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const serviceElement = document.getElementById(`service-${serviceId}`);
        if (serviceElement) {
          serviceElement.remove();
          showNotification('Услуга успешно удалена');
        }
      } else {
        const error = await response.json();
        showNotification(`Ошибка удаления: ${error.message || 'Неизвестная ошибка'}`, 'error');
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      showNotification('Ошибка соединения с сервером', 'error');
    }
  }

  // ========== УПРАВЛЕНИЕ ЗАПИСЯМИ ==========
  const appointmentForm = document.getElementById('appointmentForm');
  const appointmentsList = document.getElementById('appointmentsList');

  // Загрузка записей
  async function loadAppointments() {
    if (!userId) {
      console.error('ID пользователя отсутствует!');
      return;
    }

    try {
      const response = await fetch(`/appointments?userId=${userId}`);
      const appointments = await response.json();

      appointmentsList.innerHTML = '';
      appointments.forEach(addAppointmentToList);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
      showNotification('Не удалось загрузить записи на прием', 'error');
    }
  }

  // Добавление записи в список
  function addAppointmentToList(appointment) {
    // Форматирование даты
    const appointmentDate = new Date(appointment.date);
    const formattedDate = new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(appointmentDate);

    const li = document.createElement('li');
    li.id = `appointment-${appointment.id}`;
    li.innerHTML = `
      <div class="entity-info">
        <strong>${formattedDate}</strong> - ${appointment.pet?.name || 'Неизвестно'} → ${appointment.service?.name || 'Неизвестно'}
      </div>
      <div class="entity-actions">
        <button class="delete-btn" data-id="${appointment.id}"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;

    appointmentsList.appendChild(li);

    // Назначаем обработчик для кнопки удаления
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const displayName = `${formattedDate} (${appointment.pet?.name})`;
      showDeleteConfirmation(appointment.id, displayName, 'appointment');
    });
  }

  // Добавление новой записи
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(appointmentForm);
      const data = {
        petId: formData.get('petId'),
        serviceId: formData.get('serviceId'),
        date: formData.get('date')
      };

      try {
        const response = await fetch('/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          const result = await response.json();
          showNotification('Запись успешно добавлена');
          appointmentForm.reset();
          addAppointmentToList(result);
        } else {
          const error = await response.json();
          showNotification(`Ошибка: ${error.message || 'Не удалось создать запись'}`, 'error');
        }
      } catch (error) {
        console.error('Ошибка при добавлении записи:', error);
        showNotification('Ошибка соединения с сервером', 'error');
      }
    });
  }

  // Удаление записи
  async function deleteAppointment(appointmentId) {
    try {
      const response = await fetch(`/appointments/${appointmentId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const appointmentElement = document.getElementById(`appointment-${appointmentId}`);
        if (appointmentElement) {
          appointmentElement.remove();
          showNotification('Запись успешно удалена');
        }
      } else {
        const error = await response.json();
        showNotification(`Ошибка удаления: ${error.message || 'Неизвестная ошибка'}`, 'error');
      }
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
      showNotification('Ошибка соединения с сервером', 'error');
    }
  }

  // ========== ОБЩИЕ ФУНКЦИИ ==========

  // Показ уведомлений
  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.style.display = 'none';
        notification.style.opacity = '1';
      }, 300);
    }, 3000);
  }

  // Модальное окно подтверждения удаления
  let currentDeleteItem = null;
  let currentDeleteType = null;

  // Показ модального окна подтверждения удаления
  function showDeleteConfirmation(id, name, type) {
    currentDeleteItem = id;
    currentDeleteType = type;

    const itemNameElement = document.getElementById('deleteItemName');

    switch(type) {
      case 'animal':
        itemNameElement.textContent = `животное "${name}"`;
        break;
      case 'service':
        itemNameElement.textContent = `услугу "${name}"`;
        break;
      case 'appointment':
        itemNameElement.textContent = `запись "${name}"`;
        break;
    }

    document.getElementById('deleteModal').style.display = 'flex';
  }

  // Подтверждение удаления
  document.getElementById('confirmDelete').addEventListener('click', function() {
    if (currentDeleteItem && currentDeleteType) {
      switch(currentDeleteType) {
        case 'animal':
          if (window.deleteAnimal) {
            window.deleteAnimal(currentDeleteItem);
          } else {
            console.error('Функция deleteAnimal не найдена');
          }
          break;
        case 'service':
          deleteService(currentDeleteItem);
          break;
        case 'appointment':
          deleteAppointment(currentDeleteItem);
          break;
      }

      document.getElementById('deleteModal').style.display = 'none';
    }
  });

  // Закрытие модального окна
  document.getElementById('cancelDelete').addEventListener('click', function() {
    document.getElementById('deleteModal').style.display = 'none';
  });

  document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('deleteModal').style.display = 'none';
  });

  window.addEventListener('click', function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Экспорт функций в глобальную область видимости для доступа из других скриптов
  window.showNotification = showNotification;
  window.showDeleteConfirmation = showDeleteConfirmation;
  window.deleteService = deleteService;
  window.deleteAppointment = deleteAppointment;

  // Server-Sent Events для обновления данных в реальном времени
  const setupEventSource = () => {
    // События для услуг
    const servicesEvents = new EventSource('/services/events');
    servicesEvents.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.action === 'created') {
        addServiceToList(data.service);
      } else if (data.action === 'deleted') {
        const serviceElement = document.getElementById(`service-${data.deletedId}`);
        if (serviceElement) serviceElement.remove();
      }
    };

    // События для записей
    const appointmentsEvents = new EventSource('/appointments/events');
    appointmentsEvents.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.action === 'created') {
        addAppointmentToList(data.appointment);
      } else if (data.action === 'deleted') {
        const appointmentElement = document.getElementById(`appointment-${data.deletedId}`);
        if (appointmentElement) appointmentElement.remove();
      } else if (data.action === 'updated') {
        const appointmentElement = document.getElementById(`appointment-${data.appointment.id}`);
        if (appointmentElement) {
          // Обновляем содержимое
          const newAppointment = data.appointment;
          appointmentElement.remove();
          addAppointmentToList(newAppointment);
        }
      }
    };

    // Обработка ошибок подключения
    servicesEvents.onerror = function() {
      console.log('Ошибка подключения к событиям услуг. Переподключение...');
      servicesEvents.close();
      setTimeout(setupEventSource, 5000);
    };

    appointmentsEvents.onerror = function() {
      console.log('Ошибка подключения к событиям записей. Переподключение...');
      appointmentsEvents.close();
      setTimeout(setupEventSource, 5000);
    };
  };

  // Инициализация загрузки данных
  loadServices();
  loadAppointments();
  setupEventSource();
});