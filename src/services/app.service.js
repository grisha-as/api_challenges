import { ChallengerService, ChallengesService, HeartbeatService, TodoService, TodosService } from './index'

export class App {
    constructor(request){
        this.request = request;
        this.challengerService = new ChallengerService(request);
        this.challengesService = new ChallengesService(request);
        this.heartbeatService = new HeartbeatService(request);
        this.todoService = new TodoService(request);
        this.todosService = new TodosService(request);
    }
};