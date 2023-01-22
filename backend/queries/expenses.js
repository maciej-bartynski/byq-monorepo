const { ObjectId } = require('mongodb');
const DbService = require('../services/DbService');

const insertExpense = async (newExpense) => {
    try {
        const data = DbService.expenses.insertOne(newExpense);
        return {
            success: true,
            data,
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
};

const findExpensesByWorkspaceId = async (workspaceId) => {
    try {
        const expensesCursor = DbService.expenses.find({
            workspaceId
        });
        const data = await expensesCursor.toArray();
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

const findExpenseById = async (expenseId) => {
    try {
        const data = await DbService.expenses.findOne({ _id: ObjectId(expenseId) });
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

const overwriteExpense = async (expenseId, updatedExpense) => {
    try {
        const data = await DbService.expenses.updateOne({ _id: ObjectId(expenseId) }, {
            $set: updatedExpense,
        });
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }

}

const eraseExpense = async (expenseId) => {
    try {
        const data = await DbService.expenses.deleteOne({ _id: ObjectId(expenseId) });
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

module.exports = {
    insertExpense,
    eraseExpense,
    overwriteExpense,
    findExpenseById,
    findExpensesByWorkspaceId,
};