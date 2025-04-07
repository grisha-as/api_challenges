//todo вынести в env
let URL = 'https://apichallenges.herokuapp.com/';

export class TodosService {
    constructor(request) {
        this.request = request;
    }
    
    async get(token, accept = '*/*'){
      const response = await this.request.get(`${URL}todos`, {
          headers: {
            "x-challenger": token,
            "accept": accept,
          }
        });
      return response;
  }

  async getWithoutAccept(token) {
    const response = await this.request.fetch(`${URL}todos`, {
      method: "GET",
      headers: {
        "x-challenger": token,
        "accept": ''
      },
  
    });
    return response;
  }

    async getById(token, id = 1){
        const response = await this.request.get(`${URL}todos/${id}`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }

    async getByfilter(token, filter = 'id=1'){
        const response = await this.request.get(`${URL}todos?${filter}`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }

    async head(token){
        const response = await this.request.head(`${URL}todos`, {
            headers: {
              "x-challenger": token,
            }
          });
        return response;
    }

    async post(token, payload, accept = '*/*', type = 'application/json'){
      const response = await this.request.post(`${URL}todos`, {
          headers: {
            "x-challenger": token,
            "accept": accept,
            "content-type": type,
          },
          data: payload,
        });
      return response;
  }

    async update(token, payload, id){
        const response = await this.request.post(`${URL}todos/${id}`, {
            headers: {
              "x-challenger": token,
            },
            data: payload,
          });
        return response;
    }

    async put(token, payload, id){
        const response = await this.request.put(`${URL}todos/${id}`, {
            headers: {
              "x-challenger": token,
            },
            data: payload,
          });
        return response;
    }

    async delete(token, id){
        const response = await this.request.delete(`${URL}todos/${id}`, {
            headers: {
              "x-challenger": token,
            }
        });
        return response;
    }

    async options(token){
      const response = await this.request.fetch(`${URL}todos`, {
        method: "OPTIONS",
        headers: {
          "x-challenger": token,
        },
      });
      return response;
    }
}