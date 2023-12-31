import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./loading.service";
import { MessagesService } from "./messages.service";
import { AuthStoreService } from "./auth-store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthStoreService) {}

  ngOnInit() {}

  logout() {
    this.auth.logout();
  }
}
