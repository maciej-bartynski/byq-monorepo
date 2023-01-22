const yup = require("yup");
const dedupeArr = require("../tools/dedupeArr");
const dedupeArrIfInOtherArr = require("../tools/dedupeArrIfInOtherArr");

const boardSchema = yup.object().shape({
    content: yup
        .object()
        .shape({
            name: yup.string().required(),
            desc: yup.string(),
        })
        .required(),
    owners: yup
        .array()
        .of(yup.string())
        .min(1)
        .required(),
    contributors: yup
        .array()
        .of(yup.string())
        .required()
});

const validateBoard = async (board) => {
    const validationError = await boardSchema
        .validate(board, {
            abortEarly: false,
            strict: true,
        })
        .catch(err => err);
    return validationError?.errors;
}

const castCreateReqBodyToBoardObject = (body = {}, userId = null) => {
    const contentName = body.content?.name
        ? body.content.name
        : null;
    const contentDesc = body.content?.desc
        ? body.content.desc
        : "";
    const owners = body.owners instanceof Array
        ? body.owners.concat([userId])
        : [userId]
    const contributors = body.contributors
        ? body.contributors
        : []
    const dedupedContributors = dedupeArrIfInOtherArr(contributors, owners);

    return {
        content: {
            name: contentName,
            desc: contentDesc
        },
        owners: dedupeArr(owners),
        contributors: dedupeArr(dedupedContributors),
    }
}

const boardEditSchema = yup.object().shape({
    "content.name":  yup.string(),
    "content.desc": yup.string(),
    owners: yup
        .array()
        .of(yup.string()),
    contributors: yup
        .array()
        .of(yup.string())
});

const validateBoardEdition = async (boardFields) => {
    const validationError = await boardEditSchema
        .validate(boardFields, {
            abortEarly: false,
            strict: true,
        })
        .catch(err => err);
    return validationError?.errors;
}

const castUpdateReqBodyToBoardObject = (
    body = {}, 
    board,
    userId = null
) => {
 
    const isOwner = board.owners.find(item => userId === item);
    const isContributor = board.contributors.find(item => userId === item);
    let updatedBoard = {};
    if (isOwner || isContributor) {
        updatedBoard = {
            "content.name": body.content?.name || board.content.name,
            "content.desc": body.content?.desc || board.content.desc,
        };
    }
    if (isOwner) {
        updatedBoard = {
            ...updatedBoard,
            "owners": dedupeArr(board.owners.concat(body.owners || [])),
            "contributors": dedupeArrIfInOtherArr(
                dedupeArr(board.contributors.concat(body.contributors || [])),
                dedupeArr(board.owners.concat(body.owners || []))
            ),
        }
    }

    return updatedBoard;
}

module.exports = {
    castCreateReqBodyToBoardObject,
    castUpdateReqBodyToBoardObject,
    validateBoard,
    validateBoardEdition
}

