const URL = "https://apichallenges.herokuapp.com/";

export class ChallengerService {
    constructor(request) {
        this.request = request;
    }
    async post () {
        const response = await this.request.post(`${URL}challenger`);
        return response;
    }

    async get (guid, token) {
        const response = await this.request.get(`${URL}challenger/${guid}`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }

    async getDatabase (guid, token) {
        const response = await this.request.get(`${URL}challenger/database/${guid}`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }

    async put (guid, token, payload) {
        const response = await this.request.put(`${URL}challenger/${guid}`, {
            headers: {
              "x-challenger": token,
            },
            data: payload,
          });
        return response;
    }

    async putDatabase (guid, token, payload) {
        const response = await this.request.put(`${URL}challenger/database/${guid}`, {
            headers: {
              "x-challenger": token,
            },
            data: payload,
          });
        return response;
    }
}