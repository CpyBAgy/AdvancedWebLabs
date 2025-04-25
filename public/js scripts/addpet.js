document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("petForm");
  const petsList = document.getElementById("petsList");
  const emptyPets = document.getElementById("emptyPets");
  const messageElement = document.getElementById("message");

  // Получаем userId из URL
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  async function loadPets() {
    try {
      const response = await fetch(`/pets/owner/${userId}`);
      const pets = await response.json();

      petsList.innerHTML = "";

      if (pets.length === 0) {
        emptyPets.style.display = 'block';
      } else {
        emptyPets.style.display = 'none';
        pets.forEach(addPetToList);
      }
    } catch (error) {
      console.error("Ошибка загрузки питомцев:", error);
      showMessage("Ошибка загрузки питомцев", "error");
    }
  }

  function addPetToList(pet) {
    const li = document.createElement("li");
    li.id = `pet-${pet.id}`;
    li.innerHTML = `
    <div>
      <strong>${pet.name}</strong> (${pet.type})
    </div>
    <div class="pet-actions">
      <button data-id="${pet.id}" class="edit-btn"><i class="fas fa-edit"></i> Редактировать</button>
      <button data-id="${pet.id}" class="delete-btn"><i class="fas fa-trash-alt"></i> Удалить</button>
    </div>
    <form class="edit-form" id="edit-form-${pet.id}" style="display: none; width: 100%;">
      <input type="hidden" name="id" value="${pet.id}" />
      <input type="hidden" name="ownerId" value="${userId}" />
      <input type="text" name="name" value="${pet.name}" required placeholder="Имя питомца" />
      <select name="type" required>
        <option value="Собака" ${pet.type === "Собака" ? "selected" : ""}>Собака</option>
        <option value="Кошка" ${pet.type === "Кошка" ? "selected" : ""}>Кошка</option>
        <option value="Пернатый" ${pet.type === "Пернатый" ? "selected" : ""}>Пернатый</option>
        <option value="Грызун" ${pet.type === "Грызун" ? "selected" : ""}>Грызун</option>
        <option value="Рептилия" ${pet.type === "Рептилия" ? "selected" : ""}>Рептилия</option>
      </select>
      <button type="submit"><i class="fas fa-save"></i> Сохранить</button>
    </form>
    `;

    petsList.appendChild(li);

    // Назначаем поведение кнопке редактирования
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
        const response = await fetch(`/pets/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jsonData),
        });

        if (response.ok) {
          showMessage("Питомец обновлен!", "success");
          await loadPets();
        } else {
          showMessage("Ошибка при обновлении питомца", "error");
        }
      } catch (error) {
        console.error("Ошибка:", error);
        showMessage("Ошибка при обновлении питомца", "error");
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    // Добавляем ID пользователя из URL
    jsonData.ownerId = userId;

    try {
      const response = await fetch("/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        const result = await response.json();
        showMessage("Питомец успешно добавлен!");
        form.reset();
        await loadPets();
      } else {
        const error = await response.json();
        showMessage(`Ошибка: ${error.message || "Неизвестная ошибка"}`, "error");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      showMessage("Ошибка соединения с сервером", "error");
    }
  });

  petsList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn") ||
      event.target.parentElement.classList.contains("delete-btn")) {
      const button = event.target.classList.contains("delete-btn") ?
        event.target : event.target.parentElement;
      const petId = button.dataset.id;

      if (confirm("Вы уверены, что хотите удалить этого питомца?")) {
        try {
          const response = await fetch(`/pets/${petId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            showMessage("Питомец успешно удален");
            document.getElementById(`pet-${petId}`).remove();

            // Проверяем, остались ли питомцы
            if (petsList.children.length === 0) {
              emptyPets.style.display = 'block';
            }
          } else {
            showMessage("Ошибка при удалении питомца", "error");
          }
        } catch (error) {
          console.error("Ошибка:", error);
          showMessage("Ошибка при удалении питомца", "error");
        }
      }
    }
  });

  // Загружаем питомцев при загрузке страницы
  if (userId) {
    await loadPets();
  } else {
    showMessage("Ошибка: пользователь не авторизован", "error");
  }
});