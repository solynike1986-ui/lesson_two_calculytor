/* =========================================================
   JAVASCRIPT
   ЛОГИКА КАЛЬКУЛЯТОРА
   ========================================================= */


/* ---------------------------------------------------------
   1. НАСТРОЙКИ
   --------------------------------------------------------- */

const STORAGE_KEY = "familyBudgetData";

const GOAL_KEY = "familyBudgetGoal";

const THEME_KEY = "familyBudgetTheme";


/* ---------------------------------------------------------
   2. ЭЛЕМЕНТЫ HTML
   --------------------------------------------------------- */

const amountInput =
    document.getElementById("amount");

const categorySelect =
    document.getElementById("category");

const descriptionInput =
    document.getElementById("description");

const dateInput =
    document.getElementById("date");

const addBtn =
    document.getElementById("addBtn");

const operationsBody =
    document.getElementById("operationsBody");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");

const expensePercent =
    document.getElementById("expensePercent");

const operationCount =
    document.getElementById("operationCount");

const analysis =
    document.getElementById("analysis");

const incomeOption =
    document.getElementById("incomeOption");

const expenseOption =
    document.getElementById("expenseOption");

const themeBtn =
    document.getElementById("themeBtn");

const goalName =
    document.getElementById("goalName");

const goalAmount =
    document.getElementById("goalAmount");

const saveGoalBtn =
    document.getElementById("saveGoalBtn");

const goalTitle =
    document.getElementById("goalTitle");

const goalProgressText =
    document.getElementById("goalProgressText");

const goalProgress =
    document.getElementById("goalProgress");

const goalPercent =
    document.getElementById("goalPercent");

const editModal =
    document.getElementById("editModal");

const closeModal =
    document.getElementById("closeModal");

const editId =
    document.getElementById("editId");

const editType =
    document.getElementById("editType");

const editAmount =
    document.getElementById("editAmount");

const editCategory =
    document.getElementById("editCategory");

const editDescription =
    document.getElementById("editDescription");

const editDate =
    document.getElementById("editDate");

const saveEditBtn =
    document.getElementById("saveEditBtn");

const exportBtn =
    document.getElementById("exportBtn");

const clearBtn =
    document.getElementById("clearBtn");

const toast =
    document.getElementById("toast");


/* ---------------------------------------------------------
   3. ДАННЫЕ
   --------------------------------------------------------- */

let operations = [];

let currentType = "income";


/* ---------------------------------------------------------
   4. ЗАГРУЗКА ДАННЫХ
   --------------------------------------------------------- */

function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (saved) {

            operations =
                JSON.parse(saved);

        }

    } catch (error) {

        operations = [];

        console.error(
            "Ошибка загрузки данных:",
            error
        );

    }

}


/* ---------------------------------------------------------
   5. СОХРАНЕНИЕ ДАННЫХ
   --------------------------------------------------------- */

function saveData() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(operations)
        );

        return true;

    } catch (error) {

        console.error("Ошибка сохранения данных:", error);
        showToast("Не удалось сохранить данные в браузере");
        return false;

    }

}


/* ---------------------------------------------------------
   6. ФОРМАТИРОВАНИЕ ДЕНЕГ
   --------------------------------------------------------- */

function formatMoney(value) {

    return new Intl.NumberFormat(
        "ru-RU",
        {
            maximumFractionDigits: 2
        }
    ).format(value) + " ₽";

}


/* ---------------------------------------------------------
   7. ФОРМАТ ДАТЫ
   --------------------------------------------------------- */

function formatDate(dateString) {

    if (!dateString) {
        return "—";
    }

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return (
        parts[2] +
        "." +
        parts[1] +
        "." +
        parts[0]
    );

}


/* ---------------------------------------------------------
   8. ТЕКУЩАЯ ДАТА
   --------------------------------------------------------- */

function getToday() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* ---------------------------------------------------------
   9. ПЕРЕКЛЮЧЕНИЕ ДОХОД / РАСХОД
   --------------------------------------------------------- */

function setType(type) {

    currentType = type;

    if (type === "income") {

        incomeOption.classList.add(
            "active-income"
        );

        expenseOption.classList.remove(
            "active-expense"
        );

        setIncomeCategories();

    } else {

        incomeOption.classList.remove(
            "active-income"
        );

        expenseOption.classList.add(
            "active-expense"
        );

        setExpenseCategories();

    }

}


/* ---------------------------------------------------------
   10. КАТЕГОРИИ ДОХОДОВ
   --------------------------------------------------------- */

