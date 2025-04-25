document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("appointmentForm");
  const appointmentsList = document.getElementById("appointmentsList");
  const emptyAppointments = document.getElementById("emptyAppointments");
  const messageElement = document.getElementById("message");

  // Получаем ID пользователя из URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  function showMessage(text, type = "success") {
    if (!messageElement) return;

    messageElement.textContent = text;
    messageElement.className = `notification ${type}`;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  async function loadAppointments() {
    if (!userId) {
      console.error("Ошибка: userId отсутствует в URL!");
      showMessage("Не удалось загрузить записи: отсутствует идентификатор пользователя", "error");
      return;
    }

    try {
      console.log("Загрузка записей для пользователя:", userId);

      const response = await fetch(`/appointments?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      // Получаем текст ответа и проверяем, не пустой ли он
      const responseText = await response.text();

      if (!responseText.trim()) {
        console.log("Получен пустой ответ от сервера");
        if (appointmentsList) appointmentsList.innerHTML = "";
        if (emptyAppointments) emptyAppointments.style.display = 'block';
        return;
      }

      // Пробуем разобрать JSON
      let appointments;
      try {
        appointments = JSON.parse(responseText);
        console.log("Полученные записи:", appointments);
      } catch (e) {
        console.error("Ошибка при разборе JSON:", e);
        console.log("Полученный текст:", responseText);
        showMessage("Ошибка при разборе данных с сервера", "error");
        return;
      }

      // Проверяем, что получили массив
      if (!Array.isArray(appointments)) {
        console.error("Полученные данные не являются массивом:", appointments);
        showMessage("Неверный формат данных от сервера", "error");
        return;
      }

      // Очищаем текущий список
      if (appointmentsList) appointmentsList.innerHTML = "";

      // Показываем сообщение, если нет записей
      if (appointments.length === 0) {
        if (emptyAppointments) emptyAppointments.style.display = 'block';
      } else {
        if (emptyAppointments) emptyAppointments.style.display = 'none';
        // Добавляем записи в список
        appointments.forEach(appointment => {
          addAppointmentToList(appointment);
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки записей:", error);
      showMessage("Ошибка загрузки записей: " + error.message, "error");
    }
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString; // Если дата недействительна, возвращаем исходную строку

      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return dateString;
    }
  }

  function addAppointmentToList(appointment) {
    if (!appointmentsList) return;

    // Проверяем, не существует ли уже запись с таким ID
    if (document.getElementById(`appointment-${appointment.id}`)) return;

    const tr = document.createElement("tr");
    tr.id = `appointment-${appointment.id}`;

    tr.innerHTML = `
      <td>${formatDate(appointment.date)}</td>
      <td>${appointment.pet?.name || "Неизвестно"}</td>
      <td>${appointment.service?.name || "Неизвестно"}</td>
      <td>
        <button data-id="${appointment.id}" class="action-button delete-button">
          <i class="fas fa-trash-alt"></i> Удалить
        </button>
      </td>
    `;

    appointmentsList.appendChild(tr);

    // Добавляем обработчик на кнопку удаления
    tr.querySelector('.delete-button').addEventListener('click', async (e) => {
      const appointmentId = e.currentTarget.dataset.id;
      if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        await deleteAppointment(appointmentId);
      }
    });
  }

  async function deleteAppointment(appointmentId) {
    if (!appointmentId) {
      console.error("Ошибка: ID записи отсутствует!");
      return;
    }

    try {
      const response = await fetch(`/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        showMessage(`Ошибка при удалении записи: ${errorText}`, "error");
        return;
      }

      showMessage("Запись успешно удалена");

      // Удаляем запись из DOM
      const item = document.getElementById(`appointment-${appointmentId}`);
      if (item) {
        item.remove();

        // Проверяем, остались ли записи
        if (appointmentsList && appointmentsList.children.length === 0 && emptyAppointments) {
          emptyAppointments.style.display = 'block';
        }
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showMessage("Ошибка связи с сервером: " + error.message, "error");
    }
  }

  // Обработка формы добавления записи
  if (form) {
    form.addEventListener("submit", async function(event) {
      event.preventDefault();

      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          showMessage("Запись успешно добавлена!");
          form.reset();

          // Перезагружаем список записей
          loadAppointments();
        } else {
          const errorText = await response.text();
          showMessage(`Ошибка: ${errorText}`, "error");
        }
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        showMessage("Ошибка связи с сервером: " + error.message, "error");
      }
    });
  }

  // Инициализация SSE для обновлений в реальном времени
  let eventSource;

  function connectSSE() {
    eventSource = new EventSource("/appointments/events");

    eventSource.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);
        console.log("SSE Event:", data);

        if (data.action === "created") {
          addAppointmentToList(data.appointment);
          if (emptyAppointments) emptyAppointments.style.display = 'none';
        } else if (data.action === "deleted") {
          removeAppointmentFromList(data.deletedId);
        } else if (data.action === "updated") {
          // Удаляем старую запись и добавляем обновленную
          removeAppointmentFromList(data.appointment.id);
          addAppointmentToList(data.appointment);
        }
      } catch (error) {
        console.error("Ошибка при обработке SSE события:", error);
      }
    };

    eventSource.onerror = function(error) {
      console.error("SSE Error:", error);
      // Переподключаемся при ошибке
      setTimeout(connectSSE, 5000);
    };
  }

  function removeAppointmentFromList(appointmentId) {
    const item = document.getElementById(`appointment-${appointmentId}`);
    if (item) {
      item.remove();

      // Проверяем, остались ли записи
      if (appointmentsList && appointmentsList.children.length === 0 && emptyAppointments) {
        emptyAppointments.style.display = 'block';
      }
    }
  }

  // Загружаем записи и подключаемся к SSE
  await loadAppointments();
  connectSSE();
});