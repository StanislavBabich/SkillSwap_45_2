"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
const logger_module_1 = require("./logger/logger.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logger_module_1.winstonLogger,
    });
    app.enableCors({
        origin: ['http://localhost:5173'],
        credentials: true,
    });
    const publicPath = (0, path_1.join)(process.cwd(), 'public');
    const uploadsPath = (0, path_1.join)(process.cwd(), 'public', 'uploads');
    console.log('Public path:', publicPath);
    console.log('Uploads path:', uploadsPath);
    app.useStaticAssets(publicPath, { prefix: '/' });
    app.useStaticAssets(uploadsPath, { prefix: '/uploads' });
    app.use((0, cookie_parser_1.default)());
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('SkillSwap API')
        .setDescription('API платформы обмена навыками SkillSwap')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const swaggerDocument = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, swaggerDocument);
    const config = app.get(app_config_1.appConfig.KEY);
    const port = config.port;
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    await app.listen(port);
    logger_module_1.winstonLogger.log(`App running on http://localhost:${port}`);
    logger_module_1.winstonLogger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
void bootstrap();
//# sourceMappingURL=main.js.map