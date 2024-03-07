import { Controller, Get, Route } from 'tsoa';

interface PingResponse {
  message: string;
}

@Route('ping')
export class PingController extends Controller {
  @Get('/')
  public getMessage(): PingResponse {
    return {
      message: 'hello',
    };
  }
}
