/**
 * @description Logic for requests that go to <api>/repairs/get-stats
 */

import axios from 'axios';
import Api from 'requests/request-consts';
import { Response, StatsData } from 'types/Response';

/**
 * Get aggregate repair statistics (all-time and per-year) for the dashboard.
 * @returns Promise which resolves to the stats response, or rejects
 */
export const getRepairStats = async (): Promise<Response<StatsData>> => {
    const res: Response<StatsData> = await axios.get(Api.Repairs.GET_STATS);

    if (!res.status) {
        throw new Error(res.msg);
    }

    if (!res.data?.stats) {
        throw new Error("Stats not found");
    }

    return res;
};
