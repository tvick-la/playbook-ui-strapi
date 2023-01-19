import {Component, OnInit} from '@angular/core';
import {httpOptions} from "../auth";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  navGroups = []

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchNavigation();
  }

  fetchNavigation() {
    this.http
      .get("http://localhost:1337/api/navigation?populate[navigationGroups][populate][0]=pages", httpOptions)
      .subscribe((data: any) => {
        const navGroupData = data.data.attributes.navigationGroups.data;
        this.navGroups = navGroupData.map((navGroup: any) => {
          return {
            label: navGroup.attributes.label,
            pages: navGroup.attributes.pages.data.map((pageData: any) => {
              return {
                title: pageData.attributes.title,
                slug: pageData.attributes.slug,
              }
            })
          }
        });
      });
  }
}
