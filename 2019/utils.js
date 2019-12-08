function setArray(array, indexes, value) {
    let root = array;
    let parent = null;
    for (let index of indexes) {
        if (!array[index]) {
            array[index] = [];
        }

        parent = array;
        array = array[index];
    }

    parent[indexes[indexes.length - 1]] = value;

    return root;
}

module.exports = {
    setArray
}