const { ObjectId } = require('mongodb');
const { castCreateReqBodyToExpenseObject, validateExpense, castUpdateReqBodyToExpenseObject } = require('../validators/expense');
const DbService = require('../services/DbService');

const postExpense = async (req, res) => {
    const workspaceId = req.workspaceId;
    const newExpense = castCreateReqBodyToExpenseObject(
        req.body,
        workspaceId
    );
    const errors = await validateExpense(newExpense);

    if (errors?.length) {
        res
            .status(400)
            .json({
                message: "Expense not created",
                error: errors,
            });
    } else {
        DbService.expenses.insertOne(newExpense, (error, result) => {
            if (error || !result) {
                res
                    .status(500)
                    .json({
                        message: "Expense not created",
                        error,
                    });
            }

            res
                .status(200)
                .json({
                    message: "Expense created",
                    data: result,
                });

        })
    }

};

const readExpenses = async (req, res) => {
    const workspaceId = req.workspaceId;
    try {
        const expensesCursor = DbService.expenses.find({
            workspaceId
        });
        const expenses = await expensesCursor.toArray();
        res
            .status(200)
            .json({
                message: 'Expenses',
                data: expenses
            })
    } catch (err) {
        res
            .status(500)
            .json({
                message: 'An error occured',
                error: err
            })
    }
};

const checkIsExpensePartOfWorkspace = async (expenseId, workspaceId) => {
    try {
        const expense = await DbService.expenses.findOne({ _id: ObjectId(expenseId) });
        return expense.workspaceId === workspaceId;
    } catch {
        return false
    }
}

const editExpense = async (req, res) => {
    const { expenseId } = req.params;
    const workspaceId = req.workspaceId;
    if (expenseId && workspaceId && await checkIsExpensePartOfWorkspace(expenseId, workspaceId)) {

        const expense = await DbService.expenses.findOne({ _id: ObjectId(expenseId) });
        const updatedExpense = castUpdateReqBodyToExpenseObject(req.body, expense);
        const errors = await validateExpense(updatedExpense);

        if (errors?.length) {
            res.status(400).json({
                message: 'Expense not updated',
                error: errors
            })
        } else {
            try {
                const result = await DbService.expenses.updateOne({ _id: ObjectId(expenseId) }, {
                    $set: updatedExpense,
                });

                res
                    .status(200)
                    .json({
                        message: 'Expense changed successfully',
                        data: result
                    })
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                        message: 'Expense not changed',
                        error
                    })
            }
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameters: expenseId or workspaceId, OR expense does not exist',
            })
    }
};

const deleteExpense = async (req, res) => {
    const { expenseId } = req.params;
    const workspaceId = req.workspaceId;
    if (expenseId && workspaceId && await checkIsExpensePartOfWorkspace(expenseId, workspaceId)) {
        try {
            const deletion = await DbService.expenses.deleteOne({ _id: ObjectId(expenseId) });
            res
                .status(200)
                .json({
                    message: 'Expense deleted',
                    data: `Expense ${expenseId} was deleted`,
                    additional: deletion
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    message: 'Expense deletion: an error ocurred',
                    error: err
                })
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameters: expenseId or workspaceId, OR expense does not exist',
            })
    }
};


module.exports = {
    readExpenses,
    postExpense,
    editExpense,
    deleteExpense,
};