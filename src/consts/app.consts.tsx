
const StorageConsts = {
    AUTH: '@auth',
};

const Config = {
    OFFLINE: false,
}

const Regex = {
    SIMPLE_DATE: /^\d{4}-\d{2}-\d{2}$/,
    EMAIL: /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/,
}

export {
    StorageConsts,
    Config,
    Regex,
};