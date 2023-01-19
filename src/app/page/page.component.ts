import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Params} from "@angular/router";
import {httpOptions} from "../auth";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  page: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchPage();
  }

  fetchPage() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params["pageSlug"]) {
        const pageSlug = params["pageSlug"];
        this.http
          .get("http://localhost:1337/api/pages?populate[contentBlocks][on][content-blocks.design-intent][populate]=*&populate[contentBlocks][on][content-blocks.skills][populate]=*&populate[contentBlocks][on][content-blocks.artifacts-for-reference][populate][Artifact][populate]=*&filters[slug][$eq]=" + pageSlug, httpOptions)
          .subscribe((responseData: any) => {this.page = this.mapPage(responseData)});
      }
    });
  }

  mapPage(data: any) {
    const pageAttributes = data.data[0].attributes;
    console.log({pageAttributes});
    return {
      title: pageAttributes.title,
      contentBlocks: this.mapContentBlocks(pageAttributes.contentBlocks),
    }
  }

  mapContentBlocks(contentBlocks: any) {
    console.log({contentBlocks});
    return contentBlocks.map((contentBlock: any) => {
      return this.mapContentBlock(contentBlock)
    })
  }

  mapContentBlock(contentBlock: any) {
    if (contentBlock.__component == 'content-blocks.design-intent') {
      return {
        type: "design-intent",
        title: contentBlock.title,
        firstPrinciples: contentBlock.firstPrinciples,
        summary: contentBlock.summary
      }
    } else if (contentBlock.__component == "content-blocks.skills") {
      return {
        type: "skills",
        title: contentBlock.title,
        roles: contentBlock.Role.map((role: any) => ({
          roleType: role.roleType,
          roleDescription: role.roleDescription,
        }))
      }
    } else if (contentBlock.__component == 'content-blocks.artifacts-for-reference') {
      return {
        type: "artifacts-for-reference",
        title: contentBlock.title,
        artifacts: contentBlock.Artifact.map((artifact: any) => ({
          title: artifact.title,
          description: artifact.description,
          fileUrl: artifact.file.data.attributes.url,
          fileType: artifact.file.data.attributes.mime,
        }))
      }
    } else {
      return {
        type: "unknown",
        data: JSON.stringify(contentBlock, null, 2)
      }
    }
  }
}
