import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  getUserInfo(userId: any): any {
    var a = this.api.get<{ token: string }>(`users/${userId}`);

    return a;
  }
}
