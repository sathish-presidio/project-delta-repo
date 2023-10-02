import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatBotService } from '../services/chat-bot.service';
import { ChatMessageBean } from '../beans/chat-bot.bean';
import * as MarkdownIt from 'markdown-it';
const md = new MarkdownIt();

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent {

  prompt: string = '';
  isLoading: boolean = false;
  chatResponses: ChatMessageBean[] = [];
  @ViewChild('scrollContainer', { static: false }) scrollContainer: ElementRef | undefined;


  constructor(private chatBotService: ChatBotService) {
  }

  async fetchResonseForPrompt() {
    if(this.isLoading || !this.prompt) {
        return;
    }

    this.isLoading = true;
    const question = this.prompt;
    this.prompt = '';
    this.chatResponses.push({question: question, isLoading: true});
    this.scrollToBottom();
    const url = await this.getCurrentTabUrl();
    let errorResponse = false;

    if (url) {
      await this.chatBotService.fetchResponseForPrompt(url, question).subscribe((response) => {
        this.chatResponses[this.chatResponses.length - 1] = {
          ...this.chatResponses[this.chatResponses.length - 1],
          answer: md.render(response.response),
          isLoading: false
        };
        this.isLoading = false;
        this.scrollToBottom();
      }, (error) => {
        errorResponse = true;
      })
    } else {
      errorResponse = true;
      this.isLoading = false;
    }

    if (errorResponse) {
      this.chatResponses[this.chatResponses.length - 1] = {
        ...this.chatResponses[this.chatResponses.length - 1],
        answer: 'Oops! Something went wrong. Please try again',
        isLoading: false
      };
      this.scrollToBottom();
    }
  }

  async getCurrentTabUrl() {
    const tabs = await chrome.tabs.query({ "active": true, "currentWindow": true });
    return tabs[0]?.url ?? '';;
  }


  // Function to scroll to the bottom
  scrollToBottom() {
    setTimeout(() => {
      if(!this.scrollContainer) {
          return;
      }
      const container = this.scrollContainer.nativeElement;
      const scrollHeight = container.scrollHeight;
      let currentScrollTop = container.scrollTop;
      const targetScrollTop = scrollHeight - container.clientHeight;
      const scrollStep = Math.abs(targetScrollTop - currentScrollTop) / 15; // Adjust the number of steps as needed

      const scrollInterval = setInterval(() => {
        if (currentScrollTop < targetScrollTop) {
          currentScrollTop += scrollStep;
          container.scrollTop = currentScrollTop;
        } else {
          clearInterval(scrollInterval);
        }
      }, 16); // Adjust the interval as needed (60fps)
    });
  }

}
