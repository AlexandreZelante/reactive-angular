import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  // Will be visible only to app.component and to its children
  providers: [LoadingService, MessagesService],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {}
}
