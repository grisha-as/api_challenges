//todo вынести в енв
let URL = 'https://apichallenges.herokuapp.com/';

export class HeartbeatService {
    constructor(request) {
        this.request = request;;
    }
    async get(token){
        const response = await this.request.get(`${URL}heartbeat`, {
            headers: {
            "x-challenger": token },
        });
        return response;
    }

    async delete(token){
        const response = await this.request.delete(`${URL}heartbeat`, {
            headers: {
            "x-challenger": token },
        });
        return response;
    }

    async patch(token){
        const response = await this.request.patch(`${URL}heartbeat`, {
            headers: {
            "x-challenger": token },
        });
        return response;
    }

    async trace(token){
        const response = await this.request.fetch(`${URL}heartbeat`, {
            method: "TRACE",
            headers: {
            "x-challenger": token },
        });
        return response;
    }
}