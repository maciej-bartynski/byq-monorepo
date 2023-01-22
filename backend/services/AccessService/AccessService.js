const DbService = require('../DbService');
const { ObjectId } = require('mongodb');

const AccessService = {
    checkUserApiAccess(req, res, next) {
        const { userId } = req.params;
        if (!userId) {
            res.status(403).json({
                message: 'Forbidden. Parameter "userId" required to access this API.',
            })
        } else {
            req.userId = userId;
            next();
        }
    },

    async checkWorkspaceApiAccess(req, res, next) {
        const { workspaceId } = req.params;

        if (!workspaceId) {
            res.status(403).json({
                message: 'Forbidden. Parameter "workspaceId" required to access this API.',
            })
        } else {
            req.workspaceId = workspaceId;
            const board = await DbService.boards.findOne({ _id: ObjectId(req.workspaceId) });

            if (board) {
                const { owners, contributors } = board;
                const hasAccess = owners.
                    some(owner =>
                        owner === req.userId) || contributors
                            .some(contributors => contributors === req.userId)
                if (hasAccess) next();
                else res.status(403).json({ message: 'Forbidden. Not your workspace.' })

            } else {
                res.status(404).json({ message: 'Workspace not exists.' })
            }

        }
    },
}

module.exports = AccessService;