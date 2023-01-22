const { ObjectId } = require('mongodb');
const { findExpensesByTagId } = require('../queries/expenses');
const {
    validateTag,
    castCreateReqBodyToTagObject,
    castUpdateReqBodyToTagObject,
} = require('../validators/tags');
const DbService = require('../services/DbService');

const postTag = async (req, res) => {
    const workspaceId = req.workspaceId;
    const newTag = castCreateReqBodyToTagObject(
        req.body,
        workspaceId
    );
    const errors = await validateTag(newTag);

    if (errors?.length) {
        res
            .status(400)
            .json({
                message: "Tag not created",
                error: errors,
            });
    } else {
        DbService.tags.insertOne(newTag, (error, result) => {
            if (error || !result) {
                res
                    .status(500)
                    .json({
                        message: "Tag not created",
                        error,
                    });
            }

            res
                .status(200)
                .json({
                    message: "Tag created",
                    data: result,
                });

        })
    }

};

const readTags = async (req, res) => {
    const workspaceId = req.workspaceId;
    try {
        const tagsCursor = DbService.tags.find({
            workspaceId
        });
        const tags = await tagsCursor.toArray();
        res
            .status(200)
            .json({
                message: 'Tags',
                data: tags
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

const editTag = async (req, res) => {
    const { tagId } = req.params;
    const workspaceId = req.workspaceId;
    if (tagId && workspaceId && await checkIsTagPartOfWorkspace(bankId, workspaceId)) {

        const tag = await DbService.tags.findOne({ _id: ObjectId(tagId) });
        const updatedTag = castUpdateReqBodyToTagObject(req.body, tag);
        const errors = await validateTag(updatedTag);

        if (errors?.length) {
            res.status(400).json({
                message: 'Tag not updated',
                error: errors
            })
        } else {
            try {
                const result = await DbService.tags.updateOne({ _id: ObjectId(tagId) }, {
                    $set: updatedTag,
                });

                res
                    .status(200)
                    .json({
                        message: 'Tag changed successfully',
                        data: result
                    })
            }
            catch (error) {
                res
                    .status(500)
                    .json({
                        message: 'Bank not changed',
                        error
                    })
            }
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameters: bankId or workspaceId, OR bank does not exist',
            })
    }
};

const checkIsTagPartOfWorkspace = async (tagId, workspaceId) => {
    try {
        const tag = await DbService.tags.findOne({ _id: ObjectId(tagId) });
        return tag.workspaceId === workspaceId;
    } catch {
        return false
    }
}

const deleteTag = async (req, res) => {
    const { tagId } = req.params;
    const workspaceId = req.workspaceId;
    if (tagId && workspaceId && await checkIsTagPartOfWorkspace(tagId, workspaceId)) {
        try {

            const deletion = await DbService.tags.deleteOne({ _id: ObjectId(tagId) });
            
            const filter = { tagId };
            const updateDoc = {
              $set: {
                tagId:"",
              },
            };
            await DbService.expenses.updateMany(filter, updateDoc);

            res
                .status(200)
                .json({
                    message: 'Tag deleted',
                    data: `Tag ${tagId} was deleted`,
                    additional: deletion
                })
        } catch (err) {
            res
                .status(500)
                .json({
                    message: 'Tag deletion: an error ocurred',
                    error: err
                })
        }
    } else {
        res
            .status(404)
            .json({
                message: 'Missing parameters: tagId or workspaceId, OR tag does not exist',
            })
    }
};


module.exports = {
    readTags,
    postTag,
    editTag,
    deleteTag,
};