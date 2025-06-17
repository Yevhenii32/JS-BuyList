
//Задаємо змінні
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".input-group input");
  const addButton = document.querySelector(".input-group button");
  const itemList = document.querySelector(".card:first-child");
  const badgeLeft = document.querySelectorAll(".badge-list")[0];
  const badgeBought = document.querySelectorAll(".badge-list")[1];

  //Створення або завантаження списку
  let items = JSON.parse(localStorage.getItem("buylist")) || [
    { name: "Помідори", count: 2, bought: true },
    { name: "Печиво", count: 2, bought: false },
    { name: "Сир", count: 1, bought: false },
  ];
//Збереження поточного списку
  function saveState() {
    localStorage.setItem("buylist", JSON.stringify(items));
  }
//
  function render() {
    document.querySelectorAll(".item").forEach((el, i) => {
      if (i > 0) el.remove();
    });
    badgeLeft.innerHTML = "";
    badgeBought.innerHTML = "";

    items.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "item";

      const row = document.createElement("div");
      row.className = "item-row";

      // Назва товару
      const nameSpan = document.createElement("span");
      nameSpan.className = "item-name";
      nameSpan.textContent = item.name;
      if (item.bought) nameSpan.classList.add("bought");
      else {
        nameSpan.addEventListener("click", () => editName(nameSpan, index));
      }

      row.appendChild(nameSpan);

      // Лічильник
      const counter = document.createElement("div");
      counter.className = "counter-wrapper";
      const controls = document.createElement("div");
      controls.className = "counter-controls";

      if (!item.bought) {
        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.className = "btn red";
        minus.setAttribute("data-tooltip", "Зменшити");
        minus.disabled = item.count <= 1;
        minus.onclick = () => {
          item.count--;
          saveState();
          render();
        };

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.className = "btn green";
        plus.setAttribute("data-tooltip", "Збільшити");
        plus.onclick = () => {
          item.count++;
          saveState();
          render();
        };

        controls.append(minus, createQty(item.count), plus);
      } else {
        controls.appendChild(createQty(item.count));
      }

      counter.appendChild(controls);
      row.appendChild(counter);

      // Дії
      const actions = document.createElement("div");
      actions.className = "actions";
         const statusBtn = document.createElement("button");
        statusBtn.className = "status-btn";
        statusBtn.setAttribute("data-tooltip", item.bought ? "Позначити як не куплене" : "Позначити як куплене");
        statusBtn.textContent = item.bought ? "Не куплено" : "Куплено";
      statusBtn.onclick = () => {
        item.bought = !item.bought;
        saveState();
        render();
      };
      actions.appendChild(statusBtn);

      if (!item.bought) {
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "×";
        removeBtn.className = "btn remove";
        removeBtn.setAttribute("data-tooltip", "Видалити");
        removeBtn.onclick = () => {
          items.splice(index, 1);
          saveState();
          render();
        };
        actions.appendChild(removeBtn);
      }

      row.appendChild(actions);
      itemDiv.appendChild(row);
      itemList.appendChild(itemDiv);

      const badge = document.createElement("div");
      badge.className = "badge";
      badge.innerHTML = `${item.bought ? '<span><s>' + item.name + '</s></span>' : `<span>${item.name}</span>`} <span class="count">${item.count}</span>`;
      (item.bought ? badgeBought : badgeLeft).appendChild(badge);
    });
  }

  function createQty(count) {
    const span = document.createElement("span");
    span.className = "qty";
    span.textContent = count;
    return span;
  }
// Зміна назви товару
  function editName(span, index) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = items[index].name;
    input.className = "item-name";
    input.onblur = () => {
      items[index].name = input.value.trim() || items[index].name;
      saveState();
      render();
    };
    span.replaceWith(input);
    input.focus();
  }

  addButton.onclick = () => addItem();
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") addItem();
  });
//Додавання товару 
  function addItem() {
    const name = input.value.trim();
    if (name) {
      items.push({ name, count: 1, bought: false });
      input.value = "";
      input.focus();
      saveState();
      render();
    }
  }

  render();
  
});
