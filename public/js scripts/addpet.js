document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("petForm");
  const petsList = document.getElementById("petsList");

  async function loadPets() {
    try {
      const response = await fetch(`/pets?ownerId=${userId}`);
      const pets = await response.json();

      petsList.innerHTML = ""; // очищаем
      pets.forEach(addPetToList); // рендерим всё через JS
    } catch (error) {
      console.error("Ошибка загрузки питомцев:", error);
    }
  }

  function addPetToList(pet) {
    const li = document.createElement("li");
    li.id = `pet-${pet.id}`;
    li.innerHTML = `
    <div>
      <strong>${pet.name}</strong> (${pet.type})
      <button data-id="${pet.id}" class="delete-btn">Удалить</button>
      <button data-id="${pet.id}" class="edit-btn">Редактировать</button>
    </div>
    <form action="/pets/update" method="POST" class="edit-form" id="edit-form-${pet.id}" style="display: none; margin-top: 8px;">
      <input type="hidden" name="id" value="${pet.id}" />
      <input type="hidden" name="ownerId" value="${userId}" />
      <input type="text" name="name" value="${pet.name}" required />
      <select name="type" required>
        <option value="Собака" ${pet.type === "Собака" ? "selected" : ""}>Собака</option>
        <option value="Кошка" ${pet.type === "Кошка" ? "selected" : ""}>Кошка</option>
        <option value="Пернатый" ${pet.type === "Пернатый" ? "selected" : ""}>Пернатый</option>
        <option value="Грызун" ${pet.type === "Грызун" ? "selected" : ""}>Грызун</option>
        <option value="Рептилия" ${pet.type === "Рептилия" ? "selected" : ""}>Рептилия</option>
      </select>
      <button type="submit">Сохранить</button>
    </form>
  `;

    petsList.appendChild(li);

    // Назначаем поведение кнопке редактирования
    const editButton = li.querySelector(".edit-btn");
    const editForm = li.querySelector(".edit-form");

    editButton.addEventListener("click", () => {
      editForm.style.display = editForm.style.display === "none" ? "block" : "none";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const petId = btn.dataset.id;
        const form = document.getElementById(`edit-form-${petId}`);
        form.style.display = form.style.display === "none" ? "block" : "none";
      });
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const jsonData = Object.fromEntries(formData.entries());

    jsonData.ownerId = userId;

    try {
      const response = await fetch("/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();

      if (response.ok) {
        document.getElementById("message").textContent = "Питомец добавлен!";
        document.getElementById("message").style.display = "block";
        form.reset();
        addPetToList(result);
        setTimeout(() => {
          document.getElementById("message").style.display = "none";
        }, 3000);
      } else {
        alert("Ошибка: " + (result.error || "Неизвестная ошибка"));
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  });

  petsList.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const petId = event.target.dataset.id;
      try {
        const response = await fetch(`/pets/${petId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          document.getElementById(`pet-${petId}`).remove();
        } else {
          alert("Ошибка при удалении");
        }
      } catch (error) {
        console.error("Ошибка удаления:", error);
      }
    }
  });

  await loadPets();
});