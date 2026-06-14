import { FilesService } from './files.service';
import type { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    getUploadUrl(user: CurrentUserPayload, filename: string, contentType: string, folder?: string): Promise<{
        uploadUrl: string;
        key: string;
        filename: string;
    }>;
    getDownloadUrl(user: CurrentUserPayload, key: string): Promise<{
        url: string;
    }>;
}
