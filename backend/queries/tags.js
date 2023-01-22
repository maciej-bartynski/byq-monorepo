const { ObjectId } = require('mongodb');
const DbService = require('./../dbConnect');

const insertTag = async (newTag, res) => {
    try {
        const data = await DbService.tags.insertOne(newTag);
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

const findTagsByWorkspaceId = async (workspaceId) => {
    try {
        const tagsCursor = DbService.tags.find({
            workspaceId
        });
        const data = await tagsCursor.toArray();
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

const findTagById = async (tagId) => {
    try {
        const data = await DbService.tags.findOne({ _id: ObjectId(tagId) });
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

const overwriteTag = async (tagId, updatedTag) => {
    try {
        const data = await DbService.tags.updateOne({ _id: ObjectId(tagId) }, {
            $set: updatedTag,
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

const eraseTag = async (tagId) => {
    try {
        const data = await DbService.tags.deleteOne({ _id: ObjectId(tagId) });
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
    eraseTag,
    insertTag,
    overwriteTag,
    findTagById,
    findTagsByWorkspaceId
}