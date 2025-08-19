import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerUiOptions } from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Taskly',
                description: 'API operations related to Taskly- Task Manager',
            },
        ],
        info: {
            title: 'REST API for Taskly',
            version: '1.0.0',
            description: 'API Docs for Tasks',
        },
    },
    // apis: ['./src/router.ts'],
    apis: ['./src/**/*.ts'], // ✅ Recursively find all annotated TS files
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://res.cloudinary.com/dd1gptapb/image/upload/v1751677830/portfolio/taskly_logo_qxdjom.png');
            height: 50px;
            padding-right: 140px;
        }
    `,
    customSiteTitle: 'Taskly REST API documentation',
};
export default swaggerSpec;
export { swaggerUiOptions };
