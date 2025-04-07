import { test, expect } from '@playwright/test';
import { ChallengerService, ChallengesService, TodosService, TodoService, HeartbeatService } from '../src/services/index';
import { TodoBuilder, payloadToXml, generationGuid, generationProgress } from '../src/helper/index';
test.use({ storageState: { cookies: [], origins: [] } });

let challengerService, progressData;

/* const apiReq = await request.newContext({
            baseUrl: URL,
        }); */

test.describe('API challenges', () => {
    let token;

    test.beforeAll(async ({ request }) => {
        challengerService = new ChallengerService(request);
        const response = await challengerService.post();
        token = response.headers()["x-challenger"];
        
        //expect(response.status()).toBe(201);
        //console.log('Это токен '+token); //токен для контроля прогресса

    });
    
    test("ID 02 GET /challenges @API_pozitive", async ({ request }) => {
        const challengesService = new ChallengesService(request);
        let response = await challengesService.get(token);
        let body = await response.json();

        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
        expect(body.challenges.length).toBe(59);
    });

    test("ID 03 GET /todos  @API_pozitive", async ({ request }) => {
      const todosService = new TodosService(request);
      let response = await todosService.get(token);
      let body = await response.json();
      
      expect(response.status()).toBe(200);
      expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
      expect(body.todos[0]).toHaveProperty('id', 'title', 'doneStatus:', 'description:');  
    });

    test("ID 04 GET /todo (404) not plural  @API_negative", async ({ request }) => {
      const todoService = new TodoService(request);
      let response = await todoService.get(token);
            
      expect(response.status()).toBe(404);
    });

    test("ID 05 GET /todos/{id}  @API_pozitive", async ({ request }) => {
      const todosService = new TodosService(request);
      let response = await todosService.getById(token);
      let body = await response.json();
            
      expect(response.status()).toBe(200);
      expect(body.todos).toHaveLength(1);
      expect(body.todos[0]).toHaveProperty('id', 'title', 'doneStatus:', 'description:');  
    });

    test("ID 06 GET /todos/{id} (404)  @API_negative", async ({ request }) => {
      const todosService = new TodosService(request);
      let response = await todosService.getById(token, 555777);
      let body = await response.json();
            
      expect(response.status()).toBe(404);
      expect(body.errorMessages).toBeTruthy();
    });

    test("ID 07 GET /todos ?filter  @API_pozitive", async ({ request }) => {
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addStatus(true)
          .addDescription()
          .generate();
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);

      response = await todosService.getByfilter(token, 'doneStatus=true');
      let body = await response.json();
            
      expect(response.status()).toBe(200);
      expect(body.todos[0]).toEqual(expect.objectContaining({ "doneStatus": true  }))
    });

    test("ID 08 HEAD /todos  @API_pozitive", async ({ request }) => {
      const todosService = new TodosService(request);
      let response = await todosService.head(token);
            
      expect(response.status()).toBe(200);
      expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
    });

    test("ID 09 POST todos  @API_pozitive", async ({ request }) => {
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addStatus(true)
          .addDescription()
          .generate();
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(201);
      expect(body).toMatchObject(todoBuilder);  
    });

    test("ID 10 POST /todos (400) doneStatus  @API_negative", async ({ request }) => {
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addStatus(1)
          .addDescription()
          .generate();
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(400);
      expect(body.errorMessages).toBeTruthy();  
    });

    test("ID 11 POST /todos (400) title too long  @API_negative", async ({ request }) => {
      //Maximum length allowed is 50
      const todoBuilder = new TodoBuilder()
          .addTitle(51)
          .addStatus(true)
          .addDescription()
          .generate();
      
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(400);
      expect(body.errorMessages).toBeTruthy();  
    });

    test("ID 12 POST /todos (400) description too long  @API_negative", async ({ request }) => {
      //Maximum length allowed is 200
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addStatus(true)
          .addDescription(201)
          .generate();

      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(400);
      expect(body.errorMessages).toBeTruthy();  
    });

    test("ID 13 POST /todos (201) max out content @API_pozitive", async ({ request }) => {
     //Title maximum length allowed is 50 & Description maximum length allowed is 200
      const todoBuilder = new TodoBuilder()
        .addTitle(50)
        .addStatus(true)
        .addDescription(200)
        .generate();
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(201);
      expect(body).toHaveProperty('id', 'title', 'doneStatus:', 'description:');  
    });

    test("ID 14 POST /todos (413) content too long @API_negative", async ({ request }) => {
      //Maximum allowable 5000 characters
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addStatus(true)
          .addDescription(5001)
          .generate();
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(413);
      expect(body.errorMessages).toBeTruthy();  
    });

    test("ID 15 POST /todos (400) extra @API_negative", async ({ request }) => {
      const todoBuilder = new TodoBuilder()
          .addTitle()
          .addDescription()
          .generate();
      todoBuilder.priority = 1;  
      
      const todosService = new TodosService(request);
      let response = await todosService.post(token, todoBuilder);
      let body = await response.json();
      
      expect(response.status()).toBe(400);
      expect(body.errorMessages).toBeTruthy();  
    });

    test("ID 16 PUT /todos/{id} (400) @API_negative", async ({ request }) => {
      const todoBuilder = new TodoBuilder()
          .addStatus(true)
          .addDescription()
          .generate();
      const todosService = new TodosService(request);
      let response = await todosService.put(token, todoBuilder, 122223);
      let body = await response.json();
        
      expect(response.status()).toBe(400);
      expect(body.errorMessages).toBeTruthy();
      });

      test("ID 17 POST /todos/{id} (200) @API_pozitive", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        const todosService = new TodosService(request);
        let response = await todosService.update(token, todoBuilder, 1);
        let body = await response.json();
        
        expect(response.status()).toBe(200);
        expect(body).toMatchObject(todoBuilder);  
      });

      test("ID 18 POST /todos/{id} (404) @API_negative", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        const todosService = new TodosService(request);
        let response = await todosService.update(token, todoBuilder, 1223);
        let body = await response.json();
        
        expect(response.status()).toBe(404);
        expect(body.errorMessages).toBeTruthy();
      });

      test("ID 19 PUT /todos/{id} full @API_pozitive", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        const todosService = new TodosService(request);
        let response = await todosService.put(token, todoBuilder, 7);
        let body = await response.json();
        
        expect(response.status()).toBe(200);
        expect(body).toMatchObject(todoBuilder); 
      });

      test("ID 20 PUT /todos/{id} partial @API_pozitive", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .generate();

        const todosService = new TodosService(request);
        let response = await todosService.put(token, todoBuilder, 2);
        let body = await response.json();
        
        expect(response.status()).toBe(200);
        expect(body).toMatchObject(todoBuilder); 
      });

      test("ID 21 	PUT /todos/{id} no title (400) @API_negative", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addStatus(true)
            .addDescription()
            .generate();
        const todosService = new TodosService(request);
        let response = await todosService.put(token, todoBuilder, 3);
        let body = await response.json();
        
        expect(response.status()).toBe(400);
        expect(body.errorMessages).toBeTruthy();
      });

      test("ID 22 	PUT /todos/{id} no amend id (400) @API_negative", async ({ request }) => {
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        todoBuilder.id = 55;  
        const todosService = new TodosService(request);
        let response = await todosService.put(token, todoBuilder, 5);
        let body = await response.json();
        
        expect(response.status()).toBe(400);
        expect(body.errorMessages).toBeTruthy();
      });

      test("ID 23 	DELETE /todos/{id} (200) @API_pozitive", async ({ request }) => {
        
        const todosService = new TodosService(request);
        let response = await todosService.getById(token, 2);
        expect(response.status()).toBe(200);

        response = await todosService.delete(token, 2);
        expect(response.status()).toBe(200);

        response = await todosService.getById(token, 2);
        expect(response.status()).toBe(404);
      });

       test("ID 24 	OPTIONS /todos (200)  @API_pozitive", async ({ request }) => {
        
        const todosService = new TodosService(request);
        let response = await todosService.options(token);
        
        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "allow":'OPTIONS, GET, HEAD, POST'  }));
      });

      test("ID 25 GET /todos (200) XML @API_pozitive", async ({ request }) => {
        const accept = 'application/xml';
        const todosService = new TodosService(request);
        let response = await todosService.get(token, accept);
        let body = await response.text();
        
        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "content-type": accept }));
        expect(body).toContain('<todos>');
      });

      test("ID 26 GET /todos (200) JSON @API_pozitive", async ({ request }) => {
        const accept = 'application/json';
        const todosService = new TodosService(request);
        let response = await todosService.get(token, accept);
        let body = await response.json();
        
        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "content-type": accept }));
        expect(body.todos[0]).toHaveProperty('id', 'title', 'doneStatus:', 'description:');
      });

      //ID 27 GET /todos (200) ANY == ID 03 GET /todos

      test("ID 28 GET /todos (200) XML pref @API_pozitive", async ({ request }) => {
        const accept = 'application/xml, application/json';
        const preferredFormat = 'application/xml'

        const todosService = new TodosService(request);
        let response = await todosService.get(token, accept);
        let body = await response.text();
        
        expect(response.status()).toBe(200);
        expect(response.headers()).toEqual(expect.objectContaining({ "content-type": preferredFormat }));
        expect(body).toContain('<todos>');
      });

      test("ID 29 GET /todos (200) no accept @API_pozitive", async ({ request }) => {
        const todosService = new TodosService(request);
        let response = await todosService.getWithoutAccept(token);
        let body = await response.json();
        
        expect(response.status()).toBe(200);
        expect(body.todos[0]).toHaveProperty('id', 'title', 'doneStatus:', 'description:');
      });

      test("ID 30 GET /todos (406) @API_negative", async ({ request }) => {
        const accept = 'application/gzip';
        
        const todosService = new TodosService(request);
        let response = await todosService.get(token, accept);
        let body = await response.json();
        
        expect(response.status()).toBe(406);
        expect(body.errorMessages).toBeTruthy();
      });

      test("ID 31 POST /todos XML @API_pozitive", async ({ request }) => {
        const type = 'application/xml'
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        const payload = payloadToXml(todoBuilder);
        const todosService = new TodosService(request);
        let response = await todosService.post(token, payload, type, type);
        let body = await response.text();
        
        expect(response.status()).toBe(201);
        expect(response.headers()).toEqual(expect.objectContaining({ "content-type": type }));
        expect(body).toContain(`<title>${todoBuilder.title}`);  
      }); 

     test("ID 32 POST /todos JSON @API_pozitive", async ({ request }) => {
        const type = 'application/json'
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();

        const todosService = new TodosService(request);
        let response = await todosService.post(token, todoBuilder, type, type);
        let body = await response.json();
        
        expect(response.status()).toBe(201);
        expect(body).toMatchObject(todoBuilder);  
      });

      test("ID 33 POST /todos (415) @API_negative", async ({ request }) => {
        const type = 'fog'
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();

        const todosService = new TodosService(request);
        let response = await todosService.post(token, todoBuilder, '*/*', type);
        let body = await response.json();
        
        expect(response.status()).toBe(415); 
        expect(body.errorMessages).toBeTruthy();
      });

      test("ID 34 GET /challenger/guid (existing X-CHALLENGER) @API_pozitive", async ({ request }) => {
        const challengerService = new ChallengerService(request);
        let response = await challengerService.get(token, token);
        progressData = await response.json();
        
        expect(response.status()).toBe(200);
        expect(progressData).toHaveProperty('xAuthToken', 'xChallenger', 'secretNote', 'challengeStatus')
      });

      test("ID 35 PUT /challenger/guid RESTORE @API_pozitive", async ({ request }) => {
        //const guid = 'e54775c4-0653-4f07-a0c5-86a9b40603d8';
        
       const challengerService = new ChallengerService(request);
        let response = await challengerService.get(token, token);
        progressData = await response.json();
        response = await challengerService.put(token, token, progressData);
                
       expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
      });

      test("ID 36 PUT /challenger/guid CREATE @API_pozitive", async ({ request }) => {
        
        const newguid = generationGuid();
        
        const challengerService = new ChallengerService(request);
        let response = await challengerService.get(token, token);
        progressData = await response.json();
        
        const progress = generationProgress(progressData, newguid);
        response = await challengerService.put(newguid, newguid, progress);
        //console.log(`сгенеренный гуид ${newguid}`)
                       
        expect(response.status()).toBe(201);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": newguid }));
        
      });

      test("ID 37 GET /challenger/database/guid (200) @API_pozitive", async ({ request }) => {
        const challengerService = new ChallengerService(request);
        let response = await challengerService.getDatabase(token, token);
        let body = await response.json();
                
        expect(response.status()).toBe(200);
        expect(body.todos[0]).toBeTruthy();
      });

      test("ID 38 PUT /challenger/database/guid (Update) @API_pozitive", async ({ request }) => {
        const challengerService = new ChallengerService(request);
        let response = await challengerService.getDatabase(token, token);
        let payload = await response.json();

        response = await challengerService.putDatabase(token, token, payload);
                        
        expect(response.status()).toBe(204);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
      });

      test("ID 39 POST /todos XML to JSON @API_pozitive", async ({ request }) => {
        const type = 'application/xml';
        const accept = 'application/json';
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();
        const payload = payloadToXml(todoBuilder);

        const todosService = new TodosService(request);
        let response = await todosService.post(token, payload, accept, type);
        let body = await response.json();
        
        expect(response.status()).toBe(201);
        expect(body).toMatchObject(todoBuilder);  
      });

      test("ID 40 POST /todos JSON to XML @API_pozitive", async ({ request }) => {
        const type = 'application/json';
        const accept = 'application/xml';
        const todoBuilder = new TodoBuilder()
            .addTitle()
            .addStatus(true)
            .addDescription()
            .generate();

        const todosService = new TodosService(request);
        let response = await todosService.post(token, todoBuilder, accept, type);
        let body = await response.text();
        
        expect(response.status()).toBe(201);
        expect(body).toContain('<todo>');  
      });

      test("ID 41 DELETE /heartbeat (405) @API_negative", async ({ request }) => {
        const heartbeatService = new HeartbeatService(request);
        let response = await heartbeatService.delete(token);
        
        expect(response.status()).toBe(405);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
      });

      test("ID 42 PATCH /heartbeat (500) @API_negative", async ({ request }) => {
        const heartbeatService = new HeartbeatService(request);
        let response = await heartbeatService.patch(token);
        
        expect(response.status()).toBe(500);
      });

      test("ID 43 TRACE /heartbeat (501) @API_negative", async ({ request }) => {
        const heartbeatService = new HeartbeatService(request);
        let response = await heartbeatService.trace(token);
       
        expect(response.status()).toBe(501);
      });

      test("ID 44 GET /heartbeat (204) @API_pozitive", async ({ request }) => {
        const heartbeatService = new HeartbeatService(request);
        let response = await heartbeatService.get(token);
                
        expect(response.status()).toBe(204);
        expect(response.headers()).toEqual(expect.objectContaining({ "x-challenger": token }));
      });

});