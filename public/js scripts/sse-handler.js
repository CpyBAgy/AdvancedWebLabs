// SSE Handler - обработчик Server-Sent Events
document.addEventListener('DOMContentLoaded', function() {
  // Создаем контейнер для уведомлений, если его еще нет
  let notificationsContainer = document.getElementById('notifications');
  if (!notificationsContainer) {
    notificationsContainer = document.createElement('div');
    notificationsContainer.id = 'notifications';
    notificationsContainer.className = 'notifications-container';
    document.body.appendChild(notificationsContainer);
  }

  // Функция для создания уведомления
  function createNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    let iconClass = 'fa-bell';
    if (type === 'error') {
      iconClass = 'fa-exclamation-circle';
    } else if (type === 'warning') {
      iconClass = 'fa-exclamation-triangle';
    } else if (type === 'info') {
      iconClass = 'fa-info-circle';
    }

    notification.innerHTML = `
            <div class="icon"><i class="fas ${iconClass}"></i></div>
            <div class="message">${message}</div>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        `;

    // Добавляем уведомление на страницу
    notificationsContainer.appendChild(notification);

    // Добавляем анимацию появления
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Удаляем уведомление через 5 секунд
    const timeout = setTimeout(() => {
      removeNotification(notification);
    }, 5000);

    // Обработчик закрытия уведомления
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      clearTimeout(timeout);
      removeNotification(notification);
    });

    return notification;
  }

  // Функция для удаления уведомления с анимацией
  function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  // Подключение к Server-Sent Events для животных
  if (window.location.pathname.includes('/animals')) {
    try {
      const port = window.location.port;
      const baseUrl = window.location.protocol + '//' + window.location.hostname + (port ? ':' + port : '');
      const evtSource = new EventSource(`${baseUrl}/animals/events`);

      evtSource.onopen = function() {
        console.log("SSE соединение установлено");
      };

      evtSource.onmessage = function(event) {
        try {
          const data = JSON.parse(event.data);
          createNotification(data.message, 'success');
        } catch (error) {
          console.error("Ошибка при обработке данных события:", error);
          createNotification("Ошибка при обработке данных с сервера", 'error');
        }
      };

      evtSource.onerror = function(error) {
        console.error("Ошибка SSE соединения:", error);
        createNotification("Ошибка подключения к серверу уведомлений", 'error');

        // Закрываем соединение при ошибке
        evtSource.close();

        // Пытаемся переподключиться через 5 секунд
        setTimeout(() => {
          createNotification("Пытаемся переподключиться к серверу уведомлений...", 'info');
          // Здесь мы НЕ пересоздаем соединение, чтобы избежать зацикливания ошибок
        }, 5000);
      };

      // Закрываем соединение при уходе со страницы
      window.addEventListener('beforeunload', () => {
        evtSource.close();
      });
    } catch (e) {
      console.error("Ошибка при создании SSE соединения:", e);
      createNotification("Не удалось подключиться к серверу уведомлений", 'error');
    }
  }
});