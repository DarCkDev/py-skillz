import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PythonService } from './python.service';
import { RunCodeDto } from './dto/run-code.dto';

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

  @Post('run')
  async runPythonCode(@Body() runCodeDto: RunCodeDto) {
    try {
      console.log('Received code:', runCodeDto.code);
      const result = await this.pythonService.executeCode(runCodeDto.code);
      console.log('Execution result:', result);
      return {
        success: true,
        output: result,
      };
    } catch (error) {
      console.error('Error executing code:', error);
      throw new HttpException(
        {
          success: false,
          error: error.message || 'An error occurred while executing the code',
          details: error.stack,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('run-in-docker')
  async runCode(@Body() code: RunCodeDto) {
    console.log(code);
    const result = await this.pythonService.runInDocker(code.code);

    if (result.stderr) {
      throw new InternalServerErrorException(result.stderr);
    }

    return result;
  }
}