function setIncomeCategories() {

    categorySelect.innerHTML = `

        <option value="Зарплата">
            💼 Зарплата
        </option>

        <option value="Подработка">
            💻 Подработка
        </option>

        <option value="Пособия">
            👨‍👩‍👧 Пособия
        </option>

        <option value="Пенсия">
            👵 Пенсия
        </option>

        <option value="Подарки">
            🎁 Подарки
        </option>

        <option value="Другие доходы">
            💰 Другие доходы
        </option>

    `;

}


/* ---------------------------------------------------------
   11. КАТЕГОРИИ РАСХОДОВ
   --------------------------------------------------------- */

function setExpenseCategories() {

    categorySelect.innerHTML = `

        <option value="Жильё">
            🏠 Жильё
        </option>

        <option value="Коммунальные услуги">
            💡 Коммунальные услуги
        </option>

        <option value="Продукты">
            🛒 Продукты
        </option>

        <option value="Транспорт">
            🚗 Транспорт
        </option>

        <option value="Дети">
            👶 Дети
        </option>

        <option value="Здоровье">
            🏥 Здоровье
        </option>

        <option value="Одежда">
            👕 Одежда
        </option>

        <option value="Кредиты">
            💳 Кредиты
        </option>

        <option value="Связь и интернет">
            📱 Связь и интернет
        </option>

        <option value="Развлечения">
            🎬 Развлечения
        </option>

        <option value="Рестораны и кафе">
            🍽️ Рестораны и кафе
        </option>

        <option value="Покупки">
            🛍️ Покупки
        </option>

        <option value="Другие расходы">
            📦 Другие расходы
        </option>

    `;

}


/* ---------------------------------------------------------
   12. ДОБАВЛЕНИЕ ОПЕРАЦИИ
   --------------------------------------------------------- */

function addOperation() {

    const amount =
        Number(amountInput.value);

    const category =
        categorySelect.value;

    const description =
        descriptionInput.value.trim();

    const date =
        dateInput.value;


    /* Проверяем сумму */

    if (!amount || amount <= 0) {

        showToast(
            "Введите корректную сумму"
        );

        amountInput.focus();

        return;

    }


    /* Проверяем дату */

    if (!date) {

        showToast(
            "Укажите дату"
        );

        return;

    }


    /* Создаём операцию */

    const operation = {

        id:
            Date.now(),

        type:
            currentType,

        amount:
            amount,

        category:
            category,

        description:
            description || "Без описания",

        date:
            date

    };


    /* Добавляем */

    operations.push(
        operation
    );


    /* Сохраняем */

    saveData();


    /* Очищаем форму */

    amountInput.value = "";

    descriptionInput.value = "";


    /* Обновляем интерфейс */

    render();


    showToast(
        currentType === "income"
            ? "Доход добавлен"
            : "Расход добавлен"
    );

}


/* ---------------------------------------------------------
   13. РАСЧЁТ ИТОГОВ
   --------------------------------------------------------- */

function calculateTotals() {

    let income = 0;

    let expense = 0;


    operations.forEach(
        operation => {

            if (
                operation.type === "income"
            ) {

                income +=
                    Number(operation.amount);

            } else {

                expense +=
                    Number(operation.amount);

            }

        }
    );


    return {

        income,
        expense,
        balance:
            income - expense

    };

}


/* ---------------------------------------------------------
   14. ОБНОВЛЕНИЕ СТАТИСТИКИ
   --------------------------------------------------------- */

function updateStatistics() {

    const totals =
        calculateTotals();


    totalIncome.textContent =
        formatMoney(
            totals.income
        );


    totalExpense.textContent =
        formatMoney(
            totals.expense
        );


    balance.textContent =
        formatMoney(
            totals.balance
        );


    let percent = 0;


    if (totals.income > 0) {

        percent =
            (totals.expense /
             totals.income) *
            100;

    }


    expensePercent.textContent =
        Math.round(percent) + "%";


    /* Цвет остатка */

    if (totals.balance < 0) {

        balance.classList.remove(
            "balance-text"
        );

        balance.classList.add(
            "expense-text"
        );

    } else {

        balance.classList.remove(
            "expense-text"
        );

        balance.classList.add(
            "balance-text"
        );

    }

}


/* ---------------------------------------------------------
   15. ОТРИСОВКА ТАБЛИЦЫ
   --------------------------------------------------------- */

