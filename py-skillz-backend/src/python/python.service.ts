import { Injectable, BadRequestException } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

@Injectable()
export class PythonService {
  private readonly tempDir: string;
  private readonly maxCodeLength: number = 10000; // 10KB máximo
  private readonly timeout: number = 5000; // 5 segundos máximo

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'py-skillz');
    console.log('Temp directory:', this.tempDir); 
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async executeCode(code: string): Promise<string> {
    console.log('Executing code...');

    // Validar longitud del código
    if (code.length > this.maxCodeLength) {
      throw new BadRequestException('Code exceeds maximum length');
    }

    // Validar código peligroso
    const dangerousPatterns = [
      'import os',
      'import sys',
      'import subprocess',
      'eval(',
      'exec(',
      '__import__',
      'open(',
      'file(',
    ];

    for (const pattern of dangerousPatterns) {
      if (code.includes(pattern)) {
        throw new BadRequestException('Code contains forbidden operations');
      }
    }

    const timestamp = Date.now();
    const fileName = `script_${timestamp}.py`;
    const filePath = path.join(this.tempDir, fileName);
    console.log('File path:', filePath); // Debug log

    try {
      // Escribir el código en un archivo temporal
      await fs.promises.writeFile(filePath, code);
      console.log('File written successfully'); // Debug log

      // Verificar si Python está instalado
      try {
        await execAsync('python --version');
      } catch (error) {
        console.error('Python not found:', error); // Debug log
        throw new BadRequestException('Python is not installed or not in PATH');
      }

      // Ejecutar el código Python con timeout
      console.log('Executing Python command...'); // Debug log
      const { stdout, stderr } = await Promise.race([
        execAsync(`python ${filePath}`),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Execution timeout')), this.timeout)
        )
      ]) as { stdout: string; stderr: string };

      console.log('Command output:', { stdout, stderr }); // Debug log

      // Limpiar el archivo temporal
      await fs.promises.unlink(filePath);
      console.log('Temporary file cleaned up'); // Debug log

      if (stderr) {
        throw new Error(stderr);
      }

      return stdout;
    } catch (error) {
      console.error('Error in executeCode:', error); // Debug log
      // Asegurarse de limpiar el archivo en caso de error
      try {
        await fs.promises.unlink(filePath);
        console.log('Temporary file cleaned up after error'); // Debug log
      } catch (unlinkError) {
        console.error('Error al eliminar archivo temporal:', unlinkError);
      }
      throw error;
    }
  }
}