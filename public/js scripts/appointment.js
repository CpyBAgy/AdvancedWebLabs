document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("appointmentForm");
  const appointmentsList = document.getElementById("appointmentsList");
  const emptyAppointments = document.getElementById("emptyAppointments");
  const messageElement = document.getElementById("message");

  async function loadAppointments() {
    if (!userId) {
      console.error("Ошибка: userId отсутствует!");
      return;
    }

    try {
      const response = await fetch(`/appointments?userId=${userId}`);
      const appointments = await response.json();

      appointmentsList.innerHTML = "";

      if (appointments.length === 0) {
        emptyAppointments.style.display = 'block';
      } else {
        emptyAppointments.style.display = 'none';
        appointments.forEach(addAppointmentToList);
      }
    } catch (error) {
      console.error("Ошибка загрузки записей:", error);
      showMessage("Ошибка загрузки записей", "error");
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function addAppointmentToList(appointment) {
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

  function showMessage(text, type = "success") {
    messageElement.textContent = text;
    messageElement.className = `notification ${type}`;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  function removeAppointmentFromList(appointmentId) {
    const item = document.getElementById(`appointment-${appointmentId}`);
    if (item) {
      item.remove();

      // Проверяем, остались ли записи
      if (appointmentsList.children.length === 0) {
        emptyAppointments.style.display = 'block';
      }
    }
  }

  async function deleteAppointment(appointmentId) {
    console.log("Удаляем запись с ID:", appointmentId);

    if (!appointmentId) {
      console.error("Ошибка: ID записи отсутствует!");
      return;
    }

    try {
      const response = await fetch(`/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Ошибка удаления:", error);
        showMessage(`Ошибка: ${error.message || "Не удалось удалить запись"}`, "error");
      } else {
        showMessage("Запись успешно удалена");
        removeAppointmentFromList(appointmentId);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage("Ошибка соединения с сервером", "error");
    }
  }

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
        const result = await response.json();
        showMessage("Запись успешно добавлена!");
        form.reset();
        addAppointmentToList(result);

        // Если это первая запись, скрываем сообщение о пустом списке
        if (appointmentsList.children.length > 0) {
          emptyAppointments.style.display = 'none';
        }
      } else {
        const result = await response.json();
        showMessage(`Ошибка: ${result.message || "Не удалось создать запись"}`, "error");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage("Ошибка соединения с сервером", "error");
    }
  });

  // SSE для обновления в реальном времени
  const eventSource = new EventSource("/appointments/events");

  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("SSE Event:", data);

    if (data.action === "created") {
      addAppointmentToList(data.appointment);
    } else if (data.action === "deleted") {
      removeAppointmentFromList(data.deletedId);
    } else if (data.action === "updated") {
      // Удаляем старую запись и добавляем обновленную
      removeAppointmentFromList(data.appointment.id);
      addAppointmentToList(data.appointment);
    }
  };

  // Загружаем записи при загрузке страницы
  await loadAppointments();
});