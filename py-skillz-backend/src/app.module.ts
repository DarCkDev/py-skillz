import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './modules/user/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/upload/upload.module';
import { CursoModule } from './modules/curso/curso.module';
import { Curso } from './modules/curso/entities/curso.entity';
import { Tema } from './modules/curso/entities/tema.entity';
import { Subtitulo } from './modules/curso/entities/subtitulo.entity';
import { Ejercicio } from './modules/curso/entities/ejercicio.entity';
import { Examen } from './modules/curso/entities/examen.entity';
import { EjercicioExa } from './modules/curso/entities/ejercicio-exa.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Curso, Tema, Subtitulo, Ejercicio, Examen, EjercicioExa],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Curso,
      Tema,
      Subtitulo,
      Ejercicio,
      Examen,
      EjercicioExa,
    ]),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      fallbacks: {
        es: 'es',
        qu: 'qu',
        ay: 'ay',
        gn: 'gn',
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        {
          use: QueryResolver,
          options: ['lang', 'locale'],
        },
      ],
    }),
    AuthModule,
    UserModule,
    UploadModule,
    CursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
