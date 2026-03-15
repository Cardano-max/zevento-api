import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { FeedService } from './feed.service';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getPosts(category?: string, city?: string, page?: string, limit?: string, authorId?: string): Promise<{
        data: {
            commentCount: number;
            _count: undefined;
            id: string;
            createdAt: Date;
            title: string | null;
            body: string;
            category: string;
            city: string | null;
            eventDate: Date | null;
            budgetPaise: number | null;
            authorId: string;
            authorRole: string;
            mediaUrls: import("@prisma/client/runtime/library").JsonValue;
            likesCount: number;
            author: {
                id: string;
                name: string | null;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createPost(user: {
        id: string;
        activeRole: string;
    }, dto: CreatePostDto): Promise<{
        id: string;
        createdAt: Date;
        title: string | null;
        body: string;
        category: string;
        city: string | null;
        eventDate: Date | null;
        budgetPaise: number | null;
        status: string;
    }>;
    deleteComment(id: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    deletePost(id: string, user: {
        id: string;
    }): Promise<{
        message: string;
    }>;
    getComments(id: string): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        authorId: string;
        author: {
            id: string;
            name: string | null;
        };
    }[]>;
    createComment(id: string, user: {
        id: string;
    }, dto: CreateCommentDto): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        author: {
            id: string;
            name: string | null;
        };
    }>;
}
