import RepairEvent from "models/RepairEvent";

export const emailIsValid = (email: string): boolean => {
    // Email regular expression that must find a match
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return reg.test(email);
}

export const eventInThePast = (event: RepairEvent): boolean => {
    const eventDate = new Date(event.date);
    const eventUtc = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate(),
    );
    const today = new Date();
    const todayUtc = new Date(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
    );
    return eventUtc < todayUtc;
}

export const eventInTheFuture = (event: RepairEvent): boolean => {
    const eventDate = new Date(event.date);
    const eventUtc = new Date(
        eventDate.getUTCFullYear(),
        eventDate.getUTCMonth(),
        eventDate.getUTCDate(),
    );
    const today = new Date();
    const todayUtc = new Date(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
    );
    return eventUtc > todayUtc;
}
