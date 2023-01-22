const yup = require("yup");

const castCreateReqBodyToTagObject = (body = {}, workspaceId = "") => {
    const tagName = typeof body.name === 'string' && !!body.name.trim()
        ? body.name.trim()
        : "";
    const theme = typeof body.theme === 'string' && !!body.theme.trim()
        ? body.theme.trim()
        : "";
    return {
        name: tagName,
        theme,
        workspaceId
    }
}

const tagSchema = yup.object().shape({
    name: yup.string().required(),
    theme: yup.string().required(),
    workspaceId: yup.string().required(),
});

const validateTag = async (tag) => {
    const validationError = await tagSchema
        .validate(tag, {
            abortEarly: false,
            strict: true,
        })
        .catch(err => err);
    return validationError?.errors;
}

const castUpdateReqBodyToTagObject = (fields = {}, tag = {}) => {
    const tagName = typeof fields.name === 'string' && fields.name.trim()
        ? fields.name.trim()
        : tag.name;
    const theme = typeof fields.theme === 'string' && !!fields.theme.trim()
        ? fields.theme.trim()
        : tag.theme;
    return {
        name: tagName,
        theme,
        workspaceId: tag.workspaceId,
    }
}
const validateTagEdition = async () => { }

module.exports = {
    validateTag,
    castCreateReqBodyToTagObject,
    castUpdateReqBodyToTagObject
}