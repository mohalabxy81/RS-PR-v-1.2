const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');

const project = new Project({
  tsConfigFilePath: '/home/mohal665544/pr1.2/apps/api/tsconfig.json'
});

const controllers = project.getSourceFiles('src/**/*.controller.ts');

for (const sourceFile of controllers) {
  let hasChanges = false;
  
  const swaggerImports = ['ApiTags', 'ApiOperation', 'ApiResponse'];
  let swaggerImportDecl = sourceFile.getImportDeclaration('@nestjs/swagger');
  
  const classes = sourceFile.getClasses();
  let hasEndpoints = false;

  for (const cls of classes) {
    if (!cls.getDecorator('Controller')) continue;
    hasEndpoints = true;

    if (!cls.getDecorator('ApiTags')) {
      const name = cls.getName().replace('Controller', '');
      // If the class is "DealsController", tag becomes "Deals"
      cls.addDecorator({
        name: 'ApiTags',
        arguments: [`'${name}'`]
      });
      hasChanges = true;
    }

    const methods = cls.getInstanceMethods();
    for (const method of methods) {
      const isEndpoint = method.getDecorator('Get') || method.getDecorator('Post') || method.getDecorator('Put') || method.getDecorator('Delete') || method.getDecorator('Patch');
      if (!isEndpoint) continue;

      if (!method.getDecorator('ApiOperation')) {
        let summary = method.getName();
        summary = summary.replace(/([A-Z])/g, ' $1').trim();
        summary = summary.charAt(0).toUpperCase() + summary.slice(1);
        
        method.addDecorator({
          name: 'ApiOperation',
          arguments: [`{ summary: '${summary}' }`]
        });
        hasChanges = true;
      }

      if (!method.getDecorator('ApiResponse')) {
        method.addDecorator({
          name: 'ApiResponse',
          arguments: [`{ status: 200, description: 'Success' }`]
        });
        hasChanges = true;
      }
    }
  }

  if (hasChanges && hasEndpoints) {
    if (!swaggerImportDecl) {
      sourceFile.addImportDeclaration({
        moduleSpecifier: '@nestjs/swagger',
        namedImports: swaggerImports,
      });
      swaggerImportDecl = sourceFile.getImportDeclaration('@nestjs/swagger');
    } else {
      for (const imp of swaggerImports) {
        if (!swaggerImportDecl.getNamedImports().some(ni => ni.getName() === imp)) {
          swaggerImportDecl.addNamedImport(imp);
        }
      }
    }
    sourceFile.saveSync();
  }
}
console.log('Swagger generation complete for', controllers.length, 'controllers');
