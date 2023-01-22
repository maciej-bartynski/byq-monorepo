const { ObjectId } = require('mongodb');
const {
    validateBoard,
    castCreateReqBodyToBoardObject,
    castUpdateReqBodyToBoardObject,
    validateBoardEdition
} = require('../validators/board');
const DbService = require('../services/DbService');
const queries = require('../queries/boards');

const postBoard = async (req, res) => {
    const userId = req.userId;
    const newBoard = castCreateReqBodyToBoardObject(req.body, userId);
    const errors = await validateBoard(newBoard);

    if (errors?.length) {
        res.status(400).json({
            message: "Board not created",
            error: errors,
        });
    } else {
        const result = await queries.insertBoard(newBoard);
        const status = result.success ? 200 : 500;
        const message = result.success ? 'Board created' : `Board not inserted to db: ${result.error}`;
        const payload = result.success ? { data: result.data } : { error: result.error };
        res.status(status).json({
            message,
            ...payload,
        });
    }
};

const getBoards = async (req, res) => {
    const userId = req.userId;
    try {
        const result = await queries.findBoardsByUserId(userId);
        const message = result.success ? 'Boards' : 'Boards not found';
        const status = result.success ? 200 : 500;
        const payload = result.success ? { data: result.data } : { error: result.error };
        res.status(status).json({
            message,
            ...payload
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

const getBoard = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;
    if (boardId) {
        try {
            const result = await queries.findBoardById(boardId);
            const isOwner = result.success
                ? result.data.owners.find(item => userId === item)
                : null;
            const isContributor = result.success
                ? result.data.contributors.find(item => userId === item)
                : null;
            const status = isOwner || isContributor ? 200 : 403;
            const message = isOwner || isContributor ? 'Board' : 'Forbidden';
            const payload = isOwner || isContributor ? { data: result.data } : { error: result.error || "" };
            res.status(status).json({
                message,
                ...payload
            })
        } catch (err) {
            res.status(500).json({
                message: 'An error ocurred',
                error: err
            })
        }
    } else {
        res.status(404).json({
            message: 'Missing parameter boardId',
        })
    }
};

const putBoard = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;

    if (!boardId || !req.body) { 
        return res.status(400).json({
            message: 'Missing boardId or request body'
        })
    }

    const board = await queries.findBoardById(boardId);
    const updatedBoard = board.success
        ? castUpdateReqBodyToBoardObject(req.body, board.data, userId)
        : null;
    const errors = updatedBoard
        ? await validateBoardEdition(updatedBoard)
        : ['Casting fields to  board failure'];

    if (errors?.length) {
        res.status(400).json({
            message: 'Board not updated',
            error: errors
        })
    } else {
        const result = await queries.overwriteBoard(boardId, updatedBoard);
        const status = result.success ? 200 : 500;
        const message = result.success ? 'Board successfully updated' : 'Board not updated';
        const payload = result.success ? { data: result.data } : { error: result.error || "" }
        res.status(status).json({
            message,
            ...payload
        })
    }
};

const deleteBoard = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;
    if (boardId) {
        try {
            const board = await queries.findBoardById(boardId);
            const isOwner = board.data.owners.find(item => userId === item);

            if (isOwner) {
                const deleteRequests = board.data?.deleteRequests instanceof Array
                    ? [...board.data?.deleteRequests, userId]
                    : [userId]
                const everyoneAgreedToDelete = deleteRequests.length === board.data.owners.length;
                if (everyoneAgreedToDelete) {
                    const result = await queries.eraseBoard(boardId)
                    res
                        .status(200)
                        .json({
                            message: 'Board deleted',
                            data: `Board ${board.data.content.name} was deleted`,
                            additional: board.data
                        })
                } else {
                    const result = await DbService.boards.updateOne({ _id: ObjectId(boardId) }, {
                        $set: { deleteRequests },
                    });

                    res
                        .status(200)
                        .json({
                            message: 'Deletion request added.',
                            data: `Deletion request for board: ${board.data.content.name} - was added.`,
                            additional: result
                        })
                }
            } else {
                res
                    .status(403)
                    .json({
                        message: 'Forbidden'
                    })
            }
        } catch (err) {
            res
                .status(500)
                .json({
                    message: 'An error occured',
                    error: err
                })
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameter boardId',
            })
    }
};

const cancelDeleteBoard = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.userId;
    if (boardId) {
        try {
            const board = await DbService.boards.findOne({ _id: ObjectId(boardId) });

            const newDeleteRequests = board?.deleteRequests instanceof Array
                ? board?.deleteRequests.filter(requestorId => requestorId !== userId)
                : board.deleteRequests;

            const result = await DbService.boards.updateOne({ _id: ObjectId(boardId) }, {
                $set: { deleteRequests: newDeleteRequests },
            });

            res
                .status(200)
                .json({
                    message: 'Deletion request removed.',
                    data: `Deletion request for board: ${board.content.name} - was removed.`,
                    additional: result
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    message: 'An error occured',
                    error: err
                })
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameter boardId',
            })
    }
};

module.exports = {
    getBoards,
    postBoard,
    getBoard,
    putBoard,
    deleteBoard,
    cancelDeleteBoard
};