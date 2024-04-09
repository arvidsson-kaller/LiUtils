import { Controller, Patch, Route, Security } from "tsoa";
import { populateStudieinfoData } from "@src/services/StudieinfoService";

@Security("api_key")
@Route("studieinfo")
export class StudieinfoController extends Controller {
  @Patch()
  public async populateData() {
    await populateStudieinfoData();
  }
}
