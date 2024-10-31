Here’s a refined design for your expense tracker app based on your updated
specifications:

---

### App Naming Convention

We'll use the terms "**Inflow**" (for income) and "**Outflow**" (for expenses)
throughout the app. These terms are simple and intuitive for users to
understand. Inflow represents money coming into the user's account, and outflow
represents money being spent.

---

### Core Functionality Overview:

#### 1. **Inflow Management**:

-   **Add New Inflow**: Users can add new inflow records when they receive
    income.
    -   **Fields**: Amount, Category (chosen from income categories), Date,
        Description.
    -   **Income Categories**: Users can categorize the source of inflow (e.g.,
        Salary, Freelance, Interest).
    -   Users can create new income categories as needed.

#### 2. **Outflow Management**:

-   **Add New Outflow**: Users can add new outflow records when they spend
    money.
    -   **Fields**: Amount, Category (chosen from expense categories), Date,
        Description.
    -   **Expense Categories**: Users can categorize expenses (e.g., Groceries,
        Utilities, Transportation).
    -   Users can create new expense categories as needed.

#### 3. **Category Management**:

-   There are two types of categories: **Income Categories** and **Expense
    Categories**.
-   **Create New Categories**: Users can add custom categories to either type
    (e.g., "Gift" for Income, "Entertainment" for Expenses).
-   **Edit/Delete Categories**: Users can edit or delete existing categories.

#### 4. **Budgeting Feature**:

-   **Create Budget**: Users can create a budget for a specific **expense
    category**.
    -   **Fields**: Budget Amount, Expense Category, Start Date, End Date, and
        Description.
    -   Once a budget is created, the app tracks all outflow records in that
        expense category within the specified time frame.
-   **Track Budget**: Users can view their budget's progress, including:

    -   The total amount spent in the budget period.
    -   The remaining budget.
    -   A notification if the budget is exceeded.

-   **No Recurring Budgets**: Budgets are created for fixed periods with a start
    and end date, and the user manually creates new budgets for new periods.

---

### Database Schema Design

#### 1. **Inflow Records Table**:

Each inflow record represents income.

```sql
CREATE TABLE inflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,  -- Linked to income categories
    description TEXT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### 2. **Outflow Records Table**:

Each outflow record represents an expense.

```sql
CREATE TABLE outflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,  -- Linked to expense categories
    description TEXT,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### 3. **Categories Table**:

There are two types of categories: income categories for inflows and expense
categories for outflows.

```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,  -- Category name (e.g., 'Salary', 'Groceries')
    type TEXT NOT NULL,  -- 'income' or 'expense'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 4. **Budgets Table**:

Each budget is linked to an expense category and has a time period (start date
and end date).

```sql
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    expense_category_id INTEGER NOT NULL,  -- Linked to expense category
    amount DECIMAL(10, 2) NOT NULL,  -- Budgeted amount
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (expense_category_id) REFERENCES categories(id)
);
```

---

### User Stories

1. **Inflow Management**:

    - As a user, I want to record inflows when I receive income, so I can track
      the money coming into my account.
    - As a user, I want to categorize my inflows (e.g., Salary, Freelance), so I
      can understand where my income is coming from.
    - As a user, I want to create new income categories if none of the default
      categories fit my needs.

2. **Outflow Management**:

    - As a user, I want to record outflows when I spend money, so I can track my
      expenses.
    - As a user, I want to categorize my outflows (e.g., Groceries, Rent), so I
      can organize my expenses.
    - As a user, I want to create new expense categories if none of the default
      categories fit my needs.

3. **Budgeting**:

    - As a user, I want to create a budget for a specific expense category, so I
      can control how much I spend in that category.
    - As a user, I want to specify a start date and end date for the budget, so
      I can set a time frame for when I need to track expenses.
    - As a user, I want to monitor my spending against the budget, so I know if
      I’m on track or exceeding my budget.
    - As a user, I want to receive a notification if I exceed the budget, so I
      can adjust my spending accordingly.

4. **Category Management**:
    - As a user, I want to create, edit, or delete income or expense categories,
      so I can fully customize how I organize my inflows and outflows.

---

### Fine-Tuned Functional Flow

1. **Add New Inflow**:

    - The user clicks the "Inflow" button to create a new record.
    - The user enters the inflow amount, selects or creates an income category,
      adds a description (optional), and selects the date (defaults to the
      current date).

2. **Add New Outflow**:

    - The user clicks the "Outflow" button to create a new record.
    - The user enters the outflow amount, selects or creates an expense
      category, adds a description (optional), and selects the date (defaults to
      the current date).

3. **Create a Budget**:

    - The user clicks on the "Budgets" section and creates a new budget.
    - The user selects an expense category, enters the budget amount, start
      date, end date, and adds a description (optional).
    - The system tracks all outflows for the selected category within the
      budget’s time frame and provides a summary of total spent, remaining
      amount, and alerts if the budget is exceeded.

4. **Track Spending in Real-Time**:
    - The user can view a summary of inflows, outflows, and budget statuses on
      their dashboard.
    - The system alerts the user if they are approaching or have exceeded any
      budget.

---

### Example Use Cases

1. **User Adds New Inflow**:

    - John receives his salary of ₦200,000 on the 30th of each month. He records
      an inflow in the app by selecting the "Salary" category, entering
      ₦200,000, and clicking "Save." This inflow is now logged in the app.

2. **User Adds New Outflow**:

    - John goes grocery shopping and spends ₦10,000. He records an outflow in
      the app by selecting the "Groceries" category, entering ₦10,000, and
      clicking "Save." This outflow is now deducted from his account balance.

3. **User Creates a Budget**:
    - John sets a budget of ₦50,000 for groceries for the month of October. He
      selects the "Groceries" expense category, enters the budget amount, and
      specifies October 1st as the start date and October 31st as the end date.
    - As John logs his grocery expenses, the app automatically tracks how much
      he has spent against his budget. If John exceeds ₦50,000, he receives a
      notification.

---

With these features, your expense tracker app will provide a comprehensive and
user-friendly experience for managing inflows, outflows, categories, and
budgets.
