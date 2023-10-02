import { map, Observable,  of } from "rxjs";
import { ChatQueryResponse } from "../beans/chat-bot.bean";
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable()
export class ChatBotService{

    private baseApiUrl = "http://127.0.0.1:5000"
    private mockUrl = '../../assets/mock/query_response.json';

    constructor(private http: HttpClient) {}

    fetchResponseForPrompt(url: string, prompt: string) : Observable<ChatQueryResponse>{
        return this.http.post<ChatQueryResponse>(this.baseApiUrl + "/query", {url, prompt});
    }
}