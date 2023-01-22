const workspaceRouter = require('express').Router();
const banks = require('./banks');
const expenses = require('./expenses');
const tags = require('./tags');

workspaceRouter.get("/banks", banks.readBanks);
workspaceRouter.post("/bank", banks.postBank);
workspaceRouter.put("/bank/:bankId", banks.editBank);
workspaceRouter.delete("/bank/:bankId", banks.deleteBank);
workspaceRouter.put("/bank-pocket/:bankId", banks.markBankAsPocket);
workspaceRouter.put("/bank-unpocket/:bankId", banks.unmarkBankAsPocket);

workspaceRouter.get("/expenses", expenses.readExpenses);
workspaceRouter.post("/expense", expenses.postExpense);
workspaceRouter.put("/expense/:expenseId", expenses.editExpense);
workspaceRouter.delete("/expense/:expenseId", expenses.deleteExpense);

workspaceRouter.get("/tags", tags.readTags);
workspaceRouter.post("/tag", tags.postTag);
workspaceRouter.put("/tag/:tagId", tags.editTag);
workspaceRouter.delete("/tag/:tagId", tags.deleteTag);

module.exports = workspaceRouter;