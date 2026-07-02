import Volunteer from "models/Volunteer";
import Repair from "models/Repair";

export type Response<T> = {
    status: boolean;
    msg: string;
    data: T;
};

export interface VolunteerData {
    volunteer: Volunteer;
};

export interface VolunteersData {
    volunteers: Volunteer[];
};

export interface PastVolunteersData {
    pastVolunteers: Volunteer[];
};

export interface RepairData {
    repair: Repair;
};

export interface RepairsData {
    repairs: Repair[];
};

export interface OwnerData {
    owner: { firstName: string; lastName: string; subscribedToNewsletter: boolean };
};

export interface SubscribedData {
    isSubscribed: boolean;
};

export interface IsAdminData {
    isAdmin: boolean;
};

export interface IsRegisteredData {
    isRegistered: boolean;
};

export interface SignInData {
    token: string;
    user: any;
};
