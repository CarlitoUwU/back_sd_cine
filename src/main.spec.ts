import { bootstrap } from "./main";
import { AppModule } from "./app/app.module";
import { NestFactory } from "@nestjs/core";

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
    }),
  }
}));

jest.mock('@nestjs/swagger', () => ({
  // Decoradores
  ApiProperty: () => () => { },
  ApiPropertyOptional: () => () => { },
  ApiTags: () => () => { },
  ApiBearerAuth: () => () => { },
  ApiResponse: () => () => { },
  ApiOperation: () => () => { },
  ApiParam: () => () => { },
  ApiQuery: () => () => { },
  ApiBody: () => () => { },
  ApiConsumes: () => () => { },
  ApiProduces: () => () => { },

  // Mapped Types
  OmitType: (BaseClass: any) => BaseClass,
  PickType: (BaseClass: any) => BaseClass,
  PartialType: (BaseClass: any) => BaseClass,
  IntersectionType: (...classes: any[]) => classes[0],

  // Swagger runtime
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({}),
    setup: jest.fn(),
  },

  // Builder
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),
}));

describe('Bootstrap main.ts', () => {

  let mockApp: {
    useGlobalPipes: jest.Mock;
    setGlobalPrefix: jest.Mock;
    enableCors: jest.Mock;
    listen: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      useGlobalPipes: jest.fn(),
      setGlobalPrefix: jest.fn(),
      enableCors: jest.fn(),
      listen: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  const OLD_PORT = process.env.PORT;

  afterEach(() => {
    process.env.PORT = OLD_PORT;
  });

  it('should create app', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule)
  });

  it('should setup global prefix', async () => {
    await bootstrap();

    expect(mockApp.setGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('should listen on port 3000 if env port not set', async () => {
    delete process.env.PORT;

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  it('should listen on env port if set', async () => {
    process.env.PORT = '8080';

    await bootstrap();

    expect(mockApp.listen).toHaveBeenCalledWith(Number(process.env.PORT));
  });

  it('should use global pipes', async () => {
    await bootstrap();

    expect(mockApp.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        errorHttpStatusCode: 400,
        validatorOptions: expect.objectContaining({
          whitelist: true,
        }),
      }),
    );
  });
});
