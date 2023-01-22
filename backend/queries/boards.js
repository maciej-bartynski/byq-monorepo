const { ObjectId } = require('mongodb');
const DbService = require('../services/DbService');

const insertBoard = async (newBoard) => {
    try {
        const data = await DbService.boards.insertOne(newBoard)
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

const eraseBoard = async (boardId) => {
    try {
        const data = await DbService.boards.deleteOne({ _id: ObjectId(boardId) });
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

const overwriteBoard = async (boardId, updatedBoard) => {
    try {
        const data = await DbService.boards.updateOne({ _id: ObjectId(boardId) }, {
            $set: updatedBoard,
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

const findBoardById = async (boardId) => {
    try {
        const data = await DbService.boards.findOne({ _id: ObjectId(boardId) });
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

const findBoardsByUserId = async (userId) => {
    try {
        const boardsCursor = DbService.boards.find({
            $or: [
                { owners: { $all: [userId] } },
                { contributors: { $all: [userId] } }
            ]
        });
        const data = await boardsCursor.toArray();
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
    insertBoard,
    eraseBoard,
    findBoardById,
    findBoardsByUserId,
    overwriteBoard,
};