const dedupeArrIfInOtherArr = (arrToDedupe, arr) => {
    const deduped = [];

    for (let i = 0; i < arrToDedupe.length; i++) {
        const currentValue = arrToDedupe[i];
        const duplicate = arr.some(item => item === currentValue);
        if (duplicate) { 
            continue
        } else {
            deduped.push(currentValue);
        }
    }

    return deduped
}

module.exports = dedupeArrIfInOtherArr