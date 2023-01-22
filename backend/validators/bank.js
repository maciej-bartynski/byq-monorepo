const yup = require("yup");

const castCreateReqBodyToBankObject = (body = {}, workspaceId = "") => {
    const bankName = typeof body.name === 'string'
        ? body.name
        : "";
    const cash = typeof +body.cash === 'number' && !isNaN(+body.cash)
        ? +body.cash
        : 0;
    const creator = typeof body.creator === 'string'
        ? body.creator
        : "";
    const isPocket = false;
    return {
        name: bankName,
        cash,
        creator,
        isPocket,
        workspaceId
    }
}

const bankSchema = yup.object().shape({
    name: yup.string().required(),
    cash: yup.number().required(),
    creator: yup.string().required(),
    workspaceId: yup.string().required(),
    isPocket: yup.boolean().required(),
});

const validateBank = async (bank) => {
    const validationError = await bankSchema
        .validate(bank, {
            abortEarly: false,
            strict: true,
        })
        .catch(err => err);
    return validationError?.errors;
}

const castUpdateReqBodyToBankObject = (fields = {}, bank = {}) => {
    const bankName = typeof fields.name === 'string'
        ? fields.name
        : bank.name;
    const cash = typeof +fields.cash === 'number' && !isNaN(+fields.cash)
        ? +fields.cash
        : bank.cash;
    const creator = typeof fields.creator === 'string'
        ? fields.creator
        : bank.creator
    const isPocket = typeof fields.isPocket === 'boolean'
        ? fields.isPocket
        : !!bank.isPocket
    const pocketPercentage = typeof fields.pocketPercentage === 'number'
        ? fields.pocketPercentage
        : (bank.pocketPercentage || 0)
    return {
        name: bankName,
        cash,
        creator,
        workspaceId: bank.workspaceId,
        isPocket,
        pocketPercentage
    }
}
const validateBankEdition = async () => { }

module.exports = {
    validateBank,
    castCreateReqBodyToBankObject,
    castUpdateReqBodyToBankObject
}