function renderOperations() {

    operationsBody.innerHTML = "";


    if (operations.length === 0) {

        operationsBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty"
                >

                    <div class="empty-icon">
                        🧾
                    </div>

                    <div>
                        Пока нет операций
                    </div>

                    <div
                        style="
                            margin-top:6px;
                            font-size:13px;
                        "
                    >
                        Добавьте первый доход или расход
                    </div>

                </td>

            </tr>

        `;

        operationCount.textContent =
            "0 операций";

        return;

    }


    /* Новые операции сверху */

    const sorted =
        [...operations].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    sorted.forEach(
        operation => {

            const tr =
                document.createElement("tr");


            const isIncome =
                operation.type === "income";


            tr.innerHTML = `

                <td>
                    ${formatDate(
                        operation.date
                    )}
                </td>

                <td>

                    <span class="
                        badge
                        ${
                            isIncome
                                ? "badge-income"
                                : "badge-expense"
                        }
                    ">

                        ${
                            isIncome
                                ? "Доход"
                                : "Расход"
                        }

                    </span>

                </td>

                <td>
                    ${escapeHtml(
                        operation.category
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        operation.description
                    )}
                </td>

                <td class="
                    ${
                        isIncome
                            ? "amount-income"
                            : "amount-expense"
                    }
                ">

                    ${
                        isIncome
                            ? "+"
                            : "-"
                    }

                    ${formatMoney(
                        operation.amount
                    )}

                </td>

                <td>

                    <div class="actions">

                        <button
                            class="
                                btn
                                btn-secondary
                                btn-small
                            "
                            onclick="
                                openEdit(
                                    ${operation.id}
                                )
                            "
                            title="Редактировать"
                        >
                            ✏️
                        </button>

                        <button
                            class="
                                btn
                                btn-danger
                                btn-small
                            "
                            onclick="
                                deleteOperation(
                                    ${operation.id}
                                )
                            "
                            title="Удалить"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            operationsBody.appendChild(
                tr
            );

        }
    );


    operationCount.textContent = getOperationCountText(operations.length);

}


function getOperationCountText(number) {

    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n >= 11 && n <= 19) {
        return number + " операций";
    }

    if (n1 === 1) {
        return number + " операция";
    }

    if (n1 >= 2 && n1 <= 4) {
        return number + " операции";
    }

    return number + " операций";
}


/* ---------------------------------------------------------
   16. ЗАЩИТА ОТ HTML ВВОДА
   --------------------------------------------------------- */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ---------------------------------------------------------
   17. УДАЛЕНИЕ ОПЕРАЦИИ
   --------------------------------------------------------- */

function deleteOperation(id) {

    const confirmed =
        confirm(
            "Удалить эту операцию?"
        );


    if (!confirmed) {
        return;
    }


    operations =
        operations.filter(
            operation =>
                operation.id !== id
        );


    saveData();

    render();

    showToast(
        "Операция удалена"
    );

}


/* ---------------------------------------------------------
   18. ОТКРЫТИЕ РЕДАКТИРОВАНИЯ
   --------------------------------------------------------- */

function openEdit(id) {

    const operation =
        operations.find(
            item =>
                item.id === id
        );


    if (!operation) {
        return;
    }


    editId.value =
        operation.id;

    editType.value =
        operation.type;

    editAmount.value =
        operation.amount;

    editCategory.value =
        operation.category;

    editDescription.value =
        operation.description;

    editDate.value =
        operation.date;


    editModal.classList.add(
        "show"
    );

}


/* ---------------------------------------------------------
   19. ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
   --------------------------------------------------------- */

function closeEditModal() {

    editModal.classList.remove(
        "show"
    );

}


/* ---------------------------------------------------------
   20. СОХРАНЕНИЕ РЕДАКТИРОВАНИЯ
   --------------------------------------------------------- */

function saveEdit() {

    const id =
        Number(editId.value);


    const operation =
        operations.find(
            item =>
                item.id === id
        );


    if (!operation) {
        return;
    }


    const amount =
        Number(editAmount.value);


    if (!amount || amount <= 0) {

        showToast(
            "Введите корректную сумму"
        );

        return;

    }

    if (!editDate.value) {
        showToast("Укажите дату");
        return;
    }


    operation.type =
        editType.value;

    operation.amount =
        amount;

    operation.category =
        editCategory.value.trim()
        || "Без категории";

    operation.description =
        editDescription.value.trim()
        || "Без описания";

    operation.date =
        editDate.value;


    saveData();

    render();

    closeEditModal();

    showToast(
        "Изменения сохранены"
    );

}


/* ---------------------------------------------------------
   21. АНАЛИЗ БЮДЖЕТА
   --------------------------------------------------------- */

