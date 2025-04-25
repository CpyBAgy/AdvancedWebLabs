document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("serviceForm");
  const servicesList = document.getElementById("servicesList");

  // Загрузка всех услуг с сервера
  async function loadServices() {
    try {
      const response = await fetch("/services");
      const services = await response.json();

      servicesList.innerHTML = ""; // очищаем список
      services.forEach(addServiceToList); // отрисовываем
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
    }
  }

  // Добавление одной услуги в DOM
  function addServiceToList(service) {
    const li = document.createElement("li");
    li.id = `service-${service.id}`;
    li.innerHTML = `
      <div>
        <strong>${service.name}</strong>: ${service.description} — ${service.price}₽
        <button data-id="${service.id}" class="delete-btn">Удалить</button>
        <button data-id="${service.id}" class="edit-btn">Редактировать</button>
      </div>
      <form action="/services/update" method="POST" class="edit-form" id="edit-form-${service.id}" style="display: none; margin-top: 10px;">
        <input type="hidden" name="id" value="${service.id}" />
        <input type="text" name="name" value="${service.name}" required />
        <input type="text" name="description" value="${service.description}" required />
        <input type="number" step="0.01" name="price" value="${service.price}" required />
        <button type="submit">Сохранить</button>
      </form>
    `;
    servicesList.appendChild(li);

    // Показ/скрытие формы редактирования
    const editButton = li.querySelector(".edit-btn");
    const editForm = li.querySelector(".edit-form");

    editButton.addEventListener("click", () => {
      editForm.style.display = editForm.style.display === "none" ? "block" : "none";
    });
  }

  // Добавление новой услуги
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("message").textContent = "Услуга добавлена!";
        document.getElementById("message").style.display = "block";
        form.reset();
        addServiceToList(result); // Добавляем новую услугу
        setTimeout(() => {
          document.getElementById("message").style.display = "none";
        }, 3000);
      } else {
        alert("Ошибка: " + (result.error || "Неизвестная ошибка"));
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
      alert("Ошибка соединения с сервером");
    }
  });

  // Удаление услуги
  servicesList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const serviceId = event.target.dataset.id;
      try {
        const response = await fetch(`/services/${serviceId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          document.getElementById(`service-${serviceId}`).remove();
        } else {
          const error = await response.json();
          alert("Ошибка удаления: " + (error.message || "Неизвестная ошибка"));
        }
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  });
  await loadServices();
});