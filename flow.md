-   user logs in the app
-   user sees the current inflow and outflow for the day with the net amount.
-   user sees list of all the specific records with their categories and
    description.
-   user can create an inflow or outflow and it will automatically record it for
    that day.
-   user can filter the daily records by category, amount, amount range, or
    search by description.
-   user can also filter the daily record by sepcific date or by date range.
    common ranges - will be daily, weekly and monthly. the resulting data will
    be paginated.

## UI

There will be an overview page that show the following stats: total inflow,
total outflow, net value and a filter bar that allows the user to choose the
timeframe i.e daily, weekly or monthly or to select a custom timeframe base on a
calender date or range.

There will be a link to view all expenses for that timeframe, that leads to the
search page which is paginated and will still show the total and net values but
will now also show the list of entries and allow the user to sort through them.
By default, the user timeframe selection should be copied over but the user can
still modify it on the search page.

## Budgeting

Users can create a budget and attach it to any category and name it whatever
they want. they can only have one budget per category. they can add a timeframe
for the budget in days and set whether it is recurring.

They can set a special monthly timeframe which defaults to the first of each
month and ends on the last day of the month.

Once the budget is expired, the record will be deleted and a budget report will
be generated for that budget. If the budget is recurring, then the budget record
will instead be modified with the new time range value.

The user can modify the budget amount but can not change the timeframe once it
is created.

The user can delete a budget at any time.
