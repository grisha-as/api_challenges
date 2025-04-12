//todo вынести в env
let URL = 'https://apichallenges.herokuapp.com/';

export class TodoService {
    constructor(request) {
        this.request = request;
    }
    async get(token){
        const response = await this.request.get(`${URL}todo`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }
}