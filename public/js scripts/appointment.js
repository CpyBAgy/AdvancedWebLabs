document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("appointmentForm");
  const appointmentsList = document.getElementById("appointmentsList");
  const userId = localStorage.getItem("userId");

  async function loadAppointments() {

    if (!userId) {
      console.error("Ошибка: userId отсутствует!");
      return;
    }

    try {
      const response = await fetch(`/appointments?userId=${userId}`);
      const appointments = await response.json();
      console.log("Загруженные записи:", appointments);

      appointmentsList.innerHTML = "";
      appointments.forEach(addAppointmentToList);
    } catch (error) {
      console.error("Ошибка загрузки записей:", error);
    }
  }

  await loadAppointments();

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      console.log("Отправляем:", jsonData);
      const result = await response.json();

      if (response.ok) {
        document.getElementById("message").textContent = "Запись добавлена!";
        document.getElementById("message").style.display = "block";
        form.reset();
        addAppointmentToList(result);
        setTimeout(() => {
          document.getElementById("message").style.display = "none";
        }, 3000);
      } else {
        alert("Ошибка: " + (result.message || JSON.stringify(result)));
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка соединения с сервером");
    }
  });

  const eventSource = new EventSource("/appointments/events");

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log("SSE Event:", data);

    if (data.action === "created") {
      addAppointmentToList(data.appointment);
    } else if (data.action === "deleted") {
      removeAppointmentFromList(data.deletedId);
    } else if (data.action === "updated") {
      updateAppointmentInList(data.appointment);
    }
  };

  function addAppointmentToList(appointment) {
    if (document.getElementById(`appointment-${appointment.id}`)) return;

    const li = document.createElement("li");
    li.id = `appointment-${appointment.id}`;
    li.innerHTML = `
      ${appointment.date} - ${appointment.pet?.name || "Неизвестно"} → ${appointment.service?.name || "Неизвестно"}
      <button data-id="${appointment.id}" class="delete-btn">Удалить</button>
    `;
    appointmentsList.appendChild(li);
  }

  function removeAppointmentFromList(appointmentId) {
    const item = document.getElementById(`appointment-${appointmentId}`);
    if (item) item.remove();
  }

  function updateAppointmentInList(appointment) {
    let item = document.getElementById(`appointment-${appointment.id}`);
    if (item) {
      item.innerHTML = `
      ${appointment.date} - ${appointment.pet?.name || "Неизвестно"} → ${appointment.service?.name || "Неизвестно"}
      <button data-id="${appointment.id}" class="delete-btn">Удалить</button>
    `;
    } else {
      addAppointmentToList(appointment);
    }
  }

  appointmentsList.addEventListener("click", async function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const appointmentId = event.target.dataset.id;
      if (appointmentId) {
        await deleteAppointment(appointmentId);
      }
    }
  });

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
        alert("Ошибка: " + (result.message || JSON.stringify(result)));
      } else {
        document.getElementById("message").textContent = "Запись удалена!";
        document.getElementById("message").style.display = "block";
        form.reset();
        removeAppointmentFromList(appointmentId);
        setTimeout(() => {
          document.getElementById("message").style.display = "none";
        }, 3000);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка соединения с сервером");
    }
  }
});