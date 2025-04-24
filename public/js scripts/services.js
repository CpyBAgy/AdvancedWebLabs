document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("serviceForm");
  const servicesList = document.getElementById("servicesList");
  const emptyServices = document.getElementById("emptyServices");
  const messageElement = document.getElementById("message");

  // Загрузка всех услуг с сервера
  async function loadServices() {
    try {
      const response = await fetch("/services");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const services = await response.json();
      servicesList.innerHTML = "";

      if (services.length === 0) {
        emptyServices.style.display = 'block';
      } else {
        emptyServices.style.display = 'none';
        services.forEach(addServiceToList);
      }
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
      showMessage("Ошибка загрузки услуг", "error");
    }
  }

  function showMessage(text, type = "success") {
    messageElement.textContent = text;
    messageElement.className = `notification ${type}`;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  // Добавление одной услуги в DOM
  function addServiceToList(service) {
    const li = document.createElement("li");
    li.id = `service-${service.id}`;
    li.innerHTML = `
      <div>
        <strong>${service.name}</strong>: ${service.description} — ${service.price}₽
      </div>
      <div class="service-actions">
        <button data-id="${service.id}" class="edit-btn"><i class="fas fa-edit"></i> Редактировать</button>
        <button data-id="${service.id}" class="delete-btn"><i class="fas fa-trash-alt"></i> Удалить</button>
      </div>
      <form class="edit-form" id="edit-form-${service.id}" style="display: none; width: 100%;">
        <input type="hidden" name="id" value="${service.id}" />
        <input type="text" name="name" value="${service.name}" required placeholder="Название" />
        <input type="text" name="description" value="${service.description}" required placeholder="Описание" />
        <input type="number" step="0.01" name="price" value="${service.price}" required placeholder="Цена" />
        <button type="submit"><i class="fas fa-save"></i> Сохранить</button>
      </form>
    `;

    servicesList.appendChild(li);

    // Показ/скрытие формы редактирования
    const editButton = li.querySelector(".edit-btn");
    const editForm = li.querySelector(".edit-form");

    editButton.addEventListener("click", () => {
      editForm.style.display = editForm.style.display === "none" ? "flex" : "none";
    });

    // Обработка формы редактирования
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(editForm);
      const jsonData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`/services/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          showMessage("Услуга обновлена!", "success");
          await loadServices();
        } else {
          showMessage("Ошибка при обновлении услуги", "error");
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showMessage("Ошибка при обновлении услуги", "error");
      }
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

      if (response.ok) {
        const result = await response.json();
        showMessage("Услуга успешно добавлена!");
        form.reset();
        await loadServices();

        // Если это первая услуга, скрываем сообщение о пустом списке
        if (servicesList.children.length > 0) {
          emptyServices.style.display = 'none';
        }
      } else {
        const error = await response.json();
        showMessage(`Ошибка: ${error.message || "Неизвестная ошибка"}`, "error");
      }
    } catch (error) {
      console.error("Ошибка при добавлении:", error);
      showMessage("Ошибка соединения с сервером", "error");
    }
  });

  // Удаление услуги
  servicesList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn") ||
      event.target.parentElement.classList.contains("delete-btn")) {
      const button = event.target.classList.contains("delete-btn") ?
        event.target : event.target.parentElement;
      const serviceId = button.dataset.id;

      if (confirm("Вы уверены, что хотите удалить эту услугу?")) {
        try {
          const response = await fetch(`/services/${serviceId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            showMessage("Услуга успешно удалена");
            document.getElementById(`service-${serviceId}`).remove();

            // Проверяем, остались ли услуги
            if (servicesList.children.length === 0) {
              emptyServices.style.display = 'block';
            }
          } else {
            showMessage("Ошибка при удалении услуги", "error");
          }
        } catch (error) {
          console.error("Ошибка удаления:", error);
          showMessage("Ошибка при удалении услуги", "error");
        }
      }
    }
  });

  // Загружаем услуги при загрузке страницы
  await loadServices();
});