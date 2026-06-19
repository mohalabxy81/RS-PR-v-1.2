import { Version, Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../roles/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/require-permissions.decorator';
import { PERMISSIONS } from '../roles/permissions.constants';
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateTaskDto, UpdateTaskDto, AddTaskCommentDto } from './dto/task.dto';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('tasks')
@Controller({ path: 'tasks', version: '1' })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @RequirePermissions(PERMISSIONS.CREATE_TASK)
  async create(@CurrentUser() user: CurrentUserPayload, @Body() data: CreateTaskDto) {
    return this.tasksService.create(user.tenantId, user.userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'List all tasks' })
  @RequirePermissions(PERMISSIONS.READ_TASK)
  async findAll(@CurrentUser() user: CurrentUserPayload, @Query() query: any) {
    return this.tasksService.findAll(user.tenantId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details' })
  @RequirePermissions(PERMISSIONS.READ_TASK)
  async findOne(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.tasksService.findOne(user.tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({ type: UpdateTaskDto })
  @RequirePermissions(PERMISSIONS.UPDATE_TASK)
  async update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.tenantId, id, data);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiBody({ type: AddTaskCommentDto })
  @RequirePermissions(PERMISSIONS.UPDATE_TASK)
  async addComment(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() body: AddTaskCommentDto,
  ) {
    return this.tasksService.addComment(user.tenantId, id, user.userId, body.content);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @RequirePermissions(PERMISSIONS.DELETE_TASK)
  async remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.tasksService.remove(user.tenantId, id);
  }
}
