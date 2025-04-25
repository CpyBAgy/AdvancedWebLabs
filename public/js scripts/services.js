document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("serviceForm");
  const servicesList = document.getElementById("servicesList");
  const emptyServices = document.getElementById("emptyServices");
  const messageElement = document.getElementById("message");

  // Функция для отображения сообщений
  function showMessage(text, type = "success") {
    if (!messageElement) return;

    messageElement.textContent = text;
    messageElement.className = `notification ${type}`;
    messageElement.style.display = "block";

    setTimeout(() => {
      messageElement.style.display = "none";
    }, 3000);
  }

  // Функция загрузки списка услуг
  async function loadServices() {
    try {
      console.log("Загрузка списка услуг...");

      // Очищаем сообщения об ошибках
      if (messageElement) messageElement.style.display = 'none';

      // Запрос к серверу
      const response = await fetch("/services");

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      // Получаем данные
      const responseText = await response.text();

      // Проверяем, не пустой ли ответ
      if (!responseText.trim()) {
        console.log("Получен пустой ответ от сервера");
        if (servicesList) servicesList.innerHTML = "";
        if (emptyServices) emptyServices.style.display = 'block';
        return;
      }

      // Пробуем разобрать JSON
      let services;
      try {
        services = JSON.parse(responseText);
        console.log("Полученные услуги:", services);
      } catch (e) {
        console.error("Ошибка при разборе JSON:", e);
        console.log("Полученный текст:", responseText);
        showMessage("Ошибка при разборе данных с сервера", "error");
        return;
      }

      // Проверяем, что получили массив
      if (!Array.isArray(services)) {
        console.error("Полученные данные не являются массивом:", services);
        showMessage("Неверный формат данных от сервера", "error");
        return;
      }

      // Очищаем текущий список
      if (servicesList) servicesList.innerHTML = "";

      // Отображаем сообщение, если нет услуг
      if (services.length === 0) {
        if (emptyServices) emptyServices.style.display = 'block';
      } else {
        if (emptyServices) emptyServices.style.display = 'none';
        // Добавляем услуги в список
        services.forEach(service => {
          addServiceToList(service);
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке услуг:", error);
      showMessage("Ошибка загрузки списка услуг: " + error.message, "error");
    }
  }

  // Функция добавления услуги в список на странице
  function addServiceToList(service) {
    if (!servicesList) return;

    const li = document.createElement("li");
    li.id = `service-${service.id}`;
    li.className = "services-list-item"; // Добавим класс для стилизации

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
        <button type="submit" class="save-btn"><i class="fas fa-save"></i> Сохранить</button>
      </form>
    `;

    servicesList.appendChild(li);

    // Обработка нажатия на кнопку редактирования
    const editButton = li.querySelector(".edit-btn");
    const editForm = li.querySelector(".edit-form");

    editButton.addEventListener("click", () => {
      editForm.style.display = editForm.style.display === "none" ? "flex" : "none";
    });

    // Обработка формы редактирования
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(editForm);
      const jsonData = {
        id: formData.get('id'),
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price'))
      };

      try {
        const response = await fetch(`/services/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          showMessage("Услуга обновлена!", "success");
          // Обновляем отображение после успешного обновления
          loadServices();
        } else {
          const errorText = await response.text();
          showMessage("Ошибка при обновлении услуги: " + errorText, "error");
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showMessage("Ошибка соединения с сервером", "error");
      }
    });
  }

  // Обработка отправки формы добавления
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Получаем данные из формы
      const nameValue = form.querySelector('input[name="name"]').value.trim();
      const descriptionValue = form.querySelector('textarea[name="description"]').value.trim();
      const priceValue = parseFloat(form.querySelector('input[name="price"]').value);

      // Проверяем данные
      if (!nameValue || !descriptionValue || isNaN(priceValue)) {
        showMessage("Пожалуйста, заполните все поля корректно", "error");
        return;
      }

      // Создаем объект с данными
      const serviceData = {
        name: nameValue,
        description: descriptionValue,
        price: priceValue
      };

      try {
        // Отправляем запрос
        const response = await fetch("/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });

        // Обрабатываем ответ
        if (response.ok) {
          showMessage("Услуга успешно добавлена!");
          form.reset();

          // Перезагружаем список услуг
          loadServices();
        } else {
          const errorText = await response.text();
          showMessage("Ошибка при добавлении услуги: " + errorText, "error");
        }
      } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        showMessage("Ошибка связи с сервером", "error");
      }
    });
  }

  // Обработка удаления услуги
  if (servicesList) {
    servicesList.addEventListener("click", async (event) => {
      // Проверяем, что клик был по кнопке удаления
      if (event.target.classList.contains("delete-btn") ||
        event.target.parentElement.classList.contains("delete-btn")) {

        // Находим кнопку и ID услуги
        const button = event.target.classList.contains("delete-btn") ?
          event.target : event.target.parentElement;
        const serviceId = button.dataset.id;

        // Запрашиваем подтверждение
        if (confirm("Вы уверены, что хотите удалить эту услугу?")) {
          try {
            const response = await fetch(`/services/${serviceId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              showMessage("Услуга успешно удалена");
              // Удаляем элемент из DOM
              const serviceElement = document.getElementById(`service-${serviceId}`);
              if (serviceElement) serviceElement.remove();

              // Проверяем, остались ли услуги
              if (servicesList.children.length === 0 && emptyServices) {
                emptyServices.style.display = 'block';
              }
            } else {
              const errorText = await response.text();
              showMessage("Ошибка при удалении услуги: " + errorText, "error");
            }
          } catch (error) {
            console.error("Ошибка при удалении:", error);
            showMessage("Ошибка связи с сервером", "error");
          }
        }
      }
    });
  }

  // Загружаем список услуг при загрузке страницы
  loadServices();
});