function updateAnalysis() {

    const totals =
        calculateTotals();


    if (
        operations.length === 0
    ) {

        analysis.innerHTML =
            "Добавьте операции, чтобы увидеть анализ бюджета.";

        return;

    }


    const income =
        totals.income;

    const expense =
        totals.expense;

    const currentBalance =
        totals.balance;


    let percent = 0;


    if (income > 0) {

        percent =
            (expense / income) * 100;

    }


    /* Находим самые большие расходы */

    const expenses =
        operations.filter(
            item =>
                item.type === "expense"
        );


    expenses.sort(
        (a, b) =>
            Number(b.amount) -
            Number(a.amount)
    );


    let biggestExpenseText =
        "";


    if (expenses.length > 0) {

        const biggest =
            expenses[0];

        biggestExpenseText =
            `
            Самый крупный расход:
            <strong>
                ${escapeHtml(
                    biggest.category
                )}
            </strong>
            —
            ${formatMoney(
                biggest.amount
            )}.
            `;

    }


    let message = "";


    if (income === 0) {

        message =
            "Пока нет доходов. Добавьте доходы семьи для расчёта.";

    }

    else if (currentBalance < 0) {

        message =
            `
            ⚠️ Расходы превышают доходы.
            Текущий баланс:
            <strong>
                ${formatMoney(
                    currentBalance
                )}
            </strong>.
            `;

    }

    else if (percent > 90) {

        message =
            `
            Расходы составляют примерно
            <strong>
                ${Math.round(percent)}%
            </strong>
            от доходов.
            `;

    }

    else if (percent > 70) {

        message =
            `
            Расходы составляют
            <strong>
                ${Math.round(percent)}%
            </strong>
            от доходов.
            `;

    }

    else {

        message =
            `
            После учёта расходов остаётся
            <strong>
                ${formatMoney(
                    currentBalance
                )}
            </strong>.
            `;

    }


    analysis.innerHTML =
        `
        ${message}

        <br><br>

        ${biggestExpenseText}

        <br>

        💡 Остаток можно направлять
        на накопления, финансовую подушку
        или достижение вашей цели.
        `;

}


/* ---------------------------------------------------------
   22. ФИНАНСОВАЯ ЦЕЛЬ
   --------------------------------------------------------- */

function saveGoal() {

    const name =
        goalName.value.trim();

    const amount =
        Number(
            goalAmount.value
        );


    if (!name) {

        showToast(
            "Введите название цели"
        );

        return;

    }


    if (!amount || amount <= 0) {

        showToast(
            "Введите сумму цели"
        );

        return;

    }


    const goal = {

        name,
        amount

    };


    localStorage.setItem(
        GOAL_KEY,
        JSON.stringify(goal)
    );


    updateGoal();

    showToast(
        "Финансовая цель сохранена"
    );

}


/* ---------------------------------------------------------
   23. ОБНОВЛЕНИЕ ЦЕЛИ
   --------------------------------------------------------- */

function updateGoal() {

    const saved =
        localStorage.getItem(
            GOAL_KEY
        );


    if (!saved) {

        goalTitle.textContent =
            "Цель не установлена";

        goalProgressText.textContent =
            "0 ₽";

        goalProgress.style.width =
            "0%";

        goalPercent.textContent =
            "0%";

        return;

    }


    let goal;

    try {
        goal = JSON.parse(saved);
    } catch (error) {
        localStorage.removeItem(GOAL_KEY);
        goalTitle.textContent = "Цель не установлена";
        goalProgressText.textContent = "0 ₽";
        goalProgress.style.width = "0%";
        goalPercent.textContent = "0%";
        return;
    }

    const goalValue = Number(goal.amount);

    if (!goal || !goal.name || !Number.isFinite(goalValue) || goalValue <= 0) {
        localStorage.removeItem(GOAL_KEY);
        goalTitle.textContent = "Цель не установлена";
        goalProgressText.textContent = "0 ₽";
        goalProgress.style.width = "0%";
        goalPercent.textContent = "0%";
        return;
    }

    goalTitle.textContent =
        "🎯 " + escapeHtml(goal.name);


    const totals =
        calculateTotals();


    /*
       В качестве накоплений
       используем положительный остаток.
    */

    const savedMoney =
        Math.max(
            0,
            totals.balance
        );


    let percent =
        (savedMoney / goalValue) *
        100;


    percent =
        Math.min(
            100,
            percent
        );


    goalProgressText.textContent =
        formatMoney(
            savedMoney
        ) +
        " / " +
        formatMoney(
            goalValue
        );


    goalProgress.style.width =
        percent + "%";


    goalPercent.textContent =
        Math.round(percent) +
        "% выполнено";

}


/* ---------------------------------------------------------
   24. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
   --------------------------------------------------------- */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        THEME_KEY,
        isDark
            ? "dark"
            : "light"
    );


    themeBtn.textContent =
        isDark
            ? "☀️"
            : "🌙";

}


