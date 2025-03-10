import RepairEvent from "models/RepairEvent";

export const emailIsValid = (email: string): boolean => {
    // Email regular expression that must find a match
    const reg = /^[a-zA-Z0-9.!#$%&'’*+\/=?^_`{|}~-]{1,64}@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{1,63}$/;
    return reg.test(email);
}

/**
 * Check if the event is in the past
 * @param event - Repair event with date in local time
 * @returns true if the event is in the past, false otherwise
 */
export const eventInThePast = (event: RepairEvent): boolean => {
    const eventUtc = new Date(event.date);
    const today = new Date();
    const todayUtc = new Date(Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    ));

    return eventUtc < todayUtc;
}

export const eventInTheFuture = (event: RepairEvent): boolean => {
    const eventUtc = new Date(event.date);
    const today = new Date();
    const todayUtc = new Date(Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    ));
    return eventUtc > todayUtc;
}
