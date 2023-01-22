const { ObjectId } = require('mongodb');
const DbService = require('./../dbConnect');

const insertBank = async (newBank, res) => {
    try {
        const data = await DbService.banks.insertOne(newBank);
        return {
            success: true,
            data,
        }
    } catch (error) {
        return {
            success: false,
            error,
        }
    }
}

const findBanksByWorkspaceId = async (workspaceId) => {
    try {
        const banksCursor = DbService.banks.find({
            workspaceId
        });
        const data = await banksCursor.toArray();
        return {
            success: true,
            data
        }
    } catch (error) {
        return {
            success: false,
            error
        };
    }
}

const findBankById = async (bankId) => {
    try {
        const data = await DbService.banks.findOne({ _id: ObjectId(bankId) });
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

const overwriteBank = async (bankId, updatedBank) => {
    try {
        const data = await DbService.banks.updateOne({ _id: ObjectId(bankId) }, {
            $set: updatedBank,
        });
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
}

const eraseBank = async (bankId) => {
    try {
        const data = await DbService.banks.deleteOne({ _id: ObjectId(bankId) });
        return {
            success: true,
            data,
        }
    } catch (error) {
        return {
            success: false,
            error
        };
    }
}

module.exports = {
    eraseBank,
    insertBank,
    overwriteBank,
    findBankById,
    findBanksByWorkspaceId
}