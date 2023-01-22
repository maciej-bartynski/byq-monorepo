const yup = require("yup");

const castCreateReqBodyToExpenseObject = (body = {}, workspaceId = "") => {
    const expenseName = typeof body.name === 'string'
        ? body.name
        : "";
    const value = typeof +body.value === 'number' && !isNaN(+body.value)
        ? +body.value
        : 0;
    const userId = typeof body.userId === 'string'
        ? body.userId
        : "";
    const bankId = typeof body.bankId === 'string'
        ? body.bankId
        : "";
    const tagId = typeof body.tagId === 'string'
        ? body.tagId
        : "";
    return {
        name: expenseName,
        value,
        userId,
        bankId,
        workspaceId,
        tagId,
        charged: false,
    }
}

const expenseSchema = yup.object().shape({
    name: yup.string().required(),
    value: yup.number().required(),
    bankId: yup.string().required(),
    userId: yup.string().required(),
    tagId: yup.string().nullable(),
    workspaceId: yup.string().required(),
    charged: yup.boolean().required(),
});

const validateExpense = async (expense) => {
    const validationError = await expenseSchema
        .validate(expense, {
            abortEarly: false,
            strict: true,
        })
        .catch(err => err);
    return validationError?.errors;
}

const castUpdateReqBodyToExpenseObject = (fields = {}, expense = {}) => {
    const expenseName = typeof fields.name === 'string'
        ? fields.name
        : expense.name;
    const value = typeof +fields.value === 'number' && !isNaN(+fields.value)
        ? +fields.value
        : expense.value;
    const userId = typeof fields.userId === 'string'
        ? fields.userId
        : expense.userId;
    const bankId = typeof fields.bankId === 'string'
        ? fields.bankId
        : expense.bankId;
    const tagId = typeof fields.tagId === 'string'
        ? fields.tagId
        : expense.tagId
    const charged = typeof fields.charged === 'boolean'
        ? fields.charged
        : !!expense.charged
    return {
        name: expenseName,
        value,
        userId,
        bankId,
        tagId,
        workspaceId: expense.workspaceId,
        charged
    }
}

module.exports = {
    castCreateReqBodyToExpenseObject,
    validateExpense,
    castUpdateReqBodyToExpenseObject
}