/* ---------------------------------------------------------
   25. ЗАГРУЗКА ТЕМЫ
   --------------------------------------------------------- */

function loadTheme() {

    const saved =
        localStorage.getItem(
            THEME_KEY
        );


    if (saved === "dark") {

        document.body.classList.add(
            "dark"
        );

        themeBtn.textContent =
            "☀️";

    } else {

        themeBtn.textContent =
            "🌙";

    }

}


function csvEscape(value) {
    return String(value ?? "").replace(/"/g, '""');
}


/* ---------------------------------------------------------
   26. ЭКСПОРТ В CSV
   --------------------------------------------------------- */

function exportCSV() {

    if (operations.length === 0) {

        showToast(
            "Нет операций для экспорта"
        );

        return;

    }


    let csv =
        "Дата;Тип;Категория;Описание;Сумма\n";


    operations.forEach(
        operation => {

            const type =
                operation.type === "income"
                    ? "Доход"
                    : "Расход";


            csv +=
                `"${csvEscape(operation.date)}";` +
                `"${csvEscape(type)}";` +
                `"${csvEscape(operation.category)}";` +
                `"${csvEscape(operation.description)}";` +
                `"${csvEscape(operation.amount)}"\n`;

        }
    );


    /*
       BOM нужен для правильного
       отображения русского текста
       в Excel.
    */

    const BOM =
        "\uFEFF";


    const blob =
        new Blob(
            [
                BOM + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href = url;

    link.download =
        "semeynyy-byudzhet.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Файл CSV скачан"
    );

}


/* ---------------------------------------------------------
   27. ОЧИСТКА ВСЕХ ДАННЫХ
   --------------------------------------------------------- */

function clearAll() {

    if (operations.length === 0) {

        showToast(
            "Бюджет уже пуст"
        );

        return;

    }


    const confirmed =
        confirm(
            "Вы действительно хотите удалить все операции?"
        );


    if (!confirmed) {
        return;
    }


    operations = [];

    localStorage.removeItem(GOAL_KEY);
    goalName.value = "";
    goalAmount.value = "";

    saveData();

    render();

    showToast(
        "Все операции удалены"
    );

}


/* ---------------------------------------------------------
   28. УВЕДОМЛЕНИЕ
   --------------------------------------------------------- */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* ---------------------------------------------------------
   29. ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА
   --------------------------------------------------------- */

function render() {

    updateStatistics();

    renderOperations();

    updateAnalysis();

    updateGoal();

}


/* ---------------------------------------------------------
   30. ОБРАБОТЧИКИ СОБЫТИЙ
   --------------------------------------------------------- */


/* Доход */

incomeOption.addEventListener(
    "click",
    () => {

        setType(
            "income"
        );

    }
);


/* Расход */

expenseOption.addEventListener(
    "click",
    () => {

        setType(
            "expense"
        );

    }
);


/* Добавить */

addBtn.addEventListener(
    "click",
    addOperation
);


/* Сохранить цель */

saveGoalBtn.addEventListener(
    "click",
    saveGoal
);


/* Тема */

themeBtn.addEventListener(
    "click",
    toggleTheme
);


/* Экспорт */

exportBtn.addEventListener(
    "click",
    exportCSV
);


/* Очистить */

clearBtn.addEventListener(
    "click",
    clearAll
);


/* Закрыть окно */

closeModal.addEventListener(
    "click",
    closeEditModal
);


/* Сохранить редактирование */

saveEditBtn.addEventListener(
    "click",
    saveEdit
);


/* Закрытие по клику за окном */

editModal.addEventListener(
    "click",
    event => {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


/* Enter в поле суммы */

amountInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addOperation();

        }

    }
);


/* ---------------------------------------------------------
   31. НАЧАЛЬНАЯ ИНИЦИАЛИЗАЦИЯ
   --------------------------------------------------------- */


/* Загружаем данные */

loadData();


/* Загружаем тему */

loadTheme();


/* Устанавливаем сегодняшнюю дату */

dateInput.value =
    getToday();


/* Устанавливаем доход */

setType(
    "income"
);


/* Загружаем цель */

const savedGoal =
    localStorage.getItem(
        GOAL_KEY
    );


if (savedGoal) {

    try {

        const goal =
            JSON.parse(
                savedGoal
            );

        goalName.value =
            goal.name;

        goalAmount.value =
            goal.amount;

    } catch (error) {

        console.error(
            "Ошибка загрузки цели:",
            error
        );

    }

}


/* Первый рендер */

